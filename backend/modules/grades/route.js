import express from 'express';

import { getIDByToken, verifyToken } from '../auth/auth.js';
import * as grades from './grades.js';

const gradesRouter = express.Router();


gradesRouter.post('/grades/add', async(req, res) => {
    const token = req.body.token;
    const grade = req.body.grade;
    const studentID = req.body.studentID;
    const course = req.body.course;
    const timestamp = req.body.timestamp;

    let response;
    let permissions = await verifyToken(token);
    if (permissions.Lehrer === 1) {
        await grades.addGrade(permissions.ID, studentID, course, timestamp, grade);

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
    const teacherID = req.body.teacherID;
    const course = req.body.course;
    const studentID = req.body.studentID;

    let response;
    let permissions = await verifyToken(token);
    if (permissions.Lehrer === 1) {
        response = await grades.listGrades(teacherID, studentID, course)
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
    const gradeID = req.body.gradeID;
    const grade = req.body.grade;


    let response;
    let permissions = await verifyToken(token);
    if (permissions.Lehrer === 1) {
        await grades.editGrade(gradeID, grade)
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
    const studentID = req.body.studentID;
    const course = req.body.course;

    let response;
    let permissions = await verifyToken(token);
    if (permissions && (permissions.Lehrer === 1 || await getIDByToken(token) === studentID)){

        response = await grades.getAverageForCourse(studentID, course);
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

