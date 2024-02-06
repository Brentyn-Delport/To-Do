// models/task.js

// Import the mongoose library, which is a MongoDB object modeling tool designed to work in an asynchronous environment.
const mongoose = require("mongoose");

// Define a schema for the Task model.
const taskSchema = new mongoose.Schema({
  // userId is the field that stores a reference to a User model's ObjectId.
  // The ref option tells Mongoose which model to use during population,
  // allowing us to easily fetch the User details associated with a given Task.
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  // header is a field of type String that will store the task's title.
  header: String,

  // description is a field of type String for storing a more detailed explanation of what the task involves.
  description: String,
});

// Compile the taskSchema into a Model and export it.
// In this case, each document will be a Task with properties and behaviors as declared in the schema.
module.exports = mongoose.model("Task", taskSchema);
