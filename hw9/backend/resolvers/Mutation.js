
import { checkUser, newUser, makeName, checkChatBox, 
		newChatBox, checkMessage, newMessage } from './utility';

const Mutation = {
	async createChatBox(parent, { name1, name2 }, { db, pubsub }, info) {
		/*
		if (!name1 || !name2) {
			throw new Error("Missing chatBox name for CreateChatBox");
		}
		*/

		if (!(await checkUser(db, name1, "createChatBox"))) {
			console.log("User does not exist for CreateChatBox: " + name1);
			await newUser(db, name1);
		}
		if (!(await checkUser(db, name2, "createChatBox"))) {
			console.log("User does not exist for CreateChatBox: " + name2);
			await newUser(db, name2);
		}

		const chatBoxName = makeName(name1, name2);
		let chatBox = await checkChatBox(db, chatBoxName, "createChatBox");
		if (!chatBox) chatBox = await newChatBox(db, chatBoxName);
		
		return chatBox;
	},
	async createMessage(parent, { sender, receiver, message }, { db, pubsub }, info) {
		let userSender = await checkUser(db, sender, "createMessage");
		let userReceiver = await checkUser(db, receiver, "createMessage");
		if (!userSender || !userReceiver) {
			throw new Error("sender and/or receiver does not exist (createMessage)");
		}

		const chatBoxName = makeName(sender, receiver);
		let chatBox = await checkChatBox(db, chatBoxName, "createMessage");
		if (!chatBox) {
			throw new Error(`chatBox ${chatBoxName} does not exist (createMessage`);
		}

		let _message = await newMessage(db, userSender, message);
		if (!_message) {
			throw new Error(`error adding new message to db`);
		}
		chatBox.messages.push(_message._id);
		await chatBox.save();
		
		pubsub.publish(`message ${chatBoxName}`, {
			message: await _message.populate()
		});
		

		return await _message.populate();
	}
}

export default Mutation;