import { query } from '../db/db.js';

export function addGrade(teacherid, userid, course, timestamp, grade) {
	return query("INSERT INTO grades (LehrerID, SchuelerID, Fach, Timestamp, Note) VALUES (?, ?, ?, ?, ?)", [teacherid, userid, course, timestamp, grade]);
}

export function editGrade(gradeid, grade) {
	return query("UPDATE grades SET Note = ? WHERE (ID = ?)", [grade, gradeid]);
}

export function getAverageForCourse(studentid, course) {
	return query("SELECT AVG(grades.Note) AS Average FROM grades WHERE (SchuelerID = ? AND Fach = ?)", [studentid, course])
}

export function listGrades(teacherid, studentid, course) {
	return query("SELECT * FROM grades WHERE (LehrerID = ? AND SchuelerID = ? AND Fach = ?)", [teacherid, studentid, course]);
}

