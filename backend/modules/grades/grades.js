import { query } from '../db/db.js';

export async function gradeExists(terminID, userID) {
    const res = await query("SELECT Note FROM grades WHERE (TerminID = ? AND NutzerID = ?)", [terminID, userID]);
    return res.length > 0
}

export function addGrade(terminID, userID, grade) {
    return query("INSERT INTO grades (TerminID, NutzerID, Note) VALUES (?, ?, ?)", [terminID, userID, grade]);
}

export function editGrade(terminID, userID, grade) {
    return query("UPDATE grades SET Note = ? WHERE (TerminID = ? AND NutzerID = ?)", [grade, terminID, userID]);
}

export async function getGrade(terminID, userID) {
    const res = await query("SELECT Note FROM grades WHERE (TerminID = ? AND NutzerID = ?)", [terminID, userID]);
    return res.length > 0 ? res[0].Note : null
}

export function getAverageForCourse(userID, course) {
    return query("SELECT AVG(grades.Note) AS Average FROM grades LEFT JOIN appointments ON appointments.TerminID = grades.TerminID WHERE (grades.NutzerID = ? AND appointments.Fach = ?)", [userID, course])
}
