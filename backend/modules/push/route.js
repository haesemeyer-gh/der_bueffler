import express from 'express';

import * as auth from '../auth/auth.js';
import * as push from './push.js';

const pushRouter = express.Router();

pushRouter.post("/push/subscribe", async (req, res) => {
	const subscription = req.body.subscription;
	const token = req.body.token;

	if (await auth.userWithTokenExists(token)) {
		const userID = await auth.getIDByToken(token);
		await push.addSubscriptions(userID, subscription);
		return res.json({
			message: "Subscribed successfully"
		})
	}
	else {
		return res.json({
			message: "Wrong token"
		})
	}
})


pushRouter.post("/push/unsubscribe", async (req, res) => {
	const token = req.body.token;

	if (await auth.userWithTokenExists(token)) {
		const userID = await auth.getIDByToken(token);
		await push.removeSubscriptions(userID);
		return res.json({
			message: "Removed all subscriptions successfully"
		})
	}
	else {
		return res.json({
			message: "Wrong token"
		})
	}
})

pushRouter.get("/pingpush", (req, res) => {
	push.sendPush()
	return res.status(200).end();
})

export default pushRouter;

