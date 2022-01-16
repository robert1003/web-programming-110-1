const Post = {
    comments(parent, args, { db }, info) {
        return Promise.all(
            parent.comments.map(
                (Id) => db.CommentModel.findById(Id).populate('author')
            )
        );
    },
};

export default Post