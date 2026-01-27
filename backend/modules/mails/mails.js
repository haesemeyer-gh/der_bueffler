import 'dotenv/config';
import nodemailer from 'nodemailer';

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

export default sendmail;

