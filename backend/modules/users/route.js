import express from 'express';

import { verifyToken } from '../auth/auth.js';
import * as users from './users.js';

const usersRouter = express.Router();

usersRouter.post('/user/maketeacher', async(req, res) => {
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

usersRouter.post('/user/makeadmin', async(req, res) => {
    const token = req.body.token;
    const userid = req.body.userid;
    const teamid = req.body.teamid;

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

export default usersRouter;
