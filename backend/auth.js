import argon2 from 'argon2';

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
