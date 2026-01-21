import { query } from '../db/db.js';

export function addGrade(teacherID, userID, course, timestamp, grade) {
	return query("INSERT INTO grades (LehrerID, SchuelerID, Fach, Timestamp, Note) VALUES (?, ?, ?, ?, ?)", [teacherID, userID, course, timestamp, grade]);
}

export function editGrade(gradeID, grade) {
	return query("UPDATE grades SET Note = ? WHERE (ID = ?)", [grade, gradeID]);
}

export function getAverageForCourse(studentID, course) {
	return query("SELECT AVG(grades.Note) AS Average FROM grades WHERE (SchuelerID = ? AND Fach = ?)", [studentID, course])
}

export function listGrades(teacherID, studentID, course) {
	return query("SELECT * FROM grades WHERE (LehrerID = ? AND SchuelerID = ? AND Fach = ?)", [teacherID, studentID, course]);
}

