const { model, Schema } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 100,
      validate: {
        validator: function (value) {
          const alphabetRegex = /^[a-zA-Z]+$/;
          return alphabetRegex.test(value);
        },
        message: "Username must contain only alphabets.",
      },
    },
    email: {
        type: String,
        require: true,
        unique: true,
      },
    password: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const userModel = model("User", userSchema);

module.exports = userModel;