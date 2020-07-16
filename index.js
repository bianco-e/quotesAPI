const mongoose = require("mongoose");
const express = require("express");
const app = express();

mongoose.connect("mongodb://localhost:27017/quotes", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log(`Connected to '${db.name}' db`);
});

const quoteSchema = new mongoose.Schema(
  {
    quote: String,
    author: String,
    text: { name: String, link: String },
    subject: String,
    carrerYear: Number,
  },
  { collection: "comsocial", versionKey: false }
);
const Quote = mongoose.model("Quote", quoteSchema);

// Insert data in database
/*
const quoteToAdd = new Quote({
  quote: "asdasdasd quote asdasdasd quote",
  author: "me",
  text: { name: "meme", link: "http" },
  subject: "Me I",
  carrerYear: 1,
});
quoteToAdd.save((err, newquo) => {
  if (err) return console.log(err);
  console.log("Saved", newquo);
}); */

const getRandomNumber = (maxNum) => {
  return Math.floor(Math.random() * maxNum);
};

app.get("/newQuote", (req, res) => {
  Quote.countDocuments().exec((err, count) => {
    Quote.findOne()
      .skip(getRandomNumber(count))
      .exec((err, result) => {
        if (err) return console.log(err);
        res.setHeader("Access-Control-Allow-Origin", "*");
        const quote = result.quote;
        const author = result.author;
        res.json({ quote, author });
      });
  });
});

app.listen(5000, () => {
  console.log("On port 5000");
});
