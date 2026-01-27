import express from 'express';

import { verifyToken } from '../auth/auth.js';
import * as history from './history.js';

const historyRouter = express.Router();

historyRouter.post('/history/list', async(req,res) => {
    const token = req.body.token
    const terminid = req.body.terminid

    let response;
    let permissions = await verifyToken(token)
    if (permissions) {
        let dbresponse = await history.listHistory(terminid)
        response = dbresponse
        res.status(201)
    } else {
        res.status(403)
        response = "Du hast nicht die nötigen Berechtigungen."
    }

    res.json({
        message:response
    })
})

historyRouter.post('/history/view', async(req,res) => {
    const token = req.body.token
    const aenderungsid = req.body.aenderungsid

    let response;
    let permissions = await verifyToken(token)
    if (permissions) {
        let dbresponse = await history.viewHistory(aenderungsid)
        response = dbresponse[0]
        res.status(201)
    } else {
        res.status(403)
        response = "du hast nicht die nötigen Berechtigungen."
    }

    res.json({
        message:response
    })
})

export default historyRouter;

