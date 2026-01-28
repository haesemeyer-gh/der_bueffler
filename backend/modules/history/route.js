import express from 'express';

import { verifyToken } from '../auth/auth.js';
import * as history from './history.js';
import { viewAppointmentIgnoreDeleted } from '../appointments/appointments.js';
import { isUserMemberOfTeam } from '../teams/teams.js';

const historyRouter = express.Router();

historyRouter.post('/history/list', async(req,res) => {
    const token = req.body.token
    const terminid = req.body.terminid

    let response;
    let permissions = await verifyToken(token)
	let appointment = await viewAppointmentIgnoreDeleted(terminid);
	if (appointment.length <= 0) {
		return res.status(404).json({
			message: "Dieser Termin existiert nicht."
		})
	}
	let teamid = appointment[0].TeamID;
    if (permissions.Lehrer === 1 || await isUserMemberOfTeam(permissions.ID, teamid)) {
        let dbresponse = await history.listHistory(terminid)
		if (dbresponse.length > 0) {
			response = dbresponse
			res.status(201)
		} else {
			response = "Es gibt keine vorherigen Versionen dieses Termins oder er existiert nicht."
			res.status(404)
		}
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
	let appointment = await history.viewHistory(aenderungsid);
	if (appointment.length <= 0) {
		return res.status(404).json({
			message: "Dieser Termin existiert nicht."
		})
	}
	let teamid = appointment[0].TeamID;
    if (permissions.Lehrer === 1 || await isUserMemberOfTeam(permissions.ID, teamid)) {
		response = appointment[0]
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

