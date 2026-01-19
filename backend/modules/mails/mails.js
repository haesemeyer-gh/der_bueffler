import 'dotenv/config';
import nodemailer from 'nodemailer';
import cron from 'node-cron';

import { query } from '../db/db.js';
import { appointmentToObject } from '../appointments/appointments.js';
import { getUserMail } from '../users/users.js';
import { listTeammates } from '../teams/teams.js';

/* SMTP */

const transporter = nodemailer.createTransport({
    host: process.env.BUEFFLER_SMTP_HOST,
    port: process.env.BUEFFLER_SMTP_PORT,
    secure: (process.env.BUEFFLER_SMTP_SSLPORT465==="true" ? true : false), // SSL (Port 465)
    auth: {
        user: process.env.BUEFFLER_SMTP_USER,
        pass: process.env.BUEFFLER_SMTP_PASS
    },
    tls: {
        rejectUnauthorized: (process.env.BUEFFLER_SMTP_REJECTSELFSIGNED==="false" ? false : true) // erlaubt self-signed zertifikate
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

async function getWeeklyAppointments() {
    let appointmentResponse = await query("SELECT * FROM appointments WHERE Datum BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY);", []);
    let weeklyAppointments = [];
    appointmentResponse.forEach((appointment, i) => {
        let appointmentObject = appointmentToObject(appointment.Titel, appointment.TeamID, appointment.Datum, appointment.Fach, appointment.Lehrer, appointment.Notizen);
        weeklyAppointments.push(appointmentObject);
    });
    return weeklyAppointments;
}

async function getMailArray() {
    let collectiveMailArray = [];
    return new Promise(async (resolve, reject) => {
        let weeklyAppointments = await getWeeklyAppointments();
        weeklyAppointments.forEach(async (appointment, alli) => {
            let teammemberResponse = await listTeammates(appointment.teamid);
            if (teammemberResponse[0].Mitglieder !== null) {
                teammemberResponse[0].Mitglieder.forEach(async (userid, i) => {
                    let mailResponse = await getUserMail(userid);
                    let alreadyMember = false;
                    let alreadyMemberI = 0;
                    collectiveMailArray.forEach((user, i) => {
                        if (user.mail === mailResponse[0].Mail) {
                            alreadyMember = true;
                            alreadyMemberI = i;
                        }
                    });
                    if (alreadyMember === false) {
                        collectiveMailArray.push({
                            mail: mailResponse[0].Mail,
                            appointments: [
                                appointment
                            ]
                        });
                    } else {
                        collectiveMailArray[alreadyMemberI].appointments.push(appointment);
                    }
                    if (alli+1 === weeklyAppointments.length && i+1 === teammemberResponse[0].Mitglieder.length) {
                        resolve(collectiveMailArray)
                    }
                });
            } else {
                resolve([]);
            }
        });
    });
}

async function sortMailArray() {
    let collectiveMailArray = await getMailArray();
    collectiveMailArray.forEach(user => {
        user.appointments.sort((a,b) => a.date - b.date);
    });
    return collectiveMailArray
}

export async function sendCollectiveMails() {
    let collectiveMailArray = await sortMailArray();
    collectiveMailArray.forEach(user => {
        let digest = `<h1>Diese Woche stehen Termine an!<h1>`;
        user.appointments.forEach((appointment) => {
            digest += `
            <h2>${appointment.title}</h2>
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
