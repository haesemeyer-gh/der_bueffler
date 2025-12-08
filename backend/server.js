require('dotenv').config()

const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use("/", express.static("../frontend"))

const mariadb = require('mariadb');
const pool = mariadb.createPool({
    host: process.env.BUEFFLER_DB_HOST,
    user: process.env.BUEFFLER_DB_USER,
    password: process.env.BUEFFLER_DB_PASS,
    database: process.env.BUEFFLER_DB_NAME
});

async function query(sqlQuery, values) {
    let conn;
    try {
        conn = await pool.getConnection();
        const res = await conn.query(sqlQuery, values);
        return res;
    } catch (err) {
        console.error(err);
    } finally {
        if (conn) conn.end();
    }
}

app.get('/ping', (req, res) => {
    res.json({
        message: "pong"
    });
});

/* AUTH */

const argon2 = require('argon2');

async function encrypt(password) {
    try {
        return await argon2.hash(password)
    } catch(err) {
        console.error(err)
    }
}

async function verify(hash, password) {
    try {
        return await argon2.verify(hash, password)
    } catch(err) {
        console.error(err)
    }
}


async function userWithEmailExists(email) {
    const data = await query("SELECT * FROM user WHERE (Mail = ?)", [email])
    return data.length > 0
}

async function createNewUser(uname, email, password) {
    const hash = await encrypt(password)
    return await query("INSERT INTO user (Mail, Passwort, Name, Lehrer, Admin) VALUES (?, ?, ?, 0, 0)", [email, hash, uname])
}

async function getUserID(email) {
    const data = await query("SELECT ID FROM user WHERE (Mail = ?)", [email])
    return data[0]["ID"]
}

async function verifyPassword(password, email) {
    const data = await query("SELECT Passwort FROM user WHERE (Mail = ?)", [email])
    return await verify(data[0]["Passwort"], password)
}


async function createSession(userID) {
    const uuid = crypto.randomUUID();
    await closeSession(userID)
    await query("INSERT INTO session (Token, NutzerID) VALUES (?, ?)", [uuid, userID])
    await markOnline(userID)
    return uuid

}

async function closeSession(userID) {
    return await query("DELETE FROM session WHERE (NutzerID = ?)", [userID])
}


async function markOnline(userID) {
    const date = new Date()

    return await query("UPDATE user SET online = ? WHERE (ID = ?)", [date.toISOString("de").split('T')[0], userID])
}


app.post('/auth/register', async (req, res) => {
    // rq.body.name, rq.body.email, rq.body.password

    const uname = req.body.uname;
    const email = req.body.email;
    const password = req.body.password;

    if (await userWithEmailExists(email)) {
        console.log("exists")
        return res.json({
            message: "User exists already"
        });

    }
    else {
        console.log("created")
        await createNewUser(uname, email, password)
        return res.json({
            message: "User created successfully"
        });
    }
});

app.post('/auth/login', async (req, res) => {
    // rq.body.email, rq.body.password

    const email = req.body.email;
    const password = req.body.password;

    if (!(await userWithEmailExists(email))) {

        console.log("doesn't exist")
        return res.json({
            message: "No such user"
        });
    }
    console.log("exists")

    if (!(await verifyPassword(password, email))) {
        return res.json({
            message: "Wrong password"
        });
    }

    const userID = await getUserID(email);
    const token = await createSession(userID);

    console.log(token)
    return res.json({
        message: token
    });

});

/* APPOINTMENTS */

function appointmentToObject(title, teamid, date, course, teacher, notes) {
    let dateString = new Date(date).toLocaleString('de-DE', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'});
    let appointmentObject = {
        title: title,
        teamid: teamid,
        date: date,
        dateString: dateString,
        course: course,
        teacher: teacher,
        notes: notes
    };
    return appointmentObject;
}

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


function listTeammates(teamid) {
    return query("SELECT TeamName, Mitglieder FROM teams WHERE TeamID LIKE ?", [teamid]);
}

function createTeams(teamsName){
 return query("INSERT INTO teams (TeamName) VALUES (?)", [teamsName])
}

app.post('/teams/create', (req, res) => {
    // mit rq.body.token in datenbank abfragen ob team mit namen req.body.name erstellt werden darf
    createTeams(req.body.name)
    res.json({
        message: "" // evt. fehlernachricht
    });
});

function deleteTeam(TeamID) {
    return query("DELETE FROM Team WHERE (TeamID = ?)", [TeamID])
}

app.post('/teams/delete', (req, res) => {
    // mit rq.body.token in datenbank abfragen ob team mit id req.body.id gelöscht werden darf
    deleteTeam(req.body.id)
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

function getUserMail(userid) {
    return query("SELECT Mail FROM user WHERE ID LIKE ?", [userid]);
}

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

/* SMTP */

const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    host: process.env.BUEFFLER_SMTP_HOST,
    port: process.env.BUEFFLER_SMTP_PORT,
    secure: (process.env.BUEFFLER_SMTP_SSLPORT465==="true" ? true : false), // SSL (Port 465)
    auth: {
        user: process.env.BUEFFLER_SMTP_USER,
        pass: process.env.BUEFFLER_SMTP_PASS
    },
    tls: {
        rejectUnauthorized: (process.env.BUEFFLER_SMTP_REJECTSELFSIGNED==="false" ? false : true) // erlaubt self-signed zertifikate
    }
});

async function sendmail(to, subject, html) {
    const smtpstatus = await transporter.sendMail({
        from: process.env.BUEFFLER_SMTP_FROM,
        to: to,
        subject: subject,
        text: html, // eigentlich plain text fallback
        html: html
    });
    //console.log(smtpstatus);
};

/* DIGESTS */

const cron = require('node-cron');
function startDigest() {
    cron.schedule(process.env.BUEFFLER_CRON, () => { // should run each saturday @ 07:00
        sendCollectiveMails();
    });
};

async function getWeeklyAppointments() {
    let appointmentResponse = await query("SELECT * FROM appointments WHERE Datum BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY);", []);
    let weeklyAppointments = [];
    appointmentResponse.forEach((appointment, i) => {
        let appointmentObject = appointmentToObject(appointment.Titel, appointment.TeamID, appointment.Datum, appointment.Fach, appointment.Lehrer, appointment.Notizen);
        weeklyAppointments.push(appointmentObject);
    });
    return weeklyAppointments;
}

async function getMailArray() {
    let collectiveMailArray = [];
    return new Promise(async (resolve, reject) => {
        let weeklyAppointments = await getWeeklyAppointments();
        weeklyAppointments.forEach(async (appointment, alli) => {
            let teammemberResponse = await listTeammates(appointment.teamid);
            teammemberResponse[0].Mitglieder.forEach(async (userid, i) => {
                let mailResponse = await getUserMail(userid);
                let alreadyMember = false;
                let alreadyMemberI = 0;
                collectiveMailArray.forEach((user, i) => {
                    if (user.mail === mailResponse[0].Mail) {
                        alreadyMember = true;
                        alreadyMemberI = i;
                    }
                });
                if (alreadyMember === false) {
                    collectiveMailArray.push({
                        mail: mailResponse[0].Mail,
                        appointments: [
                            appointment
                        ]
                    });
                } else {
                    collectiveMailArray[alreadyMemberI].appointments.push(appointment);
                }
                if (alli+1 === weeklyAppointments.length && i+1 === teammemberResponse[0].Mitglieder.length) {
                    resolve(collectiveMailArray)
                }
            });
        });
    });
}

async function sortMailArray() {
    let collectiveMailArray = await getMailArray();
    collectiveMailArray.forEach(user => {
        user.appointments.sort((a,b) => a.date - b.date);
    });
    return collectiveMailArray
}

async function sendCollectiveMails() {
    let collectiveMailArray = await sortMailArray();
    collectiveMailArray.forEach(user => {
        let digest = `<h1>Diese Woche stehen Termine an!<h1>`;
        user.appointments.forEach((appointment) => {
            digest += `
            <h2>${appointment.title}</h2>
            <ul>
            <li>Datum: <b>${appointment.dateString}</b></li>
            <li>Fach: <b>${appointment.course}</b></li>
            <li>Lehrer: <b>${appointment.teacher}</b></li>
            </ul>
            <h3>Notizen:</h3>
            <p>${appointment.notes}</p>
            `;
        });
        sendmail(user.mail, "Diese Woche stehen Termine an!", digest);
    });
}

/*  */

app.listen(8080, () => {
    console.log("Web-Server verfügbar!");
    startDigest();

    //tmp
    sendCollectiveMails();
});
