// App.js

import "./App.css"; // Stylesheet for styling
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap for UI components
import React, { useState } from "react"; // React library
// Importing custom components for different parts of the application
import Login from "./components/Login";
import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";
import Register from "./components/Register";
import { Modal, Button, Alert } from "react-bootstrap"; // Bootstrap components

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State to manage authentication status
  const [showRegister, setShowRegister] = useState(false); // State to manage visibility of the Register modal
  const [showLogin, setShowLogin] = useState(false); // State to manage visibility of the Login modal
  const [user, setUser] = useState(null); // New state to store user info
  const [showRegistrationSuccess, setShowRegistrationSuccess] = useState(false); // New state for registration success message

  // Function to toggle the registration modal
  const handleShowRegister = () => setShowRegister(true);
  const handleCloseRegister = () => setShowRegister(false);

  // Function to toggle the login modal
  const handleShowLogin = () => setShowLogin(true);
  const handleCloseLogin = () => setShowLogin(false);

  // Function to handle user authentication status
  const handleAuthentication = (token) => {
    if (token) {
      setIsAuthenticated(true);
      handleCloseLogin(); // Close login modal upon successful login
    }
  };

  // Handles successful registration
  const handleRegisterSuccess = (username) => {
    setShowRegister(false);
    setShowRegistrationSuccess(true); // Show registration success message
    setUser({ username }); // Temporarily save username to display in the alert

    // Automatically dismiss the message after 5 seconds
    setTimeout(() => {
      setShowRegistrationSuccess(false);
    }, 5000);
  };

  // Handles user login, setting the token in local storage and updating user state
  const handleLogin = (token, username) => {
    console.log("Login token:", token); // Confirm token is received
    console.log("Login username:", username); // Confirm username is received and correct
    localStorage.setItem("token", token); // Store the token
    setIsAuthenticated(true);
    setShowLogin(false);
    setUser({ username }); // Here, confirm username is what you expect
    console.log("User after login:", { username }); // Check the user object after setting it
  };

  // Handles user logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null); // Clear user info on logout
  };

  // The main render method for the app component
  return (
    <div className="App">
      <Header
        isAuthenticated={isAuthenticated}
        user={user}
        onShowRegister={handleShowRegister}
        onShowLogin={handleShowLogin}
        onLogout={handleLogout}
      />

      {/* Main component is passed isAuthenticated and user props for conditional rendering */}
      <Main isAuthenticated={isAuthenticated} user={user} />
      <Footer />

      {/* Registration Modal */}
      <Modal show={showRegister} onHide={() => setShowRegister(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Register</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Register component is passed a callback for successful registration */}
          <Register onRegisterSuccess={handleRegisterSuccess} />
        </Modal.Body>
      </Modal>

      {/* Registration Success Alert */}
      {showRegistrationSuccess && (
        <Alert
          variant="success"
          onClose={() => setShowRegistrationSuccess(false)}
          dismissible
        >
          <Alert.Heading>
            Welcome, {user.username}, you are now registered! Please login.
          </Alert.Heading>
          <Button variant="outline-success" onClick={() => setShowLogin(true)}>
            Login
          </Button>
        </Alert>
      )}

      {/* Login Modal */}
      <Modal show={showLogin} onHide={() => setShowLogin(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Login onLogin={handleLogin} />
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default App;
