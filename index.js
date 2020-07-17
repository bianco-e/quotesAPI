const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const Quote = require("./model");
const jsonParser = bodyParser.json();

mongoose.connect("mongodb://localhost:27017/quotes", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log(`Connected to '${db.name}' db`);
});

app.use(cors());

const getRandomNumber = (maxNum) => {
  return Math.floor(Math.random() * maxNum);
};

app.get("/newQuote", (req, res) => {
  Quote.countDocuments().exec((err, count) => {
    Quote.findOne()
      .skip(getRandomNumber(count))
      .exec((err, result) => {
        if (err) return console.log(err);
        res.json(result);
      });
  });
});

app.post("/addQuote", jsonParser, (req, res) => {
  const newQuote = new Quote(req.body);
  console.log(req.body);
  newQuote.save((err, addedQuote) => {
    if (err) return console.log(err);
    console.log("Added", addedQuote);
    res.statusCode = 200;
    res.end();
  });
});

app.listen(5000, () => {
  console.log("On port 5000");
});
