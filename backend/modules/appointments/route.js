import express from 'express';

import { verifyToken } from '../auth/auth.js';
import * as appointments from './appointments.js';

const appointmentsRouter = express.Router();

appointmentsRouter.post('/appointment/list', async(req, res) => {
	const token = req.body.token;
    const teamid = req.body.teamid

	let response;
	let permissions = await verifyToken(token);
	if (permissions) { // TODO: benötigte Berechtigungen definieren
        let dbresponse = await appointments.listAppointments(teamid)
        response = dbresponse
        res.status(201)
	} else {
		res.status(403);
		response = "Du hast nicht die nötigen Berechtigungen.";
	}

	res.json({
		message: response
	});
});

appointmentsRouter.post('/appointment/list-user', async(req,res) => {
	const token = req.body.token

	let response;
	let permissions = await verifyToken(token)
	if (permissions) {
		let dbresponse = await appointments.listUserAppointments(permissions.ID)
		response = dbresponse
		res.status(201)
	} else {
		res.status(403)
		response = "Du hast nicht die nötigen Berechtigungen."
	}

	res.json({
		message:response
	});
});

appointmentsRouter.post('/appointments/list-month', async(req,res) => {
	const token = req.body.token
	const month = req.body.month
	const year = req.body.year

	let response;
	let permissions = await verifyToken(token)
	if (permissions) {
		let dbresponse = await appointments.listMonthlyAppointments(permissions.ID, month, year)
		response = dbresponse
		res.status(201)
	} else {
		res.status(403)
		response = "Du hast nicht die nötigen Berechtigungen."
	}

	res.json({
		message:response
	});
});

appointmentsRouter.post('/appointment/view', async(req, res) => {
	const token = req.body.token;
	const terminid = req.body.terminid;

	let response;
	let permissions = await verifyToken(token);
	if (permissions) { // TODO: benötigte Berechtigungen definieren
        let dbresponse = await appointments.viewAppointment(terminid)
        response = dbresponse[0]
        res.status(201)
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

appointmentsRouter.post('/appointment/edit', async(req, res) => {
	const token = req.body.token;
	const terminid = req.body.terminid;
	const date = req.body.date;
	const title = req.body.title;
	const course = req.body.course;
	const teacher = req.body.teacher;
	const notes = req.body.notes;


	let response;
	let permissions = await verifyToken(token);
	if (permissions) { // TODO: benötigte Berechtigungen definieren
		 let dbresponse = await appointments.editAppointment(terminid, permissions.ID, date, title, course, teacher, notes) //Werte anpassen (s. ./appointments.js)
		if (dbresponse.code === "ER_BAD_NULL_ERROR") {
			res.status(422);
			response = "nicht null";
		} else {
			res.status(201);
			response = "Termin bearbeitet";
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
	const terminid = req.body.terminid;

	let response;
	let permissions = await verifyToken(token);
	if (permissions) { // TODO: benötigte Berechtigungen definieren
        await appointments.deleteAppointment(permissions.ID, terminid)
        response = "Termin gelöscht!"
        res.status(201)
	} else {
		res.status(403);
		response = "Du hast nicht die nötigen Berechtigungen.";
	}

	res.json({
		message: response
	});
});

export default appointmentsRouter;

