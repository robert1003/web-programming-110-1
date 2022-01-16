import { UserInputError } from "apollo-server-express";
import { getUserByName, newUser, newPost, getBoardByName, getPostById, newComment } from "./utilities.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv-defaults/config.js";

const Mutation = {
    login: async (parent, args, { db }) => {
        const { UserName, Password } = args;
        const user = await getUserByName(db, UserName, 'login');
        if (!user) {
            throw new UserInputError('Username not exist');
        }
    
        const valid = await bcrypt.compare(Password, user.password);
        if (!valid) {
            throw new UserInputError('Invalid password');
        }
    
        const token = jwt.sign({ userId: user.username }, process.env.JWT_SECRET);
    
        return { userName: UserName, token: token };
    },
    createUser: async (root, args, { db, authUser }) => {
        const { UserName, Password } = args;
        const user = await getUserByName(db, UserName, 'createUser');
        if (user) {
            throw new UserInputError('This name has been used');
        }

        const hashedPassword = await bcrypt.hash(Password, parseInt(process.env.SALT_ROUND));
        newUser(db, UserName, hashedPassword);
        
        const token = jwt.sign({ userName: UserName }, process.env.JWT_SECRET, { expiresIn: '1 day' });

        return { userName: UserName, token: token };
    }, 
    createPost: async (root, args, { db }) => {
        const { Title, AuthorName, Content, BoardName } = args;
        if(!Title){
            throw new UserInputError('Post title is empty');
        }
        if(!Content){
            throw new UserInputError('Post content is empty');
        }
        const Author = await getUserByName(db, AuthorName, "createPost");
        if(!Author){
            throw new UserInputError('Author does not exsit');
        }
        const Board = await getBoardByName(db, BoardName, "createPost");
        if(!Board){
            throw new UserInputError('Board does not exsit');
        }
        const Post = await newPost(db, Title, Author, Board, Content);
        Board.posts.push(Post);
        await Board.save();
        return Post;
    },

    createComment: async (root, args, { db }) => {
        const { PostId, AuthorName, Content } = args;
        const Post = await getPostById(db, PostId, "create comment");
        if(!Post){
            throw new UserInputError('Post does not exsit');
        }
        const Author = await getUserByName(db, AuthorName, "createPost");
        if(!Author){
            throw new UserInputError('Author does not exsit');
        }
        if(!Content){
            throw new UserInputError('Post content is empty');
        }
        const Comment = await newComment(db, Post, Author, Content);
        Post.comments.push(Comment);
        await Post.save();
        return Comment;
    },
}
export default Mutation;