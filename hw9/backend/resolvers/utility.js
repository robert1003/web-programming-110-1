
const checkUser = (db, name, errFunc) => {
	if (!name) {
		throw new Error("Missing user name for " + errFunc);
	}
	return db.models.User.findOne({ name });
 };

const newUser = (db, name) => {
	return new db.models.User({ name }).save();
}

const makeName = (name1, name2) => {
	return (name1 < name2 ? `${name1}_${name2}` : `${name2}_${name1}`);
}

const checkChatBox = (db, name, errFunc) => {
	if (!name) {
		throw new Error("Missing chatBox name for " + errFunc);
	}
	return db.models.ChatBox.findOne({ name });
};

const newChatBox = (db, name) => {
	return new db.models.ChatBox({ name: name }).save();
};

const checkMessage = (db, name,) => {

};

const newMessage = (db, sender, message) => {
	return db.models.Message({ sender: sender._id, body: message }).save();
};

export { checkUser, newUser, makeName, checkChatBox, 
		newChatBox, checkMessage, newMessage}