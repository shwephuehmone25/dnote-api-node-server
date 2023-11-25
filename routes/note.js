const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

/**import controllers*/
const noteController = require("../controllers/note");

//GET/notes
router.get(noteController.getAllNotes);

//POST/note
router.post(
  ["/create/note", "/notes"],
  [
    body("title")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Title is too short")
      .isLength({ max: 30 })
      .withMessage("Title is too long"),
    body("content")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Content is too short"),
  ],
  noteController.createNote
);

module.exports = router;
