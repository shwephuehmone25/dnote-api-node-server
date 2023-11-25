const { validationResult } = require("express-validator");

exports.getAllNotes = (req, res, next) => {};

exports.createNote = (req, res, next) => {
  const { title, content } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errorMessage: errors.array(),
    });
  }

  return res.status(201).json({
    message: "Note is created successfully",
    data: {
      title,
      content,
    },
  });
};
