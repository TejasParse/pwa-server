// server.js
const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
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

    res.status(200).json({});
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
