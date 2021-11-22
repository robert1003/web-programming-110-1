import mongoose from 'mongoose';
import ScoreCard from '../models/ScoreCard';

const db = mongoose.connection;

const createCard = async (name, subject, score) => {
	const existing = await ScoreCard.findOne({ name, subject });
  try {
  	let msg = { success: 1, duplicate: existing, message: "" };
  	if (existing) {
  		existing.score = score;
  		msg.card = await existing.save();
  	} else {
  		const card = new ScoreCard({ name, subject, score });
  		msg.card = await card.save();
  	}
  	return msg;
  } catch (e) {
  	return { success: 0, duplicate: existing, message: e };
  }
};

const queryCard = async (type, value) => {
	try {
		let cards = null;
		if (type === "name") cards = await ScoreCard.find({ name: value });
		else cards = await ScoreCard.find({ subject: value });

		return { success: 1, cards: cards };	
	} catch (e) {
		return { success: 0, message: e };
	}
};

const clearDB = async () => {
	try {
    await ScoreCard.deleteMany({});
    return { success: 1 };
  } catch (e) {
    return { success: 0, message: e };
  }
}

export { createCard, queryCard, clearDB };