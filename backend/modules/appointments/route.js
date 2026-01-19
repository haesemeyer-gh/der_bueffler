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
    const title = req.body.title;
    const course = req.body.course;
    const teacher = req.body.teacher;
    const notes = req.body.notes;

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

appointmentsRouter.post('/appointment/edit', async(req, res) => {
    const token = req.body.token;
    const id = req.body.id;
    const title = req.body.title;
    const course = req.body.course;
    const teacher = req.body.teacher;
    const notes = req.body.notes;


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
