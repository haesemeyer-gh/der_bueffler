import express from 'express';

import { verifyToken } from '../auth/auth.js';
import * as appointments from './appointments.js';

const appointmentsRouter = express.Router();

appointmentsRouter.post('/appointment/list', async(req, res) => {
	const token = req.body.token;

	let response;
	let permissions = await verifyToken(token);
	if (permissions) { // TODO: benötigte Berechtigungen definieren
		// TODO: Funktionen schreiben
	} else {
		res.status(403);
		response = "Du hast nicht die nötigen Berechtigungen.";
	}

	res.json({
		message: response
	});
});

appointmentsRouter.post('/appointment/view', async(req, res) => {
	const token = req.body.token;
	const id = req.body.id;

	let response;
	let permissions = await verifyToken(token);
	if (permissions) { // TODO: benötigte Berechtigungen definieren
		// TODO: Funktionen schreiben
	} else {
		res.status(403);
		response = "Du hast nicht die nötigen Berechtigungen.";
	}

	res.json({
		message: response
	});
});

appointmentsRouter.post('/appointment/create', async(req, res) => {
	const token = req.body.token;
	const teamid = req.body.teamid;
	const date = req.body.date;
	const title = req.body.title;
	const course = req.body.course;
	const teacher = req.body.teacher;
	const notes = req.body.notes;

	let response;
	let permissions = await verifyToken(token);
	if (permissions) { // TODO: benötigte Berechtigungen definieren
		let dbresponse = await appointments.createAppointment(teamid, permissions.ID, date, title, course, teacher, notes)
		if (dbresponse.code === "ER_BAD_NULL_ERROR") {
			res.status(422);
			response = "nicht null";
		} else {
			res.status(201);
			response = "Termin erstellt";
		}
	} else {
		res.status(403);
		response = "Du hast nicht die nötigen Berechtigungen.";
	}

	res.json({
		message: response
	});
});
// createAppointment in API testen

appointmentsRouter.post('/appointment/edit', async(req, res) => {
	const token = req.body.token;
	const id = req.body.id;
	const date = req.body.date;
	const title = req.body.title;
	const course = req.body.course;
	const teacher = req.body.teacher;
	const notes = req.body.notes;


	let response;
	let permissions = await verifyToken(token);
	if (permissions) { // TODO: benötigte Berechtigungen definieren
		// TODO: Funktionen schreiben
		 let dbresponse = await appointments.editAppointment(id, permissions.ID, date, title, course, teacher, notes) //Werte anpassen (s. ./appointments.js)
		if (dbresponse.code === "ER_BAD_NULL_ERROR") {
			res.status(422);
			response = "nicht null";
		} else {
			res.status(201);
			response = "Termin erstellt";
		}
	} else {
		res.status(403);
		response = "Du hast nicht die nötigen Berechtigungen.";
	}

	res.json({
		message: response
	});
});

appointmentsRouter.post('/appointment/delete', async(req, res) => {
	const token = req.body.token;
	const id = req.body.id;

	let response;
	let permissions = await verifyToken(token);
	if (permissions) { // TODO: benötigte Berechtigungen definieren
		// TODO: Funktionen schreiben
	} else {
		res.status(403);
		response = "Du hast nicht die nötigen Berechtigungen.";
	}

	res.json({
		message: response
	});
});

export default appointmentsRouter;

