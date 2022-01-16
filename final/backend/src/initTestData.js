import { newBoard, newComment, newPost, newUser } from "./resolvers/utilities";
const initUserTestData = async (db) => {
    await db.UserModel.deleteMany({});
    const users = []
    for(let i = 0; i < 3; i++){
        users.push(newUser(db, "User" + i, i));
    }
    await Promise.all(users);
}

const initBoardTestData = async (db) => {
    await db.BoardModel.deleteMany({});
    const boards = []
    for(let i = 0; i < 3; i++){
        boards.push(newBoard(db, "Board" + i));
    }
    await Promise.all(boards);
}

const initPostAndCommentTestData = async (db) => {
    await db.PostModel.deleteMany({});
    await db.CommentModel.deleteMany({});
    for(let i = 0; i < 3; i++){
        const title = "Post" + i;
        const authorName = "User" + i;
        const author = await db.UserModel.findOne({userName: authorName});
        const boardName = "Board" + i;
        const board = await db.BoardModel.findOne({boardName});
        const postContent = "Post content " + i;
        const commentContent = "Comment content " + i
        const post = await newPost(db, title, author._id, board._id, postContent);
        const comment = await newComment(db, post._id, author._id, commentContent);
        post.comments.push(comment);
        await post.save();
    }
}

const initTestData = (db) => {
    initUserTestData(db);
    initBoardTestData(db);
    initPostAndCommentTestData(db);
}

export default initTestData;