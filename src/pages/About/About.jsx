import "./About.css";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import {
  FaUsers,
  FaLightbulb,
  FaCode,
  FaHeart,
  FaCheckCircle,
  FaArrowRight
} from "react-icons/fa";

const values = [
  {
    icon: <FaLightbulb />,
    title: "Creative Thinking",
    description:
      "We explore ideas, challenge ordinary solutions and look for better ways to build meaningful digital products."
  },
  {
    icon: <FaCode />,
    title: "Quality Development",
    description:
      "We focus on clean, reliable and maintainable development using modern technologies and practices."
  },
  {
    icon: <FaUsers />,
    title: "Team Collaboration",
    description:
      "We believe the best results come from working together, sharing ideas and communicating openly."
  },
  {
    icon: <FaHeart />,
    title: "Passion For Building",
    description:
      "We're genuinely passionate about technology, design and turning ideas into products people enjoy using."
  }
];

const highlights = [
  "Small and focused team",
  "Direct communication",
  "Modern technologies",
  "Flexible development approach",
  "Attention to design and usability",
  "Continuous learning and improvement"
];

function About() {
  return (
    <>
      <Navbar />

      <main className="about-page">

        {/* HERO */}

        <section className="about-hero">
          <span className="about-label">ABOUT DEVVERSE</span>

          <h1>
            A Small Team With
            <br />
            <span>Big Ideas.</span>
          </h1>

          <p>
            We're a growing team of five passionate developers and creators
            focused on building modern websites, mobile applications,
            e-commerce platforms and custom software solutions.
          </p>
        </section>

        {/* STORY */}

        <section className="about-story">

          <div className="about-story-visual">

            <div className="about-orbit about-orbit-one"></div>
            <div className="about-orbit about-orbit-two"></div>

            <div className="about-team-card">
              <FaUsers />

              <strong>5</strong>

              <span>Creative Minds</span>
            </div>

            <div className="about-floating-tag about-tag-one">
              BUILD
            </div>

            <div className="about-floating-tag about-tag-two">
              CREATE
            </div>

            <div className="about-floating-tag about-tag-three">
              GROW
            </div>

          </div>

          <div className="about-story-content">

            <span>OUR STORY</span>

            <h2>
              We're Building Our
              <br />
              Journey Together.
            </h2>

            <p>
              DevVerse started with a simple idea — bring together a small
              group of people who love technology and create useful digital
              products for businesses and individuals.
            </p>

            <p>
              We're still at the beginning of our journey, and that's
              something we're proud of. Every project gives us an opportunity
              to learn, improve and build stronger relationships with the
              people we work with.
            </p>

            <p>
              We don't pretend to be a huge agency. We're a focused team that
              values communication, creativity and delivering work we can
              genuinely be proud of.
            </p>

          </div>

        </section>

        {/* VALUES */}

        <section className="about-values">

          <div className="about-section-heading">

            <span>WHAT DRIVES US</span>

            <h2>
              The Values Behind
              <br />
              <span>Everything We Build.</span>
            </h2>

          </div>

          <div className="about-values-grid">

            {values.map((value, index) => (
              <article className="about-value-card" key={index}>

                <div className="about-value-number">
                  0{index + 1}
                </div>

                <div className="about-value-icon">
                  {value.icon}
                </div>

                <h3>{value.title}</h3>

                <p>{value.description}</p>

              </article>
            ))}

          </div>

        </section>

        {/* WHY US */}

        <section className="about-why">

          <div className="about-why-content">

            <span>WHY WORK WITH US</span>

            <h2>
              Small Team.
              <br />
              <span>Personal Attention.</span>
            </h2>

            <p>
              Working with a small team means your project doesn't get lost
              between departments. You communicate directly with the people
              involved in building your product.
            </p>

            <div className="about-highlights">

              {highlights.map((highlight, index) => (
                <div className="about-highlight" key={index}>
                  <FaCheckCircle />
                  <span>{highlight}</span>
                </div>
              ))}

            </div>

          </div>

          <div className="about-why-visual">

            <div className="about-glass-card about-card-main">
              <span>OUR APPROACH</span>

              <h3>
                Listen.
                <br />
                Understand.
                <br />
                Build.
              </h3>
            </div>

            <div className="about-mini-card about-mini-one">
              <strong>01</strong>
              <span>Ideas</span>
            </div>

            <div className="about-mini-card about-mini-two">
              <strong>02</strong>
              <span>Solutions</span>
            </div>

          </div>

        </section>

        {/* CTA */}

        <section className="about-cta">

          <span>LET'S CREATE TOGETHER</span>

          <h2>
            Have An Idea?
            <br />
            <span>We'd Love To Hear It.</span>
          </h2>

          <p>
            Whether you're starting something new or improving an existing
            product, let's talk about how we can help bring your idea to life.
          </p>

          <button>
            Let's Talk
            <FaArrowRight />
          </button>

        </section>

      </main>

      <Footer />
    </>
  );
}

export default About;