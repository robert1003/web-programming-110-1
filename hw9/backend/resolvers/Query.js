
import { checkUser, newUser, makeName, checkChatBox, 
		newChatBox, checkMessage, newMessage } from './utility';

const Query = {
	async chatbox(parent, { name1, name2 }, { db, pubsub }, info) {
		const chatBoxName = makeName(name1, name2);
		let chatBox = await checkChatBox(db, chatBoxName, "chatbox");
		return chatBox;
	}
}

export default Query;