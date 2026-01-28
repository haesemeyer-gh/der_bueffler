import 'dotenv/config';
import webpush from 'web-push';
import cron from 'node-cron';

import { query } from '../db/db.js';
import { listTeammates } from '../teams/teams.js';

async function getAllAppointmentsWithinTimeframe(start, end) {
	return await query("SELECT * FROM appointments WHERE ((Datum BETWEEN ? AND ?) AND Geloescht = 0)", [start, end]);
}

async function getSubscriptions(userid) {
	return await query("SELECT Subscription FROM push_subscriptions WHERE (NutzerID = ?)", [userid])
}

export async function addSubscriptions(userid, subscription) {
	return await query("INSERT IGNORE INTO push_subscriptions (Subscription, NutzerID) VALUES (?, ?)", [subscription, userid]);
}

export async function removeSubscriptions(userid) {
	return await query("DELETE FROM push_subscriptions WHERE (NutzerID = ?)", [userid]);
}

function setupWebpush() {
	const publicVapidKey = process.env.BUEFFLER_VAPID_PUBLIC;
	const privateVapidKey = process.env.BUEFFLER_VAPID_PRIVATE;

	webpush.setVapidDetails(process.env.BUEFFLER_MAIL_FRONTENDLINK, publicVapidKey, privateVapidKey);

	cron.schedule(process.env.BUEFFLER_PUSH_CRON, () => {
		sendPush();
	});
}

export async function sendPush() {
	const now = new Date();
	let nearTime = new Date();
	nearTime.setDate(now.getDate() + 1);

	const appointments = await getAllAppointmentsWithinTimeframe(now, nearTime);

	const toSend = {}
	for (const appointment of appointments) {
		let teamData = await listTeammates(appointment.TeamID);
		if (teamData.length > 0 && teamData[0].Mitglieder !== null) {
			let teamMembers = teamData[0].Mitglieder;

			teamMembers.forEach((member) => {
				if (member in toSend) {

					toSend[member].push(appointment)
				}
				else {
					toSend[member] = [appointment]
				}
			})
		}
	}

	const subscriptions = {}

	for (const userid of Object.keys(toSend)) {
		let pushSubscriptions = await getSubscriptions(userid)
		if (pushSubscriptions.length > 0) {
			subscriptions[userid] = pushSubscriptions;
		}

	}

	for (const [userid, pushsubscriptions] of Object.entries(subscriptions)) {
		let appointments = toSend[userid];
		for (const address of pushsubscriptions) {
			for (const appointment of appointments) {
				console.log(address.Subscription)
				console.log(formatAppointment(appointment))
				webpush.sendNotification(address.Subscription, formatAppointment(appointment))
			}
		}
	}
}

function formatAppointment(appointment) {
	const date = new Date(appointment.Datum).toLocaleString('de-DE', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'});
	return JSON.stringify({title: `Ein Termin steht an!`, body: `Titel: ${appointment.Titel}; Datum: ${date}; Fach: ${appointment.Fach}; Lehrer: ${appointment.Lehrer}`})
}

export default setupWebpush;

