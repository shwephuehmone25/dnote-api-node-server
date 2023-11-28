const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());

const noteRoutes = require("./routes/note");

app.use(express.json());

app.use(noteRoutes);

mongoose
  .connect(process.env.MONGODB_URL)
  .then((res) => {
    app.listen(7000);
    console.log("Connected to mongodb!!!");
  })
  .catch((err) => console.log(err));

