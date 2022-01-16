import { gql } from 'apollo-server-express';
const typeDefs = gql`
  scalar Date

  type Query {
    user(UserName: String!): User
    board(BoardName: String!): Board
    post(PostId: ID!): Post
    comment(CommentId: ID!): Comment
  }

  type Mutation {
    login(UserName: String!, Password: String!): AuthPayLoad!
    createUser(UserName: String!, Password: String!): AuthPayLoad!
    createPost(Title: String!, AuthorName: String!, Content: String!, BoardName: String!): Post!
    createComment(PostId: ID!, AuthorName: String!, Content: String!): Comment!
  }

  type User {
    id: ID!
    userName: String!
  }

  type AuthPayLoad {
    userName: String!,
    token: String!
  }

  type Comment {
    id: ID!
    author: User!
    createTime: Date!
    content: String!
    post: Post!
  }

  type Post {
    id: ID!
    createTime: Date!
    lastReviseTime: Date!
    title: String!
    board: Board!
    content: String!
    author: User
    comments: [Comment!]
  }

  type Board {
    id: ID!
    boardName: String!
    posts: [Post!]
  }
`
export default typeDefs;
