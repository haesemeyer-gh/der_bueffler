import { query } from '../db/db.js';

export function makeTeacher(userid) {
	return query("UPDATE user SET Lehrer = 1 WHERE ID LIKE ?;", [userid]);
}

export function makeAdmin(userid) {
	return query("UPDATE user SET Admin = 1 WHERE ID LIKE ?;", [userid]);
}

export function deleteTeacher(userid) {
	return query("UPDATE user SET Lehrer = 0 WHERE ID LIKE ?;", [userid]);
}

export function getUserInfo(userid) {
	return query("SELECT Admin, Lehrer, Name, Mail  FROM user WHERE ID LIKE ?;", [userid]);
}

