import express from 'express';

import * as auth from './auth.js';
import { purgeUserFromTeams } from '../teams/teams.js'
import sendmail from '../mails/mails.js';

const authRouter = express.Router();

const emailRegexString = `^[a-zA-Z0-9_.+-]+@(?:(?:[a-zA-Z0-9-]+\.)?[a-zA-Z]+\.)?(${process.env.BUEFFLER_MAIL_DOMAIN_WHITELIST})$`;
const emailRegex = new RegExp(emailRegexString);

authRouter.post('/auth/register', async (req, res) => {
	const uname = req.body.uname;
	const email = req.body.email;
	const password = req.body.password;

	if (uname === null || uname.trim().length === 0 || email === null || email.trim().length === 0 || password === null || password.trim().length === 0) {
		res.status(422);
		return res.json({
			message: "Some fields are empty"
		})
	} else if (await auth.userWithEmailExists(email)) {
		console.log("exists")
		res.status(409);
		return res.json({
			message: "User exists already"
		});
	} else if (!emailRegex.test(email)) {
		res.status(403);
		return res.json({
			message: "Your E-Mail is not valid."
		});
	} else {
		console.log("created")

		const mailtoken = crypto.randomUUID();
		await auth.createNewUser(uname, email, password, mailtoken)

		// send user frontend link to reset password
		let mailbody = `<h1>Der Büffler: E-Mail Verifikation</h1>
			<p>Klicke den folgenden Link um deine E-Mail Adresse zu verifizieren:<br/><br/>
			<a href="${process.env.BUEFFLER_MAIL_FRONTENDLINK}/verify?s=${mailtoken}">Hier klicken</a><br/><br/>
			Viel Spaß beim Büffeln!</p>
		`;
		sendmail(email, "Büffler Verifikation", mailbody);

		res.status(201);
		return res.json({
			message: "User created successfully"
		});
	}
});

authRouter.post('/auth/login', async (req, res) => {
	const email = req.body.email;
	const password = req.body.password;

	if (email === null || email.trim().length === 0 || password === null || password.trim().length === 0) {
		res.status(422);
		return res.json({
			message: "Some fields are empty"
		})
	}

	if (!(await auth.userWithEmailExists(email))) {
		console.log("doesn't exist")
		res.status(403);
		return res.json({
			message: "No such user"
		});
	}
	console.log("exists")

	if (!(await auth.usersMailIsVerified(email))) {
		res.status(403);
		return res.json({
			message: "Unverified"
		});
	}

	if (!(await auth.verifyPassword(password, email))) {
		res.status(403);
		return res.json({
			message: "Wrong password"
		});
	}

	const userID = await auth.getUserID(email);
	const token = await auth.createSession(userID);

	console.log(token)
	res.status(200);
	return res.json({
		message: token
	});

});

authRouter.post("/auth/verify", async (req, res)  => {
	const mailtoken = req.body.mailtoken;

	if (mailtoken === null || mailtoken.trim().length === 0) {
		return res.json({
			message: "Some fields are empty"
		})
	}

	if (await auth.userWithMailTokenExists(mailtoken)) {
		auth.verifyMail(mailtoken);
		return res.status(201).json({
			message: "Mail verified!"
		});
	} else {
		return res.status(403).json({message: "Wrong token"})
	}
})

authRouter.post("/auth/rename", async (req, res)  => {
	const token = req.body.token;
	const newName = req.body.name;

	if (newName === null || newName.trim().length === 0) {
		return res.json({
			message: "Some fields are empty"
		})
	}

	if (await auth.userWithTokenExists(token)) {
		const userID = await auth.getIDByToken(token);
		auth.changeName(userID, newName);
		return res.status(201).json({
			message: "Name changed!"
		});
	} else {
		return res.status(403).json({message: "Wrong token"})
	}
})

authRouter.post("/auth/reset", async (req, res)  => {
	// Internal, so it will work if you are already logged in.
	const token = req.body.token;
	const newPassword = req.body.password;

	if (newPassword === null || newPassword.trim().length === 0) {
		return res.json({
			message: "Some fields are empty"
		})
	}

	if (await auth.userWithTokenExists(token)) {
		const userID = await auth.getIDByToken(token);
		auth.resetPassword(userID, newPassword);
		auth.createSession(userID);
		return res.status(201).json({
			message: "Reset password! You may now log in!"
		});
	} else {
		return res.status(403).json({message: "Wrong token"})
	}
})

authRouter.post("/auth/requestreset", async (req, res) => {
	const email = req.body.email;

	if (await auth.userWithEmailExists(email)) {
		if (!(await auth.usersMailIsVerified(email))) {
			res.status(403);
			return res.json({
				message: "Unverified"
			});
		}

		const userID = await auth.getUserID(email);
		const resetToken = await auth.createSessionNonDestructive(userID);

		// send user frontend link to reset password
		let mailbody = `<h1>Der Büffler: Passwortzurücksetzung</h1>
			<p>Klicke den folgenden Link um dein Büffler-Passwort zurückzusetzen:<br/><br/>
			<a href="${process.env.BUEFFLER_MAIL_FRONTENDLINK}/reset?s=${resetToken}">Hier klicken</a><br/><br/>
			Viel Spaß beim Büffeln!</p>
		`;
		sendmail(email, "Büffler Passwortzurücksetzung", mailbody);

		res.status(201);
		return res.json({
			message: "Please check your inbox."
		});
	} else {
		res.status(404);
		return res.json({
			message: "This E-Mail Adress is not registered."
		});
	}
})

authRouter.post("/auth/delete", async (req, res)  => {
	const token = req.body.token;
	const toDeleteUserID = req.body.id;

	if (!auth.userWithTokenExists(req.body.token)) {
		return res.status(403).json({message: "Wrong token"})
	}
	if (!auth.userWithIDExists(toDeleteUserID)) {
		return res.status(403).json({message: "This User does not exist."})
	}

	const permissions = await auth.verifyToken(token);
	if (permissions.Admin === 1 || permissions.ID === toDeleteUserID) {
		await auth.removeUser(toDeleteUserID);
		await auth.removeSubscriptions(toDeleteUserID);
		await auth.closeSession(toDeleteUserID);
		await teams.purgeUserFromTeams(toDeleteUserID);
		return res.status(200).json({
			message: "User deleted."
		});
	} else {
		return res.status(403).json({message: "You do not have permissions to delete this user."})
	}
})

authRouter.post("/auth/requestdeletion", async (req, res) => {
	const token = req.body.token;

	if (await auth.userWithTokenExists(token)) {
		const userID = await auth.getIDByToken(token);
		const mail = await auth.getUserMail(userID);
		const deletionToken = await auth.createSessionNonDestructive(userID);

		// send user frontend link to delete account
		let mailbody = `<h1>Der Büffler: Account Löschen</h1>
			<p>Klicke den folgenden Link um deinen Büffler-Account zu löschen:<br/><br/>
			<a href="${process.env.BUEFFLER_MAIL_FRONTENDLINK}/delete?t=${deletionToken}&d=${userID}">Hier klicken</a><br/><br/>
			Viel Spaß beim Büffeln!</p>
		`;
		sendmail(email, "Büffler Account Löschen", mailbody);

		res.status(201);
		return res.json({
			message: "Please check your inbox."
		});
	} else {
		res.status(404);
		return res.json({
			message: "This Account does not exist."
		});
	}
})

