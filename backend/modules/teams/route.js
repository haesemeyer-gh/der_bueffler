import express from 'express';

import { verifyToken, userWithTokenExists } from '../auth/auth.js';
import * as teams from './teams.js';


const teamsRouter = express.Router();

teamsRouter.post('/teams/create', async (req, res) => {
    const token = req.body.token;
    const name = req.body.name;

    let response;
    let permissions = await verifyToken(token);
    if (permissions.Lehrer === 1) {
        if (name && name.length > 0) {
            res.status(201);
            response = "Team erstellt!";
            teams.createTeam(name);
        } else {
            res.status(422);
            response = "Du musst einen Namen angeben!";
        }
    } else {
        res.status(403);
        response = "Du hast nicht die nötigen Berechtigungen.";
    }

    res.json({
        message: response
    });
});

teamsRouter.post('/teams/delete', async (req, res) => {
    const token = req.body.token;
    const id = req.body.id;

    let response;
    let permissions = await verifyToken(token);
    if (permissions.Lehrer === 1) {
        if (id) {
            res.status(201);
            response = "Team gelöscht!";
            teams.deleteTeam(id);
        } else {
            res.status(422);
            response = "Du musst eine ID angeben!";
        }
    } else {
        res.status(403);
        response = "Du hast nicht die nötigen Berechtigungen.";
    }

    res.json({
        message: response
    });
});

teamsRouter.post('/teams/add', async(req, res) => {
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

teamsRouter.post('/teams/remove', async(req, res) => {
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

teamsRouter.post('/teams/promote', async(req, res) => {
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

teamsRouter.post('/teams/demote', async(req, res) => {
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

teamsRouter.post("/teams/info", async(req, res) => {
    const token = req.body.token;
    const userid = req.body.userid;
    const teamid = req.body.teamid;

    let response;
    let permissions = await verifyToken(token);
    if (await userWithTokenExists(token))
    {
        const dbRes = await teams.info(teamid)
        if (dbRes.length > 0) {
            response = dbRes[0]["TeamName"]
        }
        else {
            response = "Team nicht vorhanden"
        }
        
    }
    else {
        res.status(403);
        response = "Du hast nicht die nötigen Berechtigungen.";
        
    }

    res.json({
            message: response
        });


} )
export default teamsRouter;
