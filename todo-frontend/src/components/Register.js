// Register.js

import React, { useState } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";

/**
 * Handles user registration including form submission, input validation,
 * and communicating registration success back to the parent component.
 *
 * @param {Function} onRegisterSuccess Callback function for successful registration.
 */

function Register({ onRegisterSuccess }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Ensure validation checks the `email` variable
    if (!email.endsWith("@gmail.com")) {
      alert("Email must end with @gmail.com");
      return;
    }

    // Password strength validation
    if (
      password.length < 6 ||
      !/\d/.test(password) ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[!@#$%^&*]/.test(password)
    ) {
      alert(
        "Password must be longer than 6 digits, contain one digit (0-9), contain an upper and lowecase letter and a special charact (!@#$)"
      );
      return;
    }

    try {
      // Axios post request
      await axios.post("http://localhost:5008/register", {
        username,
        email,
        password,
      });
      onRegisterSuccess(username); // Pass username on successful registration
    } catch (error) {
      alert("Registration failed!");
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        Submit
      </Button>
    </Form>
  );
}

export default Register;
