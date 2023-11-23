const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());

const postRoutes = require("./routes/post");

app.use(express.json());

app.use(postRoutes);

const PORT = 7000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
