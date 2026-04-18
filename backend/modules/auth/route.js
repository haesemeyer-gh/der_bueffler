import express from 'express';

import * as auth from './auth.js';
import sendmail from '../mails/mails.js';

const authRouter = express.Router();

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
	} else if (!/^[a-zA-Z0-9_.+-]+@(?:(?:[a-zA-Z0-9-]+\.)?[a-zA-Z]+\.)?(bbw-fi\.de|bbw-azubi\.de|sfz-net\.de|sfz-chemnitz\.de|sfz\.de)$/.test(email)) {
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

	}
	else {
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

	}
	else {
		return res.status(403).json({message: "Wrong token"})
	}
})

authRouter.post("/auth/requestreset", async (req, res) => {
	const email = req.body.email;

	if (await auth.userWithEmailExists(email)) {
		const userID = await auth.getUserID(email);
		const token = await auth.createSessionNonDestructive(userID);

		// send user frontend link to reset password
		let mailbody = `<h1>Der Büffler: Passwortzurücksetzung</h1>
			<p>Klicke den folgenden Link um dein Büffler-Passwort zurückzusetzen:<br/><br/>
			<a href="${process.env.BUEFFLER_MAIL_FRONTENDLINK}/reset?s=${token}">Hier klicken</a><br/><br/>
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

// Can be .delete() but the route right now is so.
authRouter.post("/user/delete/:id", async (req, res)  => {
	const toDeleteUserID = req.params.id;
	const token = req.body.token;

	if (toDeleteUserID === null || toDeleteUserID.trim().length === 0 || !(await auth.userWithIDExists(toDeleteUserID))) {
		return res.status(400).json({
			message: "Invalid ID"
		})
	}

	const permissions = await auth.verifyToken(token);
	if (permissions.Admin === 1) {
		await auth.removeUser(toDeleteUserID);
		await auth.removeSubscriptions(toDeleteUserID);
		await auth.closeSession(toDeleteUserID);
		// TODO: clean from teams
		return res.status(200).end();
	}
	else {
		console.log("Not an Admin")
		return res.status(403).json({message: "Du hast nicht die nötigen Berechtigungen."});
	}
})

export default authRouter;

