import "./CTA.css";
import { FaArrowRight, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function CTA() {

  const navigate = useNavigate();

  return (
    <section className="cta">

      <div className="cta-glow"></div>

      <div className="cta-container">

        <div className="cta-left">

          <span className="cta-tag">
            LET'S BUILD SOMETHING AMAZING
          </span>

          <h2>

            Have An Idea?

            <br />

            Let's Turn It Into

            <span> Reality.</span>

          </h2>

          <p>

            Whether you need a stunning website,
            mobile application, ecommerce platform,
            or custom software solution,
            DevVerse is ready to bring your vision
            to life.

          </p>

          <div className="cta-buttons">
            <button
              className="cta-primary"
              onClick={() => navigate("/chat")}
            >
              Start Your Project
              <FaArrowRight />
            </button>

            <Link to="/services" className="cta-secondary">
              View Services
            </Link>
          </div>
        </div>

        <div className="cta-right">

          <div className="contact-card">

            <div className="contact-icon">

              <FaPhoneAlt />

            </div>

            <div>

              <h4>Call Us</h4>

              <p>+91 XXXXX XXXXX</p>

            </div>

          </div>

          <div className="contact-card">

            <div className="contact-icon">

              <FaEnvelope />

            </div>

            <div>

              <h4>Email Us</h4>

              <p>contact@devverse.in</p>

            </div>

          </div>

          <div className="mini-card">

            <h3>

              🚀 Ready to Launch?

            </h3>

            <p>

              We help startups and businesses
              create digital products that
              stand out.

            </p>

          </div>

        </div>

      </div>

    </section>
  );
}

export default CTA;