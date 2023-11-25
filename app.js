const express = require("express");
const moongose = require("mongoose");
const dotenv = require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());

const noteRoutes = require("./routes/note");

app.use(express.json());

app.use(noteRoutes);

moongose
  .connect(process.env.MONGODB_URL)
  .then((res) => {
    app.listen(4000);
    console.log("Connected to mongodb!!!");
  })
  .catch((err) => console.log(err));

