// Header.js

import React from "react";
import { Navbar, Button, Nav, Container } from "react-bootstrap";

/**
 * Header component that displays the application's name and conditional buttons for Register and Login.
 * @param {Function} onShowRegister Function to be called when the Register button is clicked.
 * @param {Function} onShowLogin Function to be called when the Login button is clicked.
 * @param {boolean} isAuthenticated Indicates whether the user is authenticated.
 * @param {Object} props Includes isAuthenticated, user, onShowRegister, onShowLogin, and onLogout functions and states.

 */

function Header({
  isAuthenticated,
  user,
  onShowRegister,
  onShowLogin,
  onLogout,
}) {
  console.log("Header props:", isAuthenticated, user);
  return (
    <Navbar bg="dark" expand="lg">
      <Container>
        <Navbar.Brand href="#home">THE TO-DO APP</Navbar.Brand>
        <Nav className="ml-auto">
          {!isAuthenticated ? (
            // Display Register and Login options if user is not authenticated
            <>
              <Button
                variant="outline-primary"
                onClick={onShowRegister}
                className="mr-2"
              >
                Register
              </Button>
              <Button variant="outline-success" onClick={onShowLogin}>
                Login
              </Button>
            </>
          ) : (
            // Display user's username and Logout option if user is authenticated
            <>
              <Navbar.Text className="mr-2">
                Welcome, {user?.username}!
              </Navbar.Text>
              <Button variant="outline-danger" onClick={onLogout}>
                Logout
              </Button>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Header;
