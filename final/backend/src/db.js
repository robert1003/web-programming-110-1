import mongoose from 'mongoose';
const Schema = mongoose.Schema
const UserSchema = new Schema({
  userName: { type: String, required: true },
  password: { type: String, required: true },
});

const CommentSchema = new Schema({
  author: { type: mongoose.Types.ObjectId, ref: "User" },
  createTime: {type: Date, required: true },
  content: { type: String, required: true },
  post: { type: mongoose.Types.ObjectId, ref: "Post" }
});

const BoardSchema = new Schema({
  boardName: { type: String, required: true },
  posts: [{ type: mongoose.Types.ObjectId, ref: "Post"}]
});

const PostSchema = new Schema({
    createTime: {type: Date, required: true },
    lastReviseTime: {type: Date, required: true },
    title: { type: String, required: true },
    board: { type: mongoose.Types.ObjectId, ref: "Board" },
    content: { type: String, required: true },
    author: { type: mongoose.Types.ObjectId, ref: "User" },
    comments: [{ type: mongoose.Types.ObjectId, ref: "Comment"}]
});

const UserModel = mongoose.model("User", UserSchema);
const CommentModel = mongoose.model("Comment", CommentSchema);
const BoardModel = mongoose.model("Board", BoardSchema);
const PostModel = mongoose.model("Post", PostSchema);
export { UserModel, CommentModel, BoardModel, PostModel }