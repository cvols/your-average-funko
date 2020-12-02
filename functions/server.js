const admin = require('firebase-admin');
const serviceAccount = require('./permissions.json');
const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');

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

(async () => {
  // const browser = await puppeteer.launch({
  //   headless: false,
  //   defaultViewport: null
  // });

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const url = 'https://www.cardboardconnection.com/brand/funko/funko-pop';
  await page.goto(url, {
    waitUntil: 'domcontentloaded'
  });
  await page.waitForSelector('.product-subtitle');

  // const results = await page.evaluate(() => {
  //   const urlSelector = document.querySelectorAll('.product-subtitle a');
  //   const urls = [...urlSelector];
  //   return urls.map(url => url.innerHTML);
  // });

  // results.map(async result => {
  //   console.log('result: ', result);
  // });

  await page.$$eval('.product-subtitle a', links => {
    return links.forEach(async link => {
      link.click();

      const [el] = await page.$x(
        '//*[@id="post-main-121693"]/div[1]/div[1]/h1'
      );
      const txt = await el.getProperty('textContent');
      const rawText = await txt.jsonValue();
      console.log('rawText: ', rawText);
    });
  });

  // await page.evaluate(() => {
  //   const elements = document.querySelectorAll('.product-subtitle a');
  //   for (let element of elements) {
  //     element.click();
  //   }
  // });

  // const [el] = await page.$x('//*[@id="productListing"]/div[1]/div[2]/h2/a');
  // const href = await el.getProperty('href');

  // console.log('href: ', href);

  // click works
  // const href = await page.$('.product-subtitle a');
  // await href.evaluate(ref => ref.click());

  await browser.close();
})();

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
