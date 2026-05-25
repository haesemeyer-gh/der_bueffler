import 'dotenv/config';
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

export async function userWithMailTokenExists(mailtoken) {
	const data = await query("SELECT * FROM user WHERE (MailToken = ?)", [mailtoken])
	return data.length > 0
}

export async function verifyMail(mailtoken) {
	return await query("UPDATE user SET MailVerifiziert = 1 WHERE (MailToken = ?)", [mailtoken])
}

export async function usersMailIsVerified(email) {
	const data = await query("SELECT * FROM user WHERE (Mail = ? AND MailVerifiziert = 1)", [email])
	return data.length > 0
}

export async function createNewUser(uname, email, password, mailtoken) {
	const hash = await encrypt(password)
	const verified = (process.env.BUEFFLER_MAIL_VERIFICATION_REQUIRED === "true" ? 0 : 1);
	const teacher = (process.env.BUEFFLER_MAKE_ALL_TEACHER === "true" ? true : false);
	const admin = (process.env.BUEFFLER_MAKE_ALL_ADMIN === "true" ? true : false);
	return await query("INSERT INTO user (Mail, Passwort, Name, MailToken, MailVerifiziert, Lehrer, Admin) VALUES (?, ?, ?, ?, ?, ?, ?)", [email, hash, uname, mailtoken, verified, teacher, admin])
}

export async function changeName(userid, name) {
	return await query("UPDATE user SET Name = ? WHERE (ID = ?)", [name, userid])
}

export async function resetPassword(userid, password) {
	const hash = await encrypt(password)
	return await query("UPDATE user SET Passwort = ? WHERE (ID = ?)", [hash, userid])
}

export async function userWithIDExists(userid) {
	const data = await query("SELECT 1 FROM user WHERE (ID = ?)", [userid]);
	return data.length > 0
}

export async function getUserID(email) {
	const data = await query("SELECT ID FROM user WHERE (Mail = ?)", [email])
	return data[0].ID
}

export async function getUserMail(userid) {
	const data = await query("SELECT Mail FROM user WHERE (ID = ?)", [userid])
	return data[0].Mail
}

export async function removeUser(userid) {
	return await query("DELETE FROM user WHERE (ID = ?)", [userid])
}

export async function getIDByToken(token) {
	const data = await query("SELECT NutzerID FROM session WHERE (Token = ?)", [token])
	return data[0].NutzerID
}

export async function verifyPassword(password, email) {
	const data = await query("SELECT Passwort FROM user WHERE (Mail = ?)", [email])
	return await verify(data[0].Passwort, password)
}

export async function createSession(userid) {
	const uuid = crypto.randomUUID();
	await closeSession(userid)
	await query("INSERT INTO session (Token, NutzerID) VALUES (?, ?)", [uuid, userid])
	await markOnline(userid)
	return uuid
}

export async function createSessionNonDestructive(userid) {
	const uuid = crypto.randomUUID();
	//await closeSession(userid)
	await query("INSERT INTO session (Token, NutzerID) VALUES (?, ?)", [uuid, userid])
	//await markOnline(userid)
	return uuid
}

export async function closeSession(userid) {
	return await query("DELETE FROM session WHERE (NutzerID = ?)", [userid])
}

export async function markOnline(userid) {
	return await query("UPDATE user SET online = ? WHERE (ID = ?)", [new Date(), userid])
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

