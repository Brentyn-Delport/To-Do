// server.js

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const User = require('./models/user');
const bcrypt = require('bcryptjs');
const Task = require('./models/task');
const jwt = require('jsonwebtoken');
const port = 5008; // Different from React's default port 3000
require('dotenv').config(); // Using environment variable to store password

// MongoDB connection setup
const mongoose = require('mongoose');
require('dotenv').config();


mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to Database'))
  .catch(err => console.error('Could not connect to MongoDB', err));


// Middleware for parsing JSON requests
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Welcome to the Todo App Backend!');
});

// User Registration
app.post('/register', async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = new User({
        username: req.body.username,
        password: hashedPassword
      });
      await user.save();
      res.status(201).send('User created');
    } catch {
      res.status(500).send();
    }
  });

  // User Login
  app.post('/login', async (req, res) => {
    console.log("Login Attempt:", req.body.username); // Debugging line
    const user = await User.findOne({ username: req.body.username });
    console.log("User found:", user); // Debugging line
    if (user && await bcrypt.compare(req.body.password, user.password)) {
      const token = jwt.sign({ username: user.username, _id: user._id }, process.env.JWT_SECRET);
      res.json({ token });
    } else {
      res.status(401).send('Unauthorized');
    }
  });
  
  
  
  // Middleware to check if the user's email ends with '@gmail.com'
const checkGmailUser = (req, res, next) => {
    if (req.user.username.endsWith('@gmail.com')) {
      next();
    } else {
      res.status(403).send('Access denied');
    }
  };
  
  // Middleware to check the length of the task
  const checkTaskLength = (req, res, next) => {
    if (req.body.description && req.body.description.length <= 140) {
      next();
    } else {
      res.status(403).send('Task exceeds 140 characters');
    }
  };
  
  
  // Middleware to check if the request is JSON
  const checkJsonContentType = (req, res, next) => {
    if (req.is('json')) {
      next();
    } else {
      res.status(403).send('Invalid content type');
    }
  };

  // Middleware to authenticate JWT and set req.user
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) return res.sendStatus(401);
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };
  
  // POST route to add a new task
  app.post('/tasks', authenticateToken, checkJsonContentType, checkGmailUser, (req, res) => {
    const task = new Task({
      userId: req.user._id,
      description: req.body.description
    });
    task.save()
      .then(result => res.status(201).send(result))
      .catch(err => res.status(400).send(err.message));
  });
  
  // GET route to read all tasks for a user
  app.get('/tasks', authenticateToken, (req, res) => {
    Task.find({ userId: req.user._id })
      .then(tasks => res.send(tasks))
      .catch(err => res.status(500).send(err.message));
  });
  
  // PUT route to update a task
  app.put('/tasks/:taskId', authenticateToken, checkTaskLength, (req, res) => {
    Task.findByIdAndUpdate(req.params.taskId, { description: req.body.description }, { new: true })
      .then(updatedTask => res.send(updatedTask))
      .catch(err => res.status(400).send(err.message));
  });
  
  // DELETE route to delete a task
  app.delete('/tasks/:taskId', authenticateToken, (req, res) => {
    Task.findByIdAndDelete(req.params.taskId)
      .then(() => res.send("Task deleted"))
      .catch(err => res.status(500).send(err.message));
  });
  

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
