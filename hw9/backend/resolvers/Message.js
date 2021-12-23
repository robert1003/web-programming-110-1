
const Message = {
	sender(parent, args, { db }, info) {
		console.log(parent);
		console.log(parent.sender);
		return db.models.User.findById(parent.sender);
	},
};

export default Message;