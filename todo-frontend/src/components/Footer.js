// Footer.js
import React from "react";
import { Container } from "react-bootstrap";

/**
 * Footer component displaying the company name and copyright notice.
 */
function Footer() {
  return (
    <Container className="mt-4 mb-4 text-center">
      {/* Company name and copyright notice */}
      <span>Brentyn Design © {new Date().getFullYear()}</span>
    </Container>
  );
}

export default Footer;
