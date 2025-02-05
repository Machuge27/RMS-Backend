// AboutUs.js
import React from "react";
import "../../css/boxes/Us.css"; // For styling the component
import logo from "../../assets/Logo002.jpg"; // Add your logo here

const AboutUs = () => {
  return (
    <div className="about-us-page">
      {/* Header Section */}
      <header className="header">
        <img src={logo} alt="Soltech Logo" className="logo" />
        <h1>Welcome to Soltech</h1>
      </header>

      {/* About Us Section */}
      <section className="about-section">
        <h2>About Us</h2>
        <p>
          At Soltech, we specialize in building state-of-the-art websites and
          software tailored to your needs. Our mission is to empower businesses
          with innovative and efficient solutions that drive growth and success.
        </p>
      </section>

      {/* Social Media Links */}
      <section className="social-links">
        <h2>Connect With Us</h2>
        <ul>
          <li>
            <a href="http://soltechssolutions.com" target="_blank" rel="noopener noreferrer">
              Official website <span>|</span>
            </a>
          </li>
          <li>
            <a href="https://facebook.com/soltech" target="_blank" rel="noopener noreferrer">
              Facebook <span>|</span>
            </a>
          </li>
          <li>
            <a href="https://twitter.com/soltech" target="_blank" rel="noopener noreferrer">
              Twitter <span>|</span>
            </a>
          </li>
          <li>
            <a href="https://linkedin.com/company/soltech" target="_blank" rel="noopener noreferrer">
              LinkedIn 
            </a>
          </li>
        </ul>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Soltech. All rights reserved.</p>
        <a href="/privacy-policy">Privacy Policy</a>
      </footer>
    </div>
  );
};

export default AboutUs;
