// models/user.js

const mongoose = require("mongoose");

// Define a schema for the User model.
const userSchema = new mongoose.Schema({
  // username is a field of type String.
  username: String,

  // Every User document must have an email value, and attempting to save a User without an email will throw a validation error.
  email: { type: String, required: true },

  // password is a field of type String.
  password: String,
});

// Effectively allows us to interact with the 'users' collection in the database using the defined schema.
module.exports = mongoose.model("User", userSchema);
