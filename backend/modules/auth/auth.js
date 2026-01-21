import argon2 from 'argon2';

import { query } from '../db/db.js';

export async function encrypt(password) {
    try {
        return await argon2.hash(password)
    } catch(err) {
        console.error(err)
    }
}

export async function verify(hash, password) {
    try {
        return await argon2.verify(hash, password)
    } catch(err) {
        console.error(err)
    }
}

export async function userWithEmailExists(email) {
    const data = await query("SELECT * FROM user WHERE (Mail = ?)", [email])
    return data.length > 0
}

export async function userWithTokenExists(token) {
    const data = await query("SELECT * FROM session WHERE (Token = ?)", [token])
    return data.length > 0
}

export async function createNewUser(uname, email, password) {
    const hash = await encrypt(password)
    return await query("INSERT INTO user (Mail, Passwort, Name, Lehrer, Admin) VALUES (?, ?, ?, 0, 0)", [email, hash, uname])
}

export async function resetPassword(userID, password) {
    const hash = await encrypt(password)
    return await query("UPDATE user SET Passwort = ? WHERE (ID = ?)", [hash, userID])
}

export async function userWithIDExists(userID) {
    const data = await query("SELECT 1 FROM user WHERE (ID = ?)", [userID]);
    return data.length > 0
}

export async function getUserID(email) {
    const data = await query("SELECT ID FROM user WHERE (Mail = ?)", [email])
    return data[0]["ID"]
}

export async function removeUser(userID) {
    return await query("DELETE FROM user WHERE (ID = ?)", [userID])
}

export async function getIDByToken(token) {
    const data = await query("SELECT NutzerID FROM session WHERE (Token = ?)", [token])
    return data[0].NutzerID
}

export async function verifyPassword(password, email) {
    const data = await query("SELECT Passwort FROM user WHERE (Mail = ?)", [email])
    return await verify(data[0]["Passwort"], password)
}

export async function createSession(userID) {
    const uuid = crypto.randomUUID();
    await closeSession(userID)
    await query("INSERT INTO session (Token, NutzerID) VALUES (?, ?)", [uuid, userID])
    await markOnline(userID)
    return uuid

}

export async function closeSession(userID) {
    return await query("DELETE FROM session WHERE (NutzerID = ?)", [userID])
}

export function formatDate(date) {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`
}

export async function markOnline(userID) {
    return await query("UPDATE user SET online = ? WHERE (ID = ?)", [formatDate(new Date()), userID])
}

export async function getUserPermissions(userid) {
    const data = await query("SELECT ID, Lehrer, Admin FROM user WHERE (ID = ?)", [userid])
    return data[0]
}

export async function verifyToken(token) {
    if (await userWithTokenExists(token)) {
        let id = await getIDByToken(token);
        let permissions = await getUserPermissions(id);
        return permissions;
    } else {
        return false;
    }
}

