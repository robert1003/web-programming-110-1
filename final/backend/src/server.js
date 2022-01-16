import express from "express";
import { ApolloServer } from 'apollo-server-express';
import { applyMiddleware } from 'graphql-middleware';
import { makeExecutableSchema } from '@graphql-tools/schema';
import jwt from 'jsonwebtoken';
import { rule, shield, and, or, not, allow, deny } from 'graphql-shield';
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import * as db from './db.js';
import Query from './resolvers/Query.js';
import Mutation from './resolvers/Mutation.js';
import mongo from './mongo.js';
import typeDefs from './schema.js'

import Board from './resolvers/Board.js'
import Post from './resolvers/Post.js'
import initTestData from './initTestData.js';
import { execute, subscribe } from "graphql";
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { fileURLToPath } from "url";
import { dirname } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));

const port = process.env.PORT || 8080;
const startServer = async () =>{
  initTestData(db);
  const app = express();
  const httpServer = http.createServer(app);
  app.use(cors());
  app.use(bodyParser.json());
  const frontendBuildPath = path.join(__dirname, "../build");
  app.use(express.static(frontendBuildPath));
  app.get("/*", function (req, res) {
    res.sendFile(path.join(frontendBuildPath, "index.html"));
  });
  function getAuthUser(req) {
    let token;
    try {
      token = jwt.verify(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET);
    } catch (e) {
      return null;
    }
    return token.userName;
  }

  const isAuthenticated = rule()(async (parent, args, ctx, info) => {
    return ctx.authUser !== null;
  });

  const permissions = shield({
    Query: {
      user: allow,
      comment: allow,
      post: allow
    },
    Mutation: {
      createUser: allow,
      login: not(isAuthenticated),
      createPost: isAuthenticated,
      createComment: isAuthenticated,
    },
  });

  const schema = applyMiddleware(
    makeExecutableSchema({
      typeDefs: typeDefs,
      resolvers: {
        Query,
        Mutation,
        Board,
        Post,
      },
    }),
    process.env.REQUIRED_AUTH === 'true' ? permissions : {}
  );

  const subscriptionServer = SubscriptionServer.create({
    schema,
    execute,
    subscribe,
  },{
    server: httpServer,
    path: '/graphql',
  }
  )

  const server = new ApolloServer({
    schema,
    context: ({ req }) => ({
      db,
      authUser: getAuthUser(req)
    }),
    playground: true,
    plugins: [{
      async serverWillStart(){
        return {
          async drainServer() {
            subscriptionServer.close();
          }
        }
      }
    }]
  });
  await server.start();
  server.applyMiddleware({ app });
  
  mongo();
  await new Promise(resolve => httpServer.listen({ port }, resolve));
  console.log(`🚀 Server ready at ${port}! 🚀`);
  console.log(`🚀 Graphql ready at ${port}${server.graphqlPath}`);
} 
export default startServer;
