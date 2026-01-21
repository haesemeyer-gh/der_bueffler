import express from 'express';

import { verifyToken } from '../auth/auth.js';
import * as users from './users.js';

const usersRouter = express.Router();

usersRouter.post('/user/maketeacher', async(req, res) => {
	const token = req.body.token;
	const id = req.body.id;

	let response;
	let permissions = await verifyToken(token);
	if (permissions.Lehrer === 1|| permissions.Admin === 1){
		users.makeTeacher(userid)
		response = "Nutzer wurde erfolgreich zum Lehrer gemacht";
	} else {
		res.status(403);
		response = "Du hast nicht die nötigen Berechtigungen.";
	}

	res.json({
		message: response
	});
});

usersRouter.post('/user/makeadmin', async(req, res) => {
	const token = req.body.token;
	const id = req.body.id;

	let response;
	let permissions = await verifyToken(token);
	if (permissions.Admin === 1) {
		userid.makeAdmin(id)
		response = "Nutzer wurde erfolgreich zum Admin gemacht";
	} else {
		res.status(403);
		response = "Du hast nicht die nötigen Berechtigungen.";
	}

	res.json({
		message: response
	});
});

usersRouter.post('/user/getUserInfo', async(req, res) => {
	const token = req.body.token;
	const id = req.body.id;

	let response;
	let permissions = await verifyToken(token);
	if (permissions) {
		users.getUserInfo(id)
	} else {
		res.status(403);
		response = "Du hast nicht die nötigen Berechtigungen.";
	}

	res.json({
		message: response
	});
});

export default usersRouter;

