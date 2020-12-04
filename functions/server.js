const admin = require("firebase-admin");
const serviceAccount = require("./firebase/access.json");
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const puppeteer = require("puppeteer");

const app = express();
app.use(cors({ origin: true }));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://youraveragefunko-2a93b.firebaseio.com",
});
const db = admin.firestore();

app.get("/hello-world", (req, res) => {
  return res.status(200).send("Hello World!");
});

(async () => {
  let theOfficeUrl =
    "https://www.cardboardconnection.com/funko-pop-the-office-vinyl-figures";

  let browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
  });
  let page = await browser.newPage();

  await page.goto(theOfficeUrl), { waitUntil: "networkidle2" };

  let data = await page.evaluate(() => {
    var image = Array.from(
      document.querySelectorAll("div.post_anchor_divs.gallery img")
    ).map((image) => image.src);

    // gives us an array off all h3 titles on page
    var title = Array.from(document.querySelectorAll("h3")).map(
      (title) => title.innerText
    );
    let forDeletion = ["", "Leave a Comment:"];
    title = title.filter((item) => !forDeletion.includes(item));

    return {
      image,
      title,
    };
  });
  console.log("Running Scrapper...");
  console.log({ data });
  console.log("======================");
})();

// create
// app.post("/api/create", (req, res) => {
//   (async () => {
//     try {
//       await db
//         .collection("items")
//         .doc("/" + req.body.id + "/")
//         .create({ item: req.body.item });
//       return res.status(200).send({
//         id: req.body.id,
//         item: req.body.item,
//       });
//     } catch (error) {
//       console.log(error);
//       return res.status(500).send(error);
//     }
//   })();
// });

exports.app = functions.https.onRequest(app);
