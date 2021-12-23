
import { checkUser, newUser, makeName, checkChatBox, 
		newChatBox, checkMessage, newMessage } from './utility';

const Subscription = {
	message: {
	 async subscribe(parent, { name1, name2 }, { db, pubsub }, info) {
			const chatBoxName = makeName(name1, name2);
			let chatBox = await checkChatBox(db, chatBoxName, "createChatBox");

			if (!chatBox) {
				throw new Error("chatBox not found");
			}

			return pubsub.asyncIterator(`message ${chatBoxName}`);
		}
	}
}

export default Subscription;