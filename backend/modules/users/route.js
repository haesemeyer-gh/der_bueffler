import express from 'express';

import { verifyToken } from '../auth/auth.js';
import * as users from './users.js';

const usersRouter = express.Router();

usersRouter.post('/user/maketeacher', async(req, res) => {
	const token = req.body.token;
	const id = req.body.id;

	let response;
	let permissions = await verifyToken(token);
	if (permissions.Admin === 1){
		res.status(201)
		users.makeTeacher(id)
		response = "Nutzer wurde erfolgreich zum Lehrer gemacht";
	} else {
		res.status(403);
		response = "Du hast nicht die nötigen Berechtigungen.";
	}

	res.json({
		message: response
	});
});

usersRouter.post('/user/deleteteacher', async(req, res) => {
	const token = req.body.token;
	const id = req.body.id;

	let response;
	let permissions = await verifyToken(token);
	if (permissions.Admin === 1){
		res.status(201)
		users.deleteTeacher(id)
		response = "Dem Nutzer wurde erfolgreich der Lehrerstatus aberkannt";
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
		res.status(201);
		users.makeAdmin(id)
		response = "Nutzer wurde erfolgreich zum Admin gemacht";
	} else {
		res.status(403);
		response = "Du hast nicht die nötigen Berechtigungen.";
	}

	res.json({
		message: response
	});
});

usersRouter.post('/user/getuserinfo', async(req, res) => {
	const token = req.body.token;
	const id = req.body.id;

	let response;
	let permissions = await verifyToken(token);
	if (permissions) {
		res.status(201);
		response = await users.getUserInfo(id)
	} else {
		res.status(403);
		response = "Du hast nicht die nötigen Berechtigungen.";
	}

	res.json({
		message: response
	});
});

usersRouter.post('/user/list', async(req, res) => {
	const token = req.body.token;

	let response;
	let permissions = await verifyToken(token);
	if (permissions) {
		res.status(201);
		response = await users.list();
	} else {
		res.status(403);
		response = "Du hast nicht die nötigen Berechtigungen.";
	}

	res.json({
		message: response
	});
});

export default usersRouter;

