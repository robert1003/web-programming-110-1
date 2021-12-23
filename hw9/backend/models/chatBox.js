import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ChatBoxSchema = new Schema({
	name: { 
		type: String, 
		required: true 
	},
	messages: [{
		type: mongoose.Types.ObjectId,
		ref: "Message"
	}]
});

export default ChatBoxSchema;