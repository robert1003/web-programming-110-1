// User
const getUserByName = async (db, userName, errFunc) => {
    if(!userName) throw new Error("Missing user name for " + errFunc);
    return await db.UserModel.findOne({ userName });
};
const newUser = async (db, userName, password) => {
    return await new db.UserModel({userName, password}).save();
};

// Comment
const getCommentsByPostId = async (db, PostId, errFunc) => {
    if(!PostId) throw new Error("Missing PostId for " + errFunc);
    return await db.CommentModel.find({ post: PostId });
};

const getCommentById = async (db, CommentId, errFunc) => {
    if(!CommentId) throw new Error("Missing CommentId for " + errFunc);
    return await db.CommentModel.findById(CommentId).populate('author');
}
const newComment = async (db, post, author, content) => {
    return await new db.CommentModel({
        author,
        createTime: Date.now(),
        content,
        post
    }).save();
}

// Post
const getPostById = async (db, PostId, errFunc) => {
    if(!PostId) throw new Error("Missing PostId for " + errFunc);
    return await db.PostModel.findById(PostId).populate('author')
    .populate('board')
    .populate({ 
        path: 'comments',
        populate: {
          path: 'author'
        } 
     });
};
const newPost = async (db, title, author, board, content) => {
    return await new db.PostModel({
        createTime: Date.now(),
        lastReviseTime: Date.now(),
        title,
        board,
        content,
        author,
        comments: []
    }).save();
}

// Board
const getBoardByName = async (db, boardName, errFunc) => {
    if(!boardName) throw new Error("Missing board name for " + errFunc);
    return await db.BoardModel.findOne({ boardName });
};

const newBoard = async (db, boardName) => {
    return await new db.BoardModel({boardName}).save();
}


export {
    getUserByName,
    newUser,
    getCommentsByPostId,
    getCommentById,
    newComment,
    getPostById,
    newPost,
    getBoardByName,
    newBoard
};