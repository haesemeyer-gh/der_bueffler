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
        console.log("inside", res);
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

function userWithEmailExits(email) {
    return query("SELECT * FROM user WHERE (Mail = ?)", [email]).then(data => (data.length > 0))
}

function createNewUser(uname, email, password) {
    return query("INSERT INTO user (Mail, Passwort, Name, Lehrer, Admin) VALUES (?, ?, ?, 0, 0)", [email, password, uname])
}

function getUserID(password, email) {
    return query("SELECT ID FROM user WHERE (Mail = ? AND Passwort = ?)", [email, password])
}

function verifyPassword(password, email) {
    return query("SELECT Passwort FROM user WHERE (Mail = ?)", [email]).then(data => (data[0]["Passwort"] == password))
}


function createSession(userID) {
    const uuid = crypto.randomUUID();
    return closeSession(userID).then(() => query("INSERT INTO session (Token, NutzerID) VALUES (?, ?)", [uuid, userID]).then(() => uuid))
}

function closeSession(userID) {
    return query("DELETE FROM session WHERE (NutzerID = ?)", [userID])
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
    // session token erstellen
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
                return getUserID(password, email)
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

/*  */

app.listen(8080);
