import 'dotenv/config';
import cron from 'node-cron';

import sendmail from './mails.js';
import { query } from '../db/db.js';
import { appointmentToObject } from '../appointments/appointments.js';
import { getUserInfo } from '../users/users.js';
import { listTeammates } from '../teams/teams.js';

function startDigest() {
	cron.schedule(process.env.BUEFFLER_MAIL_CRON, () => {
		sendCollectiveMails();
	});
};

// liest alle Appointments dieser Woche aus der Datenbank aus und gibt einen Array an appointmentObjects zurück
async function getWeeklyAppointments() {
	let appointmentResponse = await query("SELECT * FROM appointments WHERE Datum BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY) AND Geloescht = 0;", []);
	let weeklyAppointments = [];
	appointmentResponse.forEach((appointment, i) => {
		let appointmentObject = appointmentToObject(appointment.TerminID, appointment.Titel, appointment.TeamID, appointment.ZuletztGeaendert, appointment.Datum, appointment.Fach, appointment.Lehrer, appointment.Notizen);
		weeklyAppointments.push(appointmentObject);
	});
	return weeklyAppointments;
}

// führt getWeelkyAppointments() aus,
// erstellt damit einen neuen Array, der die E-Mails der Nutzer und dazugehörige Arrays enthält,
// in denen alle Appointments sind, die der jeweilige Nutzer sehen darf
async function getMailArray() {
	let collectiveMailArray = [];
	let weeklyAppointments = await getWeeklyAppointments();

	for (const appointment of weeklyAppointments) {
		let teammemberResponse = await listTeammates(appointment.teamid);
		if (teammemberResponse[0].Mitglieder !== null) {
			for (const userid of teammemberResponse[0].Mitglieder) {
				let mailResponse = await getUserInfo(userid);
				let userMail = mailResponse[0].Mail;
				let existingUser = collectiveMailArray.find(user => user.mail === userMail);

				if (existingUser) {
					existingUser.appointments.push(appointment);
				} else {
					collectiveMailArray.push({
						mail: userMail,
						appointments: [appointment]
					});
				}
			}
		}
	}
	return collectiveMailArray;
}

// führt getMailArray() aus, sortiert die Appointments von jedem Nutzer nach Zeit (früheste zuerst)
async function sortMailArray() {
	let collectiveMailArray = await getMailArray();
	collectiveMailArray.forEach(user => {
		user.appointments.sort((a, b) => a.date - b.date);
	});
	return collectiveMailArray
}

// führt sortMailArray() aus, schickt dann eine E-Mail an jeden Nutzer mit Terminen, in der alle Appointments aufgelistet sind
export async function sendCollectiveMails() {
	let collectiveMailArray = await sortMailArray();
	collectiveMailArray.forEach(user => {
		let digest = `<h1>Diese Woche stehen Termine an!<h1>`;
		user.appointments.forEach((appointment) => {
			digest += `
			<h2>${appointment.title}</h2>
			<a href="${process.env.BUEFFLER_MAIL_FRONTENDLINK}/termin?t=${appointment.id}">[diesen Termin online ansehen]</a>
			<ul>
			<li>Datum: <b>${appointment.dateString}</b></li>
			<li>Fach: <b>${appointment.course}</b></li>
			<li>Lehrer: <b>${appointment.teacher}</b></li>
			</ul>
			<h3>Notizen:</h3>
			<p>${appointment.notes}</p>
			`;
		});
		digest += `<hr>\n<p>Diese E-Mail enthält nicht immer den aktuellen Stand aller Termine. Termine können bearbeitet und neu erstellt werden. Sie können <a href="${process.env.BUEFFLER_MAIL_FRONTENDLINK}">online</a> immer die aktuellste Version einsehen.</p>`;
		sendmail(user.mail, "Diese Woche stehen Termine an!", digest);
	});
}

export default startDigest;

