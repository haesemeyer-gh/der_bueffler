const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

const mariadb = require('mariadb');
const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'aA1234Aa'
});

/*
async function db_example() {
    let conn;
    try {
        conn = await pool.getConnection();
        const res = await conn.query("INSERT INTO myTable value (?, ?)", [1, ""]);
        console.log(res);
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}
*/

app.get('/ping', (req, res) => {
    res.json({
        message: "pong"
    });
});

/* APPOINTMENTS */

app.post('/appointment/list', (req, res) => {
    // mit rq.body.token in datenbank abfragen welche termine sichtbar sind
    res.json({
        message: [] // termine
    });
});

app.post('/appointment/view', (req, res) => {
    // mit rq.body.token in datenbank abfragen ob termin mit id rq.body.id sichtbar ist und termin zurückgeben
    res.json({
        message: {} // termin
    });
});

app.post('/appointment/create', (req, res) => {
    // mit rq.body.token in datenbank abfragen in welchem team erstellt werden kann, eintragen
    // weitere daten: rq.body.team rq.body.title req.body.course req.body.teacher req.body.notes
    res.json({
        message: "" // evt. fehlernachricht
    });
});

app.post('/appointment/edit', (req, res) => {
    // mit rq.body.token in datenbank abfragen ob termin mit id req.body.id editiert werden kann
    // weitere daten: rq.body.team rq.body.title req.body.course req.body.teacher req.body.notes
    res.json({
        message: "" // evt. fehlernachricht
    });
});

app.post('/appointment/delete', (req, res) => {
    // mit rq.body.token in datenbank abfragen ob termin mit id req.body.id gelöscht werden kann
    res.json({
        message: "" // evt. fehlernachricht
    });
});

/* TEAMS */

app.post('/teams/create', (req, res) => {
    // mit rq.body.token in datenbank abfragen ob team mit namen req.body.name erstellt werden darf
    res.json({
        message: "" // evt. fehlernachricht
    });
});

app.post('/teams/delete', (req, res) => {
    // mit rq.body.token in datenbank abfragen ob team mit id req.body.id gelöscht werden darf
    res.json({
        message: "" // evt. fehlernachricht
    });
});

app.post('/teams/add', (req, res) => {
    // mit rq.body.token in datenbank abfragen ob nutzer mit id req.body.userid zu team req.body.teamid hinzugefügt werden darf
    res.json({
        message: "" // evt. fehlernachricht
    });
});

app.post('/teams/remove', (req, res) => {
    // mit rq.body.token in datenbank abfragen ob nutzer mit id req.body.userid von team req.body.teamid entfernt werden darf
    res.json({
        message: "" // evt. fehlernachricht
    });
});

app.post('/teams/promote', (req, res) => {
    // mit rq.body.token in datenbank abfragen ob nutzer mit id req.body.userid in team req.body.teamid zum klassensprecher ernannt werden darf
    res.json({
        message: "" // evt. fehlernachricht
    });
});

app.post('/teams/demote', (req, res) => {
    // mit rq.body.token in datenbank abfragen ob nutzer mit id req.body.userid in team req.body.teamid den klassensprecherstatus aberkannt haben werdewn tun darf dürfen sollen
    res.json({
        message: "" // evt. fehlernachricht
    });
});


/* USERS */

app.post('/user/maketeacher', (req, res) => {
    // mit rq.body.token in datenbank abfragen ob nutzer mit id req.body.id zum lehrer ernannt werden darf
    res.json({
        message: "" // evt. fehlernachricht
    });
});

app.post('/user/makeadmin', (req, res) => {
    // mit rq.body.token in datenbank abfragen ob nutzer mit id req.body.id zum admin ernannt werden darf
    res.json({
        message: "" // evt. fehlernachricht
    });
});

/*  */

app.listen(8080);
