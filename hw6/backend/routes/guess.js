import express from 'express';
import { getNumber, genNumber } from '../core/getNumber';

const router = express.Router();

router.post('/start', (_, res) => {
	genNumber();
	console.log(`Started number: ${getNumber()}`);
	res.json({ msg: 'The game has started.' });
});

router.post('/restart', (_, res) => {
	genNumber();
	console.log(`Restarted number: ${getNumber()}`);
	res.json({ msg: 'The game has restarted.' });
});

router.get('/guess', (req, res) => {
	const answer = getNumber();
	const guessed = parseInt(req.query.number, 10);	

	console.log(`Answer: ${answer}, Guessed: ${guessed}`);

	if (!/^\d+$/.test(req.query.number) || !guessed || guessed < 1 || guessed > 100) {
		res.status(406).send({ msg: 'Not a legal number.' });
		return;
	}
	
	if (guessed < answer) res.status(200).send({ status: 'Bigger' });
	else if (guessed > answer) res.status(200).send({ status: 'Smaller' });
	else res.status(200).send({ status: 'Equal' });
});


export default router;