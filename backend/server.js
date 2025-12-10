import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import webpush from 'web-push';
import mariadb from 'mariadb';
import argon2 from 'argon2';
import nodemailer from 'nodemailer';
import cron from 'node-cron';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use("/", express.static("../frontend"))

const pool = mariadb.createPool({
    host: process.env.BUEFFLER_DB_HOST,
    user: process.env.BUEFFLER_DB_USER,
    password: process.env.BUEFFLER_DB_PASS,
    database: process.env.BUEFFLER_DB_NAME
});

async function query(sqlQuery, values = []) {
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

async function userWithTokenExists(token) {
    const data = await query("SELECT * FROM session WHERE (Token = ?)", [token])
    return data.length > 0
}

async function createNewUser(uname, email, password) {
    const hash = await encrypt(password)
    return await query("INSERT INTO user (Mail, Passwort, Name, Lehrer, Admin) VALUES (?, ?, ?, 0, 0)", [email, hash, uname])
}

async function resetPassword(userID, password) {
    const hash = await encrypt(password)
    return await query("UPDATE user SET Passwort = ? WHERE (ID = ?)", [hash, userID])
}

async function userWithIDExists(userID) {
    const data = await query("SELECT 1 FROM user WHERE (ID = ?)", [userID]);
    return data.length > 0
}

async function getUserID(email) {
    const data = await query("SELECT ID FROM user WHERE (Mail = ?)", [email])
    return data[0]["ID"]
}

async function removeUser(userID) {
    return await query("DELETE FROM user WHERE (ID = ?)", [userID])
}

async function getIDByToken(token) {
    const data = await query("SELECT NutzerID FROM session WHERE (Token = ?)", [token])
    return data[0].NutzerID
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

function formatDate(date) {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`
}


async function markOnline(userID) {
    const date = new Date()

    return await query("UPDATE user SET online = ? WHERE (ID = ?)", [formatDate(date), userID])
}


async function getAllAppointmentsWithinTimeframe(start, end) {
    return await query("SELECT * FROM appointments WHERE Datum BETWEEN ? AND ?", [formatDate(start), formatDate(end)]);
}


async function getSubscriptions(userID) {
    return await query("SELECT Subscription FROM push_subscriptions WHERE (NutzerID = ?)", [userID])
}

async function addSubscriptions(userID, subscription) {
    return await query("INSERT IGNORE INTO push_subscriptions (Subscription, NutzerID) VALUES (?, ?)", [subscription, userID]);
}

async function removeSubscriptions(userID) {
    return await query("DELETE FROM push_subscriptions WHERE (NutzerID = ?)", [userID]);
}

async function getUserPermissions(userid) {
    const data = await query("SELECT ID, Lehrer, Admin FROM user WHERE (ID = ?)", [userid])
    return data[0]
}

async function verifyToken(token) {
    if (await userWithTokenExists(token)) {
        let id = await getIDByToken(token);
        let permissions = await getUserPermissions(id);
        return permissions;
    } else {
        return false;
    }
}

app.post('/auth/register', async (req, res) => {
    const uname = req.body.uname;
    const email = req.body.email;
    const password = req.body.password;
    if (uname.trim().length === 0 || email.trim().length === 0 || password.trim().length === 0) {
        res.status(422);
        return res.json({
            message: "Some fields are empty"
        })
    }

    if (await userWithEmailExists(email)) {
        console.log("exists")
        res.status(422);
        return res.json({
            message: "User exists already"
        });

    }
    else {
        console.log("created")
        await createNewUser(uname, email, password)
        res.status(201);
        return res.json({
            message: "User created successfully"
        });
    }
});

app.post('/auth/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (email.trim().length === 0 || password.trim().length === 0) {
        res.status(403);
        return res.json({
            message: "Some fields are empty"
        })
    }

    if (!(await userWithEmailExists(email))) {

        console.log("doesn't exist")
        res.status(403);
        return res.json({
            message: "No such user"
        });
    }
    console.log("exists")

    if (!(await verifyPassword(password, email))) {
        res.status(403);
        return res.json({
            message: "Wrong password"
        });
    }

    const userID = await getUserID(email);
    const token = await createSession(userID);

    console.log(token)
    res.status(200);
    return res.json({
        message: token
    });

});


app.post("/auth/reset", async (req, res)  => {
    // Internal, so it will work if you are already logged in.
    const token = req.body.token;
    const newPassword = req.body.password;

    if (newPassword.trim().length === 0) {
        return res.json({
            message: "Some fields are empty"
        })
    }

    if (await userWithTokenExists(token)) {
        const userID = await getIDByToken(token);
        resetPassword(userID, newPassword);
        return res.status(200).end();
    
    }
    else {
        return res.status(403).json({message: "Wrong token"})
    }
})

// Can be .delete() but the route right now is so.
app.post("/user/delete/:id", async (req, res)  => {
    const toDeleteUserID = req.params.id;
    const token = req.body.token;

    if (toDeleteUserID.trim().length === 0 || !(await userWithIDExists(toDeleteUserID))) {
        return res.status(400).json({
            message: "Invalid ID"
        })
    }
    
    const permissions = await verifyToken(token);
    if (permissions && permissions.Admin === 1) {
        await removeUser(toDeleteUserID);
        await removeSubscriptions(toDeleteUserID);
        await closeSession(toDeleteUserID);
        // TODO: clean from teams
        return res.status(200).end();
    }
    else {
        console.log("Not an Admin")
        return res.status(403).json({message: "Du hast nicht die nötigen Berechtigungen."});
    }
})


/* PUSH-NOTIFICATIONS */


function setupWebpush() {
    const publicVapidKey = process.env.BUEFFLER_VAPID_PUBLIC;
    const privateVapidKey = process.env.BUEFFLER_VAPID_PRIVATE;

    webpush.setVapidDetails("mailto:fiadmin@localhosts", publicVapidKey, privateVapidKey);
}
setupWebpush();


async function sendPush() {
    const now = new Date();
    let nearTime = new Date();
    nearTime.setDate(now.getDate() + 1);

    const appointments = await getAllAppointmentsWithinTimeframe(now, nearTime);



    const toSend = {}
    for (const appointment of appointments) {
        let teamID = appointment.TeamID;
        let teamData = await listTeammates(teamID);
        if (teamData.length > 0) {
            let teamMembers = teamData[0].Mitglieder;

            teamMembers.forEach((member) => {
                if (member in toSend) {

                    toSend[member].push(appointment)
                }
                else {
                    toSend[member] = [appointment]
                }
            })
        }
    }

    const subscriptions = {}

    for (const userID of Object.keys(toSend)) {
        let pushSubscriptions = await getSubscriptions(userID)
        if (pushSubscriptions.length > 0) {
            subscriptions[userID] = pushSubscriptions;
        }

    }

    for (const [userID, pushsubscriptions] of Object.entries(subscriptions)) {
        let appointments = toSend[userID];
        for (const address of pushsubscriptions) {
            for (const appointment of appointments) {
                console.log(address.Subscription)
                console.log(formatAppointment(appointment))
                webpush.sendNotification(address.Subscription, formatAppointment(appointment))
            }
        }
    }
}


function formatAppointment(appointment) {
    const date = new Date(appointment.Datum);
    return JSON.stringify({title: appointment.Titel, body: `Datum: ${formatDate(date)}; Fach: ${appointment.Fach}; Lehrer: ${appointment.Lehrer}`})
}

app.post("/push/subscribe", async (req, res) => {
    const subscription = req.body.subscription;
    const token = req.body.token;

    if (await userWithTokenExists(token)) {
        const userID = await getIDByToken(token);
        await addSubscriptions(userID, subscription);
        return res.json({
            message: "Subscribed successfully"
        })
    }
    else {
        return res.json({
            message: "Wrong token"
        })
    }
})


app.post("/push/unsubscribe", async (req, res) => {
    const token = req.body.token;

    if (await userWithTokenExists(token)) {
        const userID = await getIDByToken(token);
        await removeSubscriptions(userID);
        return res.json({
            message: "Removed all subscriptions successfully"
        })
    }
    else {
        return res.json({
            message: "Wrong token"
        })
    }
})

app.get("/pingpush", (req, res) => {
    sendPush()
    return res.status(200).end();
})



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



app.post('/appointment/list', async(req, res) => {
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

app.post('/appointment/view', async(req, res) => {
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

app.post('/appointment/create', async(req, res) => {
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

app.post('/appointment/edit', async(req, res) => {
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

app.post('/appointment/delete', async(req, res) => {
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

/* TEAMS */


async function listTeammates(teamid) {
    return await query("SELECT TeamName, Mitglieder FROM teams WHERE TeamID LIKE ?", [teamid]);
}

function createTeam(teamName){
    return query("INSERT INTO teams (TeamName) VALUES (?)", [teamName]);
}

function deleteTeam(teamID) {
    return query("DELETE FROM teams WHERE (TeamID = ?)", [teamID]);
}

app.post('/teams/create', async (req, res) => {
    const token = req.body.token;
    const name = req.body.name;

    let response;
    let permissions = await verifyToken(token);
    if (permissions.Lehrer === 1) {
        if (name && name.length > 0) {
            res.status(201);
            response = "Team erstellt!";
            createTeam(name);
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

app.post('/teams/delete', async (req, res) => {
    const token = req.body.token;
    const id = req.body.id;

    let response;
    let permissions = await verifyToken(token);
    if (permissions.Lehrer === 1) {
        if (id) {
            res.status(201);
            response = "Team gelöscht!";
            deleteTeam(id);
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

app.post('/teams/add', async(req, res) => {
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

app.post('/teams/remove', async(req, res) => {
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

app.post('/teams/promote', async(req, res) => {
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

app.post('/teams/demote', async(req, res) => {
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

/* USERS */

function getUserMail(userid) {
    return query("SELECT Mail FROM user WHERE ID LIKE ?", [userid]);
}

app.post('/user/maketeacher', async(req, res) => {
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

app.post('/user/makeadmin', async(req, res) => {
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

/* SMTP */

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
