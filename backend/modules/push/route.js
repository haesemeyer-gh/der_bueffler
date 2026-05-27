import express from 'express';

import * as auth from '../auth/auth.js';
import * as push from './push.js';

const pushRouter = express.Router();

pushRouter.post("/push/subscribe", async (req, res) => {
	const token = req.body.token;
	const subendpoint = req.body.subendpoint;
	const subauth = req.body.subauth;
	const subp256dh = req.body.subp256dh;

	if (await auth.userWithTokenExists(token)) {
		const userID = await auth.getIDByToken(token);
		await push.addSubscriptions(userID, subendpoint, subauth, subp256dh);
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

pushRouter.get("/push/getpublickey", (req, res) => {
	res.status(200);
	return res.json({
		message: process.env.BUEFFLER_VAPID_PUBLIC
	});
})

/*
pushRouter.get("/push/pingpush", (req, res) => {
	push.sendPush()
	return res.status(200).end();
})
*/

export default pushRouter;

