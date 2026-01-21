import express from 'express';

import * as auth from './auth.js'

const authRouter = express.Router();

authRouter.post('/auth/register', async (req, res) => {
	const uname = req.body.uname;
	const email = req.body.email;
	const password = req.body.password;
	if (uname.trim().length === 0 || email.trim().length === 0 || password.trim().length === 0) {
		res.status(422);
		return res.json({
			message: "Some fields are empty"
		})
	}

	if (await auth.userWithEmailExists(email)) {
		console.log("exists")
		res.status(422);
		return res.json({
			message: "User exists already"
		});

	}
	else {
		console.log("created")
		await auth.createNewUser(uname, email, password)
		res.status(201);
		return res.json({
			message: "User created successfully"
		});
	}
});

authRouter.post('/auth/login', async (req, res) => {
	const email = req.body.email;
	const password = req.body.password;

	if (email.trim().length === 0 || password.trim().length === 0) {
		res.status(403);
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


authRouter.post("/auth/reset", async (req, res)  => {
	// Internal, so it will work if you are already logged in.
	const token = req.body.token;
	const newPassword = req.body.password;

	if (newPassword.trim().length === 0) {
		return res.json({
			message: "Some fields are empty"
		})
	}

	if (await auth.userWithTokenExists(token)) {
		const userID = await auth.getIDByToken(token);
		auth.resetPassword(userID, newPassword);
		return res.status(200).end();

	}
	else {
		return res.status(403).json({message: "Wrong token"})
	}
})

// Can be .delete() but the route right now is so.
authRouter.post("/user/delete/:id", async (req, res)  => {
	const toDeleteUserID = req.params.id;
	const token = req.body.token;

	if (toDeleteUserID.trim().length === 0 || !(await auth.userWithIDExists(toDeleteUserID))) {
		return res.status(400).json({
			message: "Invalid ID"
		})
	}

	const permissions = await auth.verifyToken(token);
	if (permissions && permissions.Admin === 1) {
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

