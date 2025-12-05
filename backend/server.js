const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use("/", express.static("../frontend"))

const mariadb = require('mariadb');
const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'aA1234Aa',
    database: 'buefflerdb'
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

/* SMTP */

const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    host: "localhost",
    port: 25,
    secure: false, // SSL
    auth: {
        user: "fiadmin",
        pass: "aA1234Aa"
    },
    tls: {
        rejectUnauthorized: false // erlaubt self-signed zertifikate
    }
});

async function sendmail(to, subject, html) {
    const smtpstatus = await transporter.sendMail({
        from: '"Der Büffler" <fiadmin@localhost>',
        to: to,
        subject: subject,
        text: html, // eigentlich plain text fallback
        html: html
    });
    console.log(smtpstatus);
};

/* DIGESTS */

const cron = require('node-cron');
function startDigest() {
    cron.schedule('0 7 * * SAT', () => { // should run each saturday @ 07:00
        getWeeklyAppointments();
    });
};

function getWeeklyAppointments() {
    let appointments_response = query("SELECT * FROM appointments WHERE Datum BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY);", []);
    appointments_response.then((response) => {
        if (response.length > 0) {
            response.forEach(appointment => {
                let date = new Date(appointment.Datum).toLocaleString('de-DE', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'});
                let teammember_response = query("SELECT TeamName, Mitglieder FROM teams WHERE TeamID LIKE ?", [appointment.TeamID]);
                teammember_response.then((response) => {
                    if (response.length === 1) {
                        response[0].Mitglieder.forEach((userid) => {
                            let mail_response = query("SELECT Mail FROM user WHERE ID LIKE ?", [userid]);
                            mail_response.then((response) => {
                                if (response.length === 1) {
                                    let text = `<h1>Diese Woche steht ein Termin an!</h1>
                                    <h2>${appointment.Titel}</h2>
                                    <ul>
                                    <li>Datum: <b>${date}</b></li>
                                    <li>Fach: <b>${appointment.Fach}</b></li>
                                    <li>Lehrer: <b>${appointment.Lehrer}</b></li>
                                    </ul>
                                    <h3>Notizen:</h3>
                                    <p>${appointment.Notizen}</p>
                                    `;
                                    sendmail(response[0].Mail, "Diese Woche steht ein Termin an!", text);
                                }
                            });
                        });
                    }
                });
            });
        }
    });
}

/*  */

app.listen(8080, () => {
    console.log("Web-Server verfügbar!");
    startDigest();

    //tmp
    getWeeklyAppointments();
});
