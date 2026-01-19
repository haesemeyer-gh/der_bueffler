import 'dotenv/config';
import webpush from 'web-push';

import { query } from '../db/db.js';
import { formatDate } from '../auth/auth.js';

async function getAllAppointmentsWithinTimeframe(start, end) {
    return await query("SELECT * FROM appointments WHERE Datum BETWEEN ? AND ?", [formatDate(start), formatDate(end)]);
}

async function getSubscriptions(userID) {
    return await query("SELECT Subscription FROM push_subscriptions WHERE (NutzerID = ?)", [userID])
}

export async function addSubscriptions(userID, subscription) {
    return await query("INSERT IGNORE INTO push_subscriptions (Subscription, NutzerID) VALUES (?, ?)", [subscription, userID]);
}

export async function removeSubscriptions(userID) {
    return await query("DELETE FROM push_subscriptions WHERE (NutzerID = ?)", [userID]);
}

function setupWebpush() {
    const publicVapidKey = process.env.BUEFFLER_VAPID_PUBLIC;
    const privateVapidKey = process.env.BUEFFLER_VAPID_PRIVATE;

    webpush.setVapidDetails("mailto:fiadmin@localhosts", publicVapidKey, privateVapidKey);
}

export async function sendPush() {
    const now = new Date();
    let nearTime = new Date();
    nearTime.setDate(now.getDate() + 1);

    const appointments = await getAllAppointmentsWithinTimeframe(now, nearTime);

    const toSend = {}
    for (const appointment of appointments) {
        let teamID = appointment.TeamID;
        let teamData = await listTeammates(teamID);
        if (teamData.length > 0) {
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

    for (const userID of Object.keys(toSend)) {
        let pushSubscriptions = await getSubscriptions(userID)
        if (pushSubscriptions.length > 0) {
            subscriptions[userID] = pushSubscriptions;
        }

    }

    for (const [userID, pushsubscriptions] of Object.entries(subscriptions)) {
        let appointments = toSend[userID];
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
    const date = new Date(appointment.Datum);
    return JSON.stringify({title: appointment.Titel, body: `Datum: ${formatDate(date)}; Fach: ${appointment.Fach}; Lehrer: ${appointment.Lehrer}`})
}

export default setupWebpush;
