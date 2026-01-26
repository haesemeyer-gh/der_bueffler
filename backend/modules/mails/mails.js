import 'dotenv/config';
import nodemailer from 'nodemailer';
import cron from 'node-cron';

import { query } from '../db/db.js';
import { appointmentToObject } from '../appointments/appointments.js';
import { getUserInfo } from '../users/users.js';
import { listTeammates } from '../teams/teams.js';

/* SMTP */

const transporter = nodemailer.createTransport({
	host: process.env.BUEFFLER_SMTP_HOST,
	port: process.env.BUEFFLER_SMTP_PORT,
	secure: (process.env.BUEFFLER_SMTP_SSLPORT465 === "true" ? true : false), // SSL (Port 465)
	auth: {
		user: process.env.BUEFFLER_SMTP_USER,
		pass: process.env.BUEFFLER_SMTP_PASS
	},
	tls: {
		rejectUnauthorized: (process.env.BUEFFLER_SMTP_REJECTSELFSIGNED === "false" ? false : true) // erlaubt self-signed zertifikate
	}
});

async function sendmail(to, subject, html) {
	const smtpstatus = await transporter.sendMail({
		from: process.env.BUEFFLER_SMTP_FROM,
		to: to,
		subject: subject,
		text: html, // eigentlich plain text fallback
		html: html
	});
	//console.log(smtpstatus);
};

/* DIGESTS */

function startDigest() {
	cron.schedule(process.env.BUEFFLER_CRON, () => { // should run each saturday @ 07:00
		sendCollectiveMails();
	});
};

// liest alle Appointments dieser Woche aus der Datenbank aus und gibt einen Array an appointmentObjects zurück
async function getWeeklyAppointments() {
	let appointmentResponse = await query("SELECT * FROM appointments WHERE Datum BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY);", []);
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
		sendmail(user.mail, "Diese Woche stehen Termine an!", digest);
	});
}

export default startDigest;

