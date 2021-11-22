import express from 'express';
import { createCard, queryCard, clearDB } from './api';

const router = express.Router();

router.post('/create-card', async (req, res) => {
	const { name, subject, score } = req.body;
	const result = await createCard(name, subject, score);
	if (result.success) {
		if (result.duplicate) {
			res.json({ 
				message: `Updating (${name}, ${subject}, ${score})`, 
				card: result.card
			});
		} else {
			res.json({ 
				message: `Adding (${name}, ${subject}, ${score})`, 
				card: result.card
			});
		}
	} else {
		res.json({ card: null, message: result.message });
	}
});

router.get('/query-cards', async (req, res) => {
	console.log(req.body, req.query);
	const { type, queryString } = req.query;
	const result = await queryCard(type, queryString);
	console.log(result);
	if (result.success) {
		if (result.cards.length === 0) {
			res.json({ 
				messages: null, 
				message: `${type.charAt(0).toUpperCase()+type.slice(1)} (${queryString}) not found!` 
			});
		} else {
			res.json({ 
				messages: result.cards.map(x => `Name:${x.name} Subject:${x.subject} Score:${x.score}`), 
				message: ``
			});
		}
	} else {
		res.json({ messages: null, message: result.message });
	}
});

router.delete('/clear-db', async (req, res) => {
	const result = await clearDB();
	if (result.success) res.json({ message: "Database cleared" });
	else res.json({ message: result.message });
});

export default router;