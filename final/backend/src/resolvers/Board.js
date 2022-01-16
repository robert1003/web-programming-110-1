const Board = {
    posts(parent, args, { db }, info) {
        return Promise.all(
            parent.posts.map(
                (Id) => db.PostModel.findById(Id).populate('author')
            )
        );
    },
};

export default Board