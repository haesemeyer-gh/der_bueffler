import { query } from '../db/db.js';

export function appointmentToObject(title, teamid, lastchangedby, date, course, teacher, notes) {
	let dateString = new Date(date).toLocaleString('de-DE', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'});
	let appointmentObject = {
		title: title,
		lastchangedby: lastchangedby,
		teamid: teamid,
		date: date,
		dateString: dateString,
		course: course,
		teacher: teacher,
		notes: notes
	};
	return appointmentObject;
}

export async function createAppointment(teamid, userid, date, title, course, teacher, notes) {
	return query("INSERT INTO appointments (TeamID, ZuletztGeaendert, Datum, Titel, Fach, Lehrer, Notizen) VALUES (?, ?, ?, ?, ?, ?, ?)", [teamid, userid, date, title, course, teacher, notes]);
}

export async function listAppointments(teamid) {
	return query("SELECT Datum, Titel, Fach, Lehrer FROM appointments WHERE TeamID = ?", [teamid]);
}

export async function viewAppointment(terminid) {
	return query("SELECT * FROM appointments WHERE TeamID = ?", [terminid]);
}

export async function editAppointment(terminid, userid, date, title, course, teacher, notes) {
	let current = await viewAppointment(terminid)
	query("INSERT INTO changes (Timestamp, TerminID, ZuletztGeaendert, Datum, Titel, Fach, Lehrer, Notizen) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [new Date(), current[0].TerminID, current[0].ZuletztGeaendert, current[0].Datum, current[0].Titel, current[0].Fach, current[0].Lehrer, current[0].Notizen])
	return query("UPDATE appointments SET ZuletztGeaendert = ?, Datum = ?, Titel = ?, Fach = ?, Lehrer = ?, Notizen = ? WHERE TerminID = ?", [terminid, userid, date, title, course, teacher, notes]);
}

export async function deleteAppointment(terminid) {
	let current = await viewAppointment(terminid);
	query("INSERT INTO changes (Timestamp, TerminID, ZuletztGeaendert, Datum, Titel, Fach, Lehrer, Notizen) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [new Date(), current[0].TerminID, current[0].ZuletztGeaendert, current[0].Datum, current[0].Titel, current[0].Fach, current[0].Lehrer, current[0].Notizen])
	return query("DELETE FROM appointments WHERE TerminID = ?", [terminid]);
}

