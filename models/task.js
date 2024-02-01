// models/task.js

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId, // Links a task to a user
  description: String, // Description of the task
  createdAt: {
    type: Date,
    default: Date.now
  }, // Timestamp of when the task was created
});

module.exports = mongoose.model('Task', taskSchema);
