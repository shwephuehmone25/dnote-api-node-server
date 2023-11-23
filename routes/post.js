const express = require("express");
const bodyParser = require("body-parser");

const router = express.Router();

/**import controllers*/
const postController = require("../controllers/post");

//GET/posts
router.get("/posts", postController.getAllPost);

//POST/posts
router.post("/create/post", postController.createPost);

module.exports = router;