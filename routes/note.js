const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

/**import controllers*/
const noteController = require("../controllers/note");

router.get("/", (req, res) => {
  res.send("Welcome from DNOTE");
});

//GET/notes
router.get("/notes", noteController.getAllNotes);

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

//GET/notes/:id
router.get("/notes/:id", noteController.getNoteDetails);

//DELETE/note/:id
router.delete("/delete/note/:id", noteController.deleteNote);

module.exports = router;
