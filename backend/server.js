import 'dotenv/config';
import cors from 'cors';
import express from 'express';

import appointmentsRouter from './modules/appointments/route.js';
import authRouter from './modules/auth/route.js';
import pushRouter from './modules/push/route.js';
import teamsRouter from './modules/teams/route.js';
import usersRouter from './modules/users/route.js';
import gradesRouter from './modules/grades/route.js';

import startDigest from './modules/mails/mails.js';
import setupWebpush from './modules/push/push.js';

//tmp
import { sendCollectiveMails } from './modules/mails/mails.js';
import { listUserAppointments } from './modules/appointments/appointments.js';


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use("/", express.static("../frontend"))

app.get('/ping', (req, res) => {
	res.json({
		message: "pong"
	});
});

app.use(appointmentsRouter);
app.use(authRouter);
app.use(pushRouter);
app.use(teamsRouter);
app.use(usersRouter);
app.use(gradesRouter);

app.listen(process.env.BUEFFLER_PORT, async () => {
	console.log("Web-Server verfügbar!");
	startDigest();
	setupWebpush();

	//tmp
	//sendCollectiveMails();
	console.log(await listUserAppointments(1))
});

