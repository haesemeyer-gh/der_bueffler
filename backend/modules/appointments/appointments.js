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
	return query("SELECT TerminID, Datum, Titel, Fach, Lehrer FROM appointments WHERE TeamID = ?", [teamid]);
}

export async function listUserAppointments(userid) {
	let teamIds = []
	let allTeams = await query("SELECT TeamID, Mitglieder FROM teams")
	for (let i = 0; i < allTeams.length; i++) {
		if (allTeams[i].Mitglieder.includes(userid)) {
			teamIds.push(allTeams[i].TeamID)
		}
	}
	let appointments = []
	for (let i = 0; i < teamIds.length; i++) {
		let current = await query("SELECT TerminID, Datum, Titel, Fach, Lehrer FROM appointments WHERE TeamID = ?", [teamIds[i]])
		appointments.push(...current)
	}
	return appointments
}

export async function listMonthlyAppointments(userid, month, year) {
	let teamIds = []
	let allTeams = await query("SELECT TeamID, Mitglieder FROM teams")
	for (let i = 0; i < allTeams.length; i++) {
		if (allTeams[i].Mitglieder.includes(userid)) {
			teamIds.push(allTeams[i].TeamID)
		}
	}
	let appointments = []
	for (let i = 0; i < teamIds.length; i++) {
		let current = await query("SELECT TerminID, Datum, Titel, Fach, Lehrer FROM appointments WHERE TeamID = ? AND MONTH(Datum) = ? AND YEAR(Datum) = ?", [teamIds[i],month, year])
		appointments.push(...current)
	}
	return appointments
}


export async function viewAppointment(terminid) {
	return query(
	   `SELECT appointments.TerminID,
		appointments.TeamID,
		appointments.ZuletztGeaendert,
		appointments.Datum,
		appointments.Titel,
		appointments.Fach,
		appointments.Lehrer,
		appointments.Notizen,
		user.Name AS ZuletztGeaendertName,
		teams.TeamName
		FROM appointments
		INNER JOIN user ON appointments.ZuletztGeaendert = user.ID
		INNER JOIN teams ON appointments.TeamID = teams.TeamID
		WHERE TerminID = ?`, [terminid])
}

export async function editAppointment(terminid, userid, date, title, course, teacher, notes) {
	let current = await viewAppointment(terminid)
	query("INSERT INTO changes (Timestamp, TerminID, ZuletztGeaendert, Datum, Titel, Fach, Lehrer, Notizen) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [new Date(), current[0].TerminID, current[0].ZuletztGeaendert, current[0].Datum, current[0].Titel, current[0].Fach, current[0].Lehrer, current[0].Notizen])
	return query("UPDATE appointments SET ZuletztGeaendert = ?, Datum = ?, Titel = ?, Fach = ?, Lehrer = ?, Notizen = ? WHERE TerminID = ?", [userid, date, title, course, teacher, notes, terminid]);
}

export async function deleteAppointment(userid, terminid) {
	let current = await viewAppointment(terminid);
    query("INSERT INTO changes (Timestamp, TerminID, ZuletztGeaendert, Datum, Titel, Fach, Lehrer, Notizen) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [new Date(), current[0].TerminID, current[0].ZuletztGeaendert, current[0].Datum, current[0].Titel, current[0].Fach, current[0].Lehrer, current[0].Notizen])
	query("INSERT INTO changes (Timestamp, TerminID, ZuletztGeaendert, Datum, Titel, Fach, Lehrer, Notizen) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [new Date(), current[0].TerminID, userid, current[0].Datum, "--GELÖSCHT--", current[0].Fach, current[0].Lehrer, current[0].Notizen])
	return query("DELETE FROM appointments WHERE TerminID = ?", [terminid]);
}

