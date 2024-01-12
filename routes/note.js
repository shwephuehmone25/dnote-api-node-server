const express = require("express");
const { body } = require("express-validator");

const router = express.Router();
const authMiddleware = require("../middlewares/is-auth");

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
  authMiddleware,
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

//GET/edit/:id
router.get("/edit/:id", authMiddleware, noteController.getOldNote);

//PUT/edit
router.put("/edit/:id", authMiddleware, noteController.updateNote);

//DELETE/note/:id
router.delete("/delete/note/:id", authMiddleware, noteController.deleteNote);

module.exports = router;
