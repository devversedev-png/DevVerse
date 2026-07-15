import "./Contact.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaArrowRight
} from "react-icons/fa";

function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <main className="contact-page">

        {/* HERO */}

        <section className="contact-hero">
          <span className="contact-label">GET IN TOUCH</span>

          <h1>
            Let's Turn Your Idea
            <br />
            Into <span>Something Amazing.</span>
          </h1>

          <p>
            Have a project in mind or simply want to discuss an idea?
            Tell us what you're thinking and let's explore how we can
            build it together.
          </p>
        </section>

        {/* CONTACT SECTION */}

        <section className="contact-main">

          {/* LEFT SIDE */}

          <div className="contact-info">

            <span className="contact-small-label">
              START A CONVERSATION
            </span>

            <h2>
              We'd Love To
              <br />
              <span>Hear From You.</span>
            </h2>

            <p className="contact-description">
              Whether you need a website, mobile application,
              e-commerce platform or custom software solution,
              send us a message and we'll get back to you.
            </p>

            <div className="contact-details">

              <div className="contact-detail-card">
                <div className="contact-detail-icon">
                  <FaEnvelope />
                </div>

                <div>
                  <span>Email Us</span>
                  <p>devverse.dev@gmail.com</p>
                </div>
              </div>

              <div className="contact-detail-card">
                <div className="contact-detail-icon">
                  <FaPhoneAlt />
                </div>

                <div>
                  <span>Call Us</span>
                  <p>Let's connect and discuss your idea</p>
                </div>
              </div>

              <div className="contact-detail-card">
                <div className="contact-detail-icon">
                  <FaMapMarkerAlt />
                </div>

                <div>
                  <span>Based In</span>
                  <p>Chennai, Tamil Nadu, India</p>
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT SIDE - FORM */}

          <div className="contact-form-wrapper">

            <div className="contact-form-glow"></div>

            <form
              className="contact-form"
              onSubmit={handleSubmit}
            >

              <div className="contact-form-header">
                <span>TELL US ABOUT YOUR PROJECT</span>

                <h3>Start Your Project</h3>

                <p>
                  Fill in the details below and we'll connect
                  with you to discuss your requirements.
                </p>
              </div>

              <div className="contact-form-row">

                <div className="contact-input-group">
                  <label>Your Name</label>

                  <input
                    type="text"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="contact-input-group">
                  <label>Email Address</label>

                  <input
                    type="email"
                    placeholder="Enter your email"
                    required
                  />
                </div>

              </div>

              <div className="contact-form-row">

                <div className="contact-input-group">
                  <label>Phone Number</label>

                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="contact-input-group">
                  <label>Project Type</label>

                  <select defaultValue="">
                    <option value="" disabled>
                      Select a service
                    </option>

                    <option>Website Development</option>
                    <option>Mobile Application</option>
                    <option>E-Commerce Platform</option>
                    <option>Custom Software</option>
                    <option>UI / UX Design</option>
                    <option>Other</option>
                  </select>
                </div>

              </div>

              <div className="contact-input-group">
                <label>Project Budget</label>

                <select defaultValue="">
                  <option value="" disabled>
                    Select your budget range
                  </option>

                  <option>Let's Discuss</option>
                  <option>₹10,000 - ₹25,000</option>
                  <option>₹25,000 - ₹50,000</option>
                  <option>₹50,000 - ₹1,00,000</option>
                  <option>₹1,00,000+</option>
                </select>
              </div>

              <div className="contact-input-group">
                <label>Tell Us About Your Project</label>

                <textarea
                  rows="6"
                  placeholder="Tell us about your idea, requirements and what you're looking to build..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="contact-submit-button"
              >
                Send Message
                <FaPaperPlane />
              </button>

            </form>

          </div>

        </section>

        {/* QUICK CTA */}

        <section className="contact-bottom-cta">

          <div>
            <span>NOT SURE WHERE TO START?</span>

            <h2>
              That's Okay.
              <span> Let's Talk About It.</span>
            </h2>

            <p>
              You don't need to have everything figured out.
              Share your idea with us and we'll help you understand
              the best way to move forward.
            </p>
          </div>

          <button
            onClick={() => navigate("/chat")}
          >
            Start A Conversation
            <FaArrowRight />
          </button>

        </section>

      </main>

      <Footer />
    </>
  );
}

export default Contact;