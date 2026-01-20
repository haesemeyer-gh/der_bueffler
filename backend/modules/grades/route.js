import express from 'express';

import { getIDByToken, verifyToken } from '../auth/auth.js';
import * as grades from './grades.js';

const gradesRouter = express.Router();




gradesRouter.post('/grades/set', async(req, res) => {
    const token = req.body.token;
    const grade = req.body.grade;
    const targetUserID = req.body.targetID;
    const terminID = req.body.terminID;


    let response;
    let permissions = await verifyToken(token);
    if (permissions.Lehrer === 1){ // make it generally that each teacher can do it or only the one that is responsible for the appointment? 

        if (await grades.gradeExists(terminID, targetUserID)) {
            await grades.editGrade(terminID, targetUserID, grade)
            response = "Successfully edited"
            res.status(200)
        }
        else {
            await grades.addGrade(terminID, targetUserID, grade)
            response = "Successfully added"
            res.status(201)
        }
    } else {
        res.status(403);
        response = "Du hast nicht die nötigen Berechtigungen.";
    }

    res.json({
        message: response
    });
});


gradesRouter.post('/grades/get', async(req, res) => {
    const token = req.body.token;
    const targetUserID = req.body.targetID;
    const terminID = req.body.terminID;


    let response;
    let permissions = await verifyToken(token);
    if (permissions && (permissions.Lehrer === 1 || await getIDByToken(token) === targetUserID)){

        response = await grades.getGrade(terminID, targetUserID);
        res.status(200);

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
    const targetUserID = req.body.targetID;
    const course = req.body.course;


    let response;
    let permissions = await verifyToken(token);
    if (permissions && (permissions.Lehrer === 1 || await getIDByToken(token) === targetUserID)){

        response = await grades.getAverageForCourse(targetUserID, course);
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
