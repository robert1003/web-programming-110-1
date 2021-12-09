import WebSocket from 'ws';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv-defaults';
import bodyParser from 'body-parser';
import http from 'http';
import cors from 'cors';
import Message from './models/message';
import { sendData, sendStatus, initData } from './wssConnect';

dotenv.config();

mongoose.connect(process.env.MONGO_URL, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true })
  .then((res) => console.log("mongbo db connection created"));

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(bodyParser.json());

const broadcastMessage = (data, status) => {
	wss.clients.forEach((client) => {
		sendData(data, client);
		sendStatus(status, client);
	});
};

const db = mongoose.connection;
db.once("open", () => {
	console.log('mongodb connected.');

  wss.on('connection', (ws) => {
  	initData(ws);

		ws.onmessage = async (byteString) => {
			const { data } = byteString;
			const [task, payload] = JSON.parse(data);
			switch (task) {
				case 'input': {
					const { name, body } = payload;
					const message = new Message({ name, body });
					try {
						await message.save();
					} catch (e) {
						throw new Error("Message DB save error" + e);
					}
					//sendData(['output', [payload]], ws);
					//sendStatus({ type: 'success', 'msg': 'Message send.' }, ws);
					broadcastMessage(['output', [payload]], { type: 'success', 'msg': 'Message send.' });
					break;
				}
				case 'clear': {
					Message.deleteMany({}, () => {
						//sendData(['cleared'], ws);
						//sendStatus({ type: 'info', msg: 'Message cache cleared.' }, ws);
						broadcastMessage(['cleared'], { type: 'info', msg: 'Message cache cleared.' });
					});
					break;
				}
				default: break;				
			}
		}
	});

	const port = process.env.PORT || 4000;
	server.listen(port, () => {
		console.log(`hw8 server listening on port ${port}`)
	});
});
