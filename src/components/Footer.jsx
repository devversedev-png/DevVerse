import "./Footer.css";
import logo from "../assets/devverse-logo.png";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaGithub,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-about">

          <img src={logo} alt="DevVerse" />

          <p>
            We build modern websites, mobile applications,
            software solutions and digital products for
            startups, businesses and enterprises.
          </p>

          <div className="socials">

            <a
              href="https://www.linkedin.com/in/dev-verse-dev/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="DevVerse LinkedIn"
            >
              <FaLinkedinIn />
            </a>

            <a
              href="https://www.instagram.com/dev_verse.dev/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="DevVerse Instagram"
            >
              <FaInstagram />
            </a>

            <a
              href="https://github.com/devversedev-png"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="DevVerse GitHub"
            >
              <FaGithub />
            </a>

          </div>

        </div>

        <div>

          <h3>Quick Links</h3>

          <Link to="/">Home</Link>

          <Link to="/services">Services</Link>

          <Link to="/portfolio">Portfolio</Link>

          <Link to="/process">Process</Link>

          <Link to="/about">About Us</Link>

          <Link to="/contact">Contact</Link>

        </div>

        <div>

          <h3>Services</h3>

          <a>Mobile Apps</a>

          <a>E-Commerce</a>

          <a>Software Development</a>

          <a>Web Development</a>

          <a>Cloud Solutions</a>

          <a>UI/UX Design</a>

        </div>

        <div>

          <h3>Contact Info</h3>

          <p>
            <FaEnvelope className="footer-contact-icon" aria-hidden="true" />{" "}
            <a href="mailto:devverse.dev@gmail.com">
              devverse.dev@gmail.com
            </a>
          </p>

          <p>
            <FaPhoneAlt className="footer-contact-icon" aria-hidden="true" />{" "}
            <a
              href="tel:+918144104500"
              aria-label="Call DevVerse"
            >
              +91 81441 04500
            </a>
          </p>

          <p>
            <FaMapMarkerAlt className="footer-contact-icon" aria-hidden="true" />{" "}
            Chennai, Tamil Nadu
          </p>

        </div>

      </div>

      <div className="copyright">
        © 2026 DevVerse. All Rights Reserved.
      </div>

    </footer>
  );
}

export default Footer;