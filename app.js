const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const dotenv = require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

/**configuration for storage in multer*/
const storageConfiguration = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    const suffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, suffix + "-" + file.originalname);
  },
});

/**configuration for file in multer*/
const filterConfigure = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, undefined);
  }
};

app.use(cors());

app.use("/images", express.static(path.join(__dirname, "images")));

app.use(
  multer({
    storage: storageConfiguration,
    fileFilter: filterConfigure,
  }).single("image")
);

const noteRoutes = require("./routes/note");
const authRoutes = require("./routes/auth");

app.use(express.json());

app.use(noteRoutes);
app.use(authRoutes);

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    app.listen(7000);
    console.log("Connected to MongoDB!!!");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
