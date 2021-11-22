import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv-defaults';
import mongoose from 'mongoose';

import scoreCardRoute from './routes/index';

// config default values
dotenv.config();

// connect to mongo
mongoose.connect(process.env.MONGO_URL, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true })
  .then((res) => console.log("mongbo db connection created"));


const app = express();

// define middleware
app.use(cors());
app.use(bodyParser.json());

// define routes
app.use('/api', scoreCardRoute);

// define server
const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`hw7 app listening on port ${port}`)
});