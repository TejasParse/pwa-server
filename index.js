// server.js
const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require("cors");

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const publicVapidKey = process.env.VAPID_PUBLIC_KEY;
const privateVapidKey = process.env.VAPID_PRIVATE_KEY;
const subjectMail = process.env.VAPID_SUBJECT
webpush.setVapidDetails(subjectMail, publicVapidKey, privateVapidKey);

let subscriptions = [];

app.post('/subscribe', (req, res) => {
    console.log(req.body, "Okay now subscribe?");
    const subscription = req.body;
    subscriptions.push(subscription);
    res.status(201).json({});
});

app.post('/sendNotification', (req, res) => {
    console.log(req.body, "Okay now send notification?");
    const { title, body } = req.body;
    const payload = JSON.stringify({ title, body });

    subscriptions.forEach(subscription => {
        webpush.sendNotification(subscription, payload).catch(error => console.error(error));
    });

    console.log("\n\n", "This is the length of subscriptions array", subscriptions.length);

    res.status(200).json(subscriptions);
});

app.get("/", (req,res)=> {

    return res.status(200).json({
        message: "This is my world and you are living in it"
    })

})

const port = 3000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
