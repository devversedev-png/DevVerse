import "./Hero.css";
import logo from "../../assets/devverse-logo.png";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Hero() {

  const navigate = useNavigate();

  return (
    <section className="hero">

      {/* Background Glow */}
      <div className="hero-blur hero-blur-1"></div>
      <div className="hero-blur hero-blur-2"></div>
      <div className="hero-grid"></div>

      <div className="hero-container">

        {/* LEFT */}

        <motion.div
          className="hero-left"
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >

          <span className="hero-badge">
            ✦ Transforming Ideas Into Digital Reality
          </span>

          <h1>

            Building

            <span> Powerful </span>

            Digital

            <br />

            Experiences

          </h1>

          <p>

            DevVerse helps startups and businesses build
            beautiful websites, mobile applications,
            ecommerce platforms and custom software
            solutions with cutting-edge technologies.

          </p>

          <div className="hero-buttons">

            <button
              className="hero-btn"
              onClick={() => navigate("/chat")}
            >
              Get Started
              <FaArrowRight />
            </button>

            {/* <button className="hero-btn-outline">

              View Portfolio

            </button> */}

          </div>

          <div className="hero-technologies">

            <span>React</span>

            <span>Flutter</span>

            <span>Spring Boot</span>

            <span>NodeJS</span>

            <span>MongoDB</span>

            <span>MySQL</span>

          </div>

        </motion.div>

        {/* RIGHT */}

        <motion.div
          className="hero-right"
          initial={{ opacity: 0, scale: .7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >

          <div className="logo-glow"></div>

          <div className="logo-circle">

            <img src={logo} alt="DevVerse" />

          </div>

          {/* Floating Card 1 */}

          <motion.div
            className="floating-card card1"
            animate={{ y: [0, -15, 0] }}
            transition={{
              duration: 5,
              repeat: Infinity
            }}
          >

            <h4>Mobile Apps</h4>

            <p>Android • iOS</p>

          </motion.div>

          {/* Floating Card 2 */}

          <motion.div
            className="floating-card card2"
            animate={{ y: [0, 15, 0] }}
            transition={{
              duration: 6,
              repeat: Infinity
            }}
          >

            <h4>Web Apps</h4>

            <p>React • Vite</p>

          </motion.div>

          {/* Floating Card 3 */}

          <motion.div
            className="floating-card card3"
            animate={{ y: [0, -12, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity
            }}
          >

            <h4>Software</h4>

            <p>Custom ERP</p>

          </motion.div>

        </motion.div>

      </div>

    </section>
  );
}

export default Hero;