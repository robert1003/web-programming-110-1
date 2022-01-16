const { ApolloServer, gql } = require('apollo-server');
const { applyMiddleware } = require('graphql-middleware');
import { makeExecutableSchema } from '@graphql-tools/schema';
import * as jwt from 'jsonwebtoken';
import { rule, shield, and, or, not, allow, deny } from 'graphql-shield';

import * as db from './db';
import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';
import mongo from './mongo';
import typeDefs from './schema'
import Board from './resolvers/Board'
import Post from './resolvers/Post'
import initTestData from './initTestData';
import "dotenv-defaults/config.js";
initTestData(db);

function getAuthUser(req) {
  let token;
  try {
    token = jwt.verify(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET);
  } catch (e) {
    return null;
  }
  return token.userId;
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
  }
}, {
  allowExternalErrors: true,
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

const server = new ApolloServer({
  schema,
  context: ({ req }) => ({
    db,
    authUser: getAuthUser(req)
  })
});
  
mongo();
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
