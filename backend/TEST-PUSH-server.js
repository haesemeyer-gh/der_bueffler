const express = require('express');
const webpush = require('web-push');


/*
User allows push notifications -> subscription will be addede to the table with subscriptions for users ->
When the appointment has little time left it will look in whcih tema it is, find all users in the team,
find all subscriptions for the users found in the team,  send to all subscriptions the push notification about the given appointment.

# ADD
- [ ] allow push notification button
- [ ] table for the users -> subscription data
- [ ] post api to add to the table new subscription
- [ ] 

# SEND 
- [ ] Find all Appointments that have little time left 1 day 
- [ ] get for each of them the correspondign teams
- [ ] get for each of the teams corresponding members
- [ ] get for each member all subscriptions
- [ ] send push-notification to all the found subscriptions with the data about given appointment
*/

const app = express();

app.use(express.json());

app.use("/", express.static("../frontend/tests"))

const publicVapidKey = "BHm1GIUIGMm3R47i5qRCPCo6oU4Z7dlc_g2JkXptkvcZOFLlobRAgJWpAmzKOrbiKBtBR69J4iB9-ISA_X8suNc";
const privateVapidKey = "S_vmLED21JvKAfra5zDg3woYMZeJWjRVaB5Dc1up_FA";

webpush.setVapidDetails("mailto:v.hudz@bbw-fi.de", publicVapidKey, privateVapidKey);

app.post('/subscribe', (req, res) => {
    const subscription = req.body;
    console.log(subscription)
    res.status(201).json({});
    console.log(2)
    const payload = JSON.stringify({ title: "Hello World", body: "This is your first push notification" });
    console.log(3)
    webpush.sendNotification(subscription, payload).catch(console.log);
    console.log(4)
})


function test() {
    const subscription = {
  endpoint: 'https://wns2-am3p.notify.windows.com/w/?token=BQYAAADd%2bSDxTpt6NZ0qUcAJtTlDY91IefnYCzJTaS9nCZIxO6JPicZhpm6bysf%2f00wkPzFA79L%2fxoaLHoRP7Scwd5jJ0xOKgxjLsnVbPTuJ9X2841cyZ7n3wkvX3nwiJLa58hatxDtrDOF7uQ%2foV8KxommBJQ9gRpfyEMLykGVzDcfsrk2PGhGr30TLrmaAgWdVvT%2bZ9NDTln7yrj0Qv%2bLA%2f6lP%2bDyrAA7hlG9IgiRnJGg8WDl13VpfGWeN%2fRSlQ%2bbyHt%2fPRjKgaUb3t0gIJaKU0pinYrZ3nZdGatQhQYVtBedy7HmrPFyIx4AvosOSz3fqrG%2f1SdmkPXreVzjquexch%2bqp',
  keys: {
    p256dh: 'BH_JtZ9vQQ8GhXCJCJFgIvZ9QdM8MdBTTHLiWOor_oManvdakmJDbF2WjObSS4a9eSnQRqXyCz2HpMWMBH-tqoY',
    auth: 'pl2IkPRCHFrwiDV04yVz7A'
  }
}
    console.log("Sent")
    const payload = JSON.stringify({ title: "Hello World", body: "This is your first push notification" });
    webpush.sendNotification(subscription, payload).catch(console.log);
}

app.get("/ping", (req, res) => {
    test();
    res.send(200)
})


const PORT = 5000;

app.listen(PORT, () => {
    console.log("Server started on port " + PORT);
})
