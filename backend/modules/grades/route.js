import express from 'express';

import { getIDByToken, verifyToken } from '../auth/auth.js';
import * as grades from './grades.js';

const gradesRouter = express.Router();

gradesRouter.post('/grades/add', async(req, res) => {
	const token = req.body.token;
	const grade = req.body.grade;
	const studentid = req.body.studentid;
	const course = req.body.course;
	const timestamp = req.body.timestamp;

	let response;
	let permissions = await verifyToken(token);
	if (permissions.Lehrer === 1) {
		await grades.addGrade(permissions.ID, studentid, course, timestamp, grade);

		response = "Successfully added";
		res.status(201);
	} else {
		res.status(403);
		response = "Du hast nicht die nötigen Berechtigungen.";
	}

	res.json({
		message: response
	});
});

gradesRouter.post('/grades/list', async(req, res) => {
	const token = req.body.token;
	const teacherid = req.body.teacherid;
	const course = req.body.course;
	const studentid = req.body.studentid;

	let response;
	let permissions = await verifyToken(token);
	if (permissions.Lehrer === 1 || permissions.ID === studentid) {
		response = await grades.listGrades(teacherid, studentid, course)
		res.status(200)
	} else {
		res.status(403);
		response = "Du hast nicht die nötigen Berechtigungen.";
	}

	res.json({
		message: response
	});
});

gradesRouter.post('/grades/edit', async(req, res) => {
	const token = req.body.token;
	const gradeid = req.body.gradeid;
	const grade = req.body.grade;


	let response;
	let permissions = await verifyToken(token);
	if (permissions.Lehrer === 1) {
		await grades.editGrade(gradeid, grade)
		response = "Edit Successful"
		res.status(200)
	} else {
		res.status(403);
		response = "Du hast nicht die nötigen Berechtigungen.";
	}

	res.json({
		message: response
	});
});

gradesRouter.post('/grades/get_avg', async(req, res) => {
	const token = req.body.token;
	const studentid = req.body.studentid;
	const course = req.body.course;

	let response;
	let permissions = await verifyToken(token);
	if (permissions.Lehrer === 1 || permissions.ID === studentid){

		response = await grades.getAverageForCourse(studentid, course);
		res.status(200);

	} else {

		res.status(403);
		response = "Du hast nicht die nötigen Berechtigungen.";
	}

	res.json({
		message: response
	});
});

export default gradesRouter;

