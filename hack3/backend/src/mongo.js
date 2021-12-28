import mongoose from "mongoose";
import { dataInit } from "./upload.js";

//import "dotenv-defaults/config.js";
import dotenv from 'dotenv-defaults';

async function connect() {
  // TODO 1.1 Connect your MongoDB
  dotenv.config();

  mongoose.connect(process.env.MONGO_URL, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true })
    .then((res) => {
      console.log("mongbo db connection created");
      dataInit();
    });
}

export default { connect };