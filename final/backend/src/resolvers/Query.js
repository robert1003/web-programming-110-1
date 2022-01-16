import Board from "./Board";
import { getUserByName, getCommentsByPostId, getPostById, getBoardByName, getCommentById } from "./utilities";
const Query = {
  user(parent, args, { db }) {
    return getUserByName(db, args.UserName, "query user");
  },
  post(parent, args, { db }){
    return getPostById(db, args.PostId, "query post");
  },
  board(parent, args, { db }){
    return getBoardByName(db, args.BoardName, "query board");
  },
  comment(parent, args, { db }){
    return getCommentById(db, args.CommentId, "query comment");
  }
};

export default Query;

