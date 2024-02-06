// Login.js

import React, { useState } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";

/**
 * Handles user login, including form submission and updating the parent component
 * on successful authentication.
 *
 * @param {Function} onLogin Callback function for successful login, passing token and username.
 */

function Login({ onLogin }) {
  const [username, setUsername] = useState(""); // State for username
  const [password, setPassword] = useState(""); // State for password

  // Handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      // Post request to login endpoint
      const response = await axios.post("http://localhost:5008/login", {
        username,
        password,
      });
      onLogin(response.data.token, username); // Invoke callback with token and username
    } catch (error) {
      alert("Login failed!"); // Provide feedback on failure
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Login
      </Button>
    </Form>
  );
}

export default Login;
