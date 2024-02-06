// server.js

require("dotenv").config(); // Loads environment variables from a .env file into process.env
const express = require("express"); // Express framework to simplify handling of HTTP requests
const cors = require("cors"); // Middleware to enable CORS (Cross-Origin Resource Sharing)
const jwt = require("jsonwebtoken"); // Library to work with JSON Web Tokens for authentication
const bcrypt = require("bcryptjs"); // Library for hashing and salting user passwords
const bodyParser = require("body-parser"); // Middleware to parse incoming request bodies
const mongoose = require("mongoose"); // ODM (Object Data Modeling) library for MongoDB and Node.js
const User = require("./models/user"); // Model for user, used for registering and authenticating users
const Task = require("./models/task"); // Model for tasks, represents tasks in the database
const app = express(); // Create an Express application
const port = 5008; // Define the port the server will run on

// Connect to MongoDB using the connection URI stored in the environment variable
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.error("Could not connect to MongoDB:", err));

app.use(cors()); // Use CORS middleware to allow cross-origin requests
app.use(bodyParser.json()); // Use bodyParser middleware to parse JSON bodies of incoming requests

// A simple route to confirm the server is working
app.get("/", (req, res) => {
  res.send("Welcome to the Todo App Backend!");
});

// Middleware to reject non-gmail users
const checkGmailUser = (req, res, next) => {
  if (!req.body.email.endsWith("@gmail.com")) {
    return res
      .status(403)
      .send("Access denied. Only @gmail.com users are allowed.");
  }
  next(); // Call next() to pass control to the next middleware function
};

// Define route for user registration with email validation
app.post("/register", checkGmailUser, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10); // Hash the password with bcrypt
    const user = new User({
      // Create a new user with the provided username, email, and hashed password
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    await user.save(); // Save the user to the database
    res.status(201).send("User created"); // Respond with success message
  } catch (error) {
    // Catch and log any errors
    console.error(error);
    res.status(500).send("Error registering new user");
  }
});

// Define route for user login
app.post("/login", async (req, res) => {
  const { username, password } = req.body; // Destructure username and password from request body
  const user = await User.findOne({ username }); // Find the user by username
  if (user && (await bcrypt.compare(password, user.password))) {
    // Check if user exists and password is correct
    // Generate a JWT token for the user
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    res.json({ token }); // Send the token to the client
  } else {
    res.status(401).send("Username or password is incorrect");
  }
});

// Middleware to verify JWT tokens
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization; // Get the Authorization header
  const token = authHeader && authHeader.split(" ")[1]; // Extract the token
  if (token == null) {
    return res.sendStatus(401); // No token, unauthorized
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Token verification failed
    }
    req.user = user; // Add the user payload to the request
    next(); // Proceed to the next middleware or route handler
  });
};

// Middleware to reject tasks exceeding 140 charcters
const checkTaskLength = (req, res, next) => {
  if (req.body.description && req.body.description.length > 140) {
    return res
      .status(403)
      .send("Task description cannot exceed 140 characters.");
  }
  next();
};

// Middleware to check non-JSON content types
const checkJsonContentType = (req, res, next) => {
  if (req.headers["content-type"] !== "application/json") {
    return res
      .status(403)
      .send("Server only accepts application/json content type.");
  }
  next();
};

// Define route to add a new task, secured with JWT authentication
app.post(
  "/tasks",
  authenticateToken,
  checkJsonContentType,
  checkTaskLength,
  (req, res) => {
    const task = new Task({
      userId: req.user.id, // Use userId from JWT payload
      header: req.body.header,
      description: req.body.description,
    });
    task
      .save() // Save the new task to the database
      .then((result) => res.status(201).json(result))
      .catch((err) => res.status(400).send(err.message));
  }
);

// Route to edit an existing task, secured with JWT
app.put("/tasks/:taskId", authenticateToken, (req, res) => {
  const { taskId } = req.params; // Get taskId from URL parameters
  const { header, description } = req.body; // Get updated header and description from request body
  Task.findByIdAndUpdate(taskId, { header, description }, { new: true }) // Update the task
    .then((updatedTask) => {
      if (!updatedTask) {
        return res.status(404).send("Task not found");
      }
      res.json(updatedTask); // Respond with the updated task
    })
    .catch((err) => res.status(400).send(err.message));
});

// Route to delete a task, secured with JWT
app.delete("/tasks/:taskId", authenticateToken, (req, res) => {
  const { taskId } = req.params;
  Task.findByIdAndDelete(taskId)
    .then((deletedTask) => {
      if (!deletedTask) {
        return res.status(404).send("Task not found");
      }
      res.status(200).send(`Task with id ${taskId} deleted`);
    })
    .catch((err) => res.status(400).send(err.message));
});

// Route to get all tasks for the logged-in user
app.get("/tasks", authenticateToken, (req, res) => {
  Task.find({ userId: req.user.id }) // Find all tasks associated with the user
    .then((tasks) => {
      res.json(tasks); // Send all tasks associated with the user
    })
    .catch((err) => {
      console.error("Error fetching tasks:", err);
      res.status(500).send(err.message);
    });
});

// Listen on the configured port
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
