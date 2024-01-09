const { validationResult } = require("express-validator");
const fs = require("fs");

/**models import*/
const Note = require("../models/note");
const { unlink } = require("../utils/unlink");

//GET/notes
exports.getAllNotes = (req, res, next) => {
  /**pagination*/
  const currentPage = req.query.page || 1;
  const perPage = 6;
  let totalNotes;
  let totalPages;

  Note.find()
    .countDocuments()
    .then((counts) => {
      totalNotes = counts;
      totalPages = Math.ceil(totalNotes / perPage);
      return Note.find()
        .sort({ createdAt: -1 })
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then((notes) => {
      return res.status(200).json({notes, totalNotes, totalPages});
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
  const image = req.file;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errorMessage: errors.array(),
    });
  }
  // console.log("req.userId:", req.userId);
  Note.create({
    title,
    content,
    image: image ? image.path : "",
    author: req.userId,
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
  const image = req.file;

  Note.findById(id)
    .then((note) => {
      if (!note) {
        //console.log("Note not found for ID:", id);
        return res.status(404).json({ message: "Note not found." });
      }

      note.title = req.body.title;
      note.content = req.body.content;

      if (image) {
        unlink(note.image);
        note.image = image.path;
      }
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
  const { id } = req.params;

  try {
    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }

    const imagePath = note.image;

    const unlinkFile = async () => {
      if (fs.existsSync(imagePath)) {
        await fs.promises.unlink(imagePath);
      }
    };

    await unlinkFile();
    await Note.findByIdAndDelete(id);

    return res.status(204).json({
      message: "Note is deleted.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal server error. Check server logs for details.",
      error: err.message,
    });
  }
};
