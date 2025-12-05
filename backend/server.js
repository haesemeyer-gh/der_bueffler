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


function userWithEmailExits(email) {
    return query("SELECT * FROM user WHERE (Mail = ?)", [email]).then(data => (data.length > 0))
}

function createNewUser(uname, email, password) {
    return encrypt(password).then(hash => query("INSERT INTO user (Mail, Passwort, Name, Lehrer, Admin) VALUES (?, ?, ?, 0, 0)", [email, hash, uname]))
}

function getUserID(email) {
    return query("SELECT ID FROM user WHERE (Mail = ?)", [email])
}

function verifyPassword(password, email) {
    return query("SELECT Passwort FROM user WHERE (Mail = ?)", [email]).then(data => (verify(data[0]["Passwort"], password)))
}


function createSession(userID) {
    const uuid = crypto.randomUUID();
    return closeSession(userID).then(() => query("INSERT INTO session (Token, NutzerID) VALUES (?, ?)", [uuid, userID]).then(() => {
        markOnline(userID);
        return uuid;
    }))
}

function closeSession(userID) {
    return query("DELETE FROM session WHERE (NutzerID = ?)", [userID])
}


function markOnline(userID) {
    const date = new Date()

    return query("UPDATE user SET online = ? WHERE (ID = ?)", [date.toISOString("de").split('T')[0], userID])
}


app.post('/auth/register', (req, res) => {
    // rq.body.name, rq.body.email, rq.body.password

    const uname = req.body.uname;
    const email = req.body.email;
    const password = req.body.password;

    userWithEmailExits(email).then(exist => {
        if (exist) {
            console.log("exists")
            res.json({
                message: "User exists already"
            });

        }
        else {
            console.log("created")
            createNewUser(uname, email, password).then(() => {
                res.json({
                    message: "User created successfully"
                });

            })
        }
    })
});

app.post('/auth/login', (req, res) => {
    // rq.body.email, rq.body.password

    const email = req.body.email;
    const password = req.body.password;

    userWithEmailExits(email).then(exist => {
        if (exist) {
            console.log("exists")
            return verifyPassword(password, email);
        }
        else {
            console.log("doesn't exist")
            res.json({
                message: "No such user"
            });
            return null;
        }
    }).then(verified => {
        if (verified !== null) {
            if (verified) {
                return getUserID(email)
                .then(data => createSession(data[0]["ID"]))
            }
            else {
                res.json({
                    message: "Wrong password"
                });
                return null;
            }
        }
        else {
            return null;
        }

    }).then(token => {
        console.log(token)
        if (token !== null) {
            res.json({
                message: token
            });
        }
    })

});

/* APPOINTMENTS */

function appointmentToObject(title, date, course, teacher, notes) {
    let dateString = new Date(date).toLocaleString('de-DE', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'});
    let appointmentObject = {
        title: title,
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
        getWeeklyAppointments();
    });
};

function getWeeklyAppointments() {
    let collectiveMailArray = [];
    let appointments_response = query("SELECT * FROM appointments WHERE Datum BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY);", []);
    appointments_response.then((response) => {
        let appointmentLength = response.length;
        if (appointmentLength > 0) {
            response.forEach((appointment, appointmentI) => {
                let appointmentObject = appointmentToObject(appointment.Titel, appointment.Datum, appointment.Fach, appointment.Lehrer, appointment.Notizen);

                let teammember_response = listTeammates(appointment.TeamID);
                teammember_response.then((response) => {
                    if (response.length === 1) {
                        response[0].Mitglieder.forEach((userid) => {
                            let mail_response = getUserMail(userid);
                            mail_response.then((response) => {
                                if (response.length === 1) {
                                    let alreadyMember = false;
                                    let alreadyMemberI = 0;
                                    collectiveMailArray.forEach((user, i) => {
                                        if (user.mail === response[0].Mail) {
                                            alreadyMember = true;
                                            alreadyMemberI = i;
                                        }
                                    });
                                    if (alreadyMember === false) {
                                        collectiveMailArray.push({
                                            mail: response[0].Mail,
                                            appointments: [
                                                appointmentObject
                                            ]
                                        })
                                    } else {
                                        collectiveMailArray[alreadyMemberI].appointments.push(appointmentObject)
                                    }
                                }
                            }).then(() => {
                                if (appointmentI+1 === appointmentLength) {
                                    sendCollectiveMails(collectiveMailArray);
                                }
                            });
                        });
                    }
                });

            });
        }
    });
}

function sendCollectiveMails(arr) {
    arr.forEach(user => {
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
    getWeeklyAppointments();
});
