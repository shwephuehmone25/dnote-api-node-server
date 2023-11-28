const { validationResult } = require("express-validator");

/**models import*/
const Note = require("../models/note");

//GET/notes
exports.getAllNotes = (req, res, next) => {
  Note.find()
    .sort({
      createdAt: -1,
    })
    .then((notes) => {
      return res.status(200).json(notes);
    })
    .catch((err) => {
      res.status(404).json({
        message: "No Posts Here!",
      });
      console.log(err);
    });
};

//POST/note
exports.createNote = (req, res, next) => {
  const { title, content } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errorMessage: errors.array(),
    });
  }
  Note.create({
    title,
    content,
  })
    .then((_) => {
      res.status(201).json({
        message: "Note is created successfully",
        data: {
          title,
          content,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({
        message: "Something went wrong!",
      });
    });
};

//GET/notes/:id
exports.getNoteDetails = (req, res, next) => {
  const { id } = req.params;
  Note.findById(id)
    .populate("author", "username")
    .then((note) => {
      return res.status(200).json(note);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({
        message: "Something went wrong.",
      });
    });
};

//GET/edit/:id
exports.getOldNote = (req, res, next) => {
  const { id } = req.params;
  Note.findById(id)
    .then((note) => {
      return res.status(200).json(note);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({
        message: "Something went wrong.",
      });
    });
};

//POST/edit
exports.updateNote = (req, res, next) => {
  const { id } = req.params;

  Note.findById(id)
    .then((note) => {
      if (!note) {
        //console.log("Note not found for ID:", id);
        return res.status(404).json({ message: "Note not found." });
      }

      note.title = req.body.title;
      note.content = req.body.content;
      return note.save();
    })
    .then((updatedNote) => {
      //console.log("Note updated successfully:", updatedNote);
      res
        .status(200)
        .json({ message: "Note is updated successfully.", updatedNote });
    })
    .catch((err) => {
      //console.error("Error updating note:", err);
      res.status(500).json({ message: "Something went wrong." });
    });
};

//DELETE/notes/:id
exports.deleteNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedNote = await Note.findByIdAndDelete(id);

    if (!deletedNote) {
      return res.status(404).json({
        message: "Note not found.",
      });
    }

    return res.status(204).json({
      message: "Note is deleted successfully.",
    });
  } catch (err) {
    console.error("Error in delete Note:", err);

    return res.status(500).json({
      message: "Internal server error. Check server logs for details.",
      error: err.message,
    });
  }
};
