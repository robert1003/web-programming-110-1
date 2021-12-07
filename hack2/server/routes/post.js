import express from 'express'
import Post from '../models/post'
import moment from 'moment'

const router = express.Router()

// TODO 2-(1): create the 1st API (/api/allPosts)
router.get('/allPosts', async (req, res) => {
	console.log('GET /api/allPosts');
	try {
		const result = await Post.find({}).sort({ 'timestamp': 'desc' });
		if (result.length === 0) res.status(403).json({ 'message': 'error', 'data': null });
		else {
			res.status(200).json({
				'message': 'success',
				'data': result
			});
		}
	} catch (e) {
		res.status(403).json({ 'message': 'error', 'data': null });
	}
});

// TODO 3-(1): create the 2nd API (/api/postDetail)
router.get('/postDetail', async (req, res) => {
	console.log(`GET /api/postDetail?pid=${req.query.pid}`);
	try {
		const result = await Post.findOne({ 'postId': req.query.pid });
		if (result) {
			res.status(200).json({
				'message': 'success',
				'post': result
			});
		}
		else res.status(403).json({ 'message': 'error', 'post': null });
	} catch (e) {
		res.status(403).json({ 'message': 'error', 'post': null });
	}
});

// TODO 4-(1): create the 3rd API (/api/newPost)
router.post('/newPost', async (req, res) => {
	console.log(`POST /api/newPost with params:`);
	console.log(req.body);
	try {
		const { postId, title, content, timestamp } = req.body;
		const post = new Post({ postId, title, content, timestamp });
		await post.save();
		res.status(200).json({ 'message': 'success' });
	} catch (e) {
		res.status(403).json({ 'message': 'error', "post": null });
	}
});

// TODO 5-(1): create the 4th API (/api/post)
router.delete('/post', async (req, res) => {
	console.log(`DELETE /api/post?pid=${req.query.pid}`);
	Post.deleteOne({ 'postId': req.query.pid }).then(() => {
		res.status(200).json({ 'message': 'success' });
	}).catch((e) => {
		res.status(403).json({ 'message': 'error', "post": null });
	});
});

export default router