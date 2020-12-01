const admin = require('firebase-admin');
const serviceAccount = require('./permissions.json');
const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({ origin: true }));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://youraveragefunko-2a93b.firebaseio.com'
});
const db = admin.firestore();

app.get('/hello-world', (req, res) => {
  return res.status(200).send('Hello World!');
});

// create
app.post('/api/create', (req, res) => {
  (async () => {
    try {
      await db
        .collection('items')
        .doc('/' + req.body.id + '/')
        .create({ item: req.body.item });
      return res.status(200).send({
        id: req.body.id,
        item: req.body.item
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

exports.app = functions.https.onRequest(app);
