import mongoose from 'mongoose';
import dotenv from 'dotenv-defaults';
import UserSchema from './models/user.js';
import ChatBoxSchema from './models/chatBox.js';
import MessageSchema from './models/message.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URL, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true })
  .then((res) => console.log("mongbo db connection created"));

const db = mongoose.connection;

db.model('User', UserSchema);
db.model('ChatBox', ChatBoxSchema);
db.model('Message', MessageSchema);

export default db;