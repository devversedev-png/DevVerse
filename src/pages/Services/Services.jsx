import "./Services.css";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import { Link } from "react-router-dom";

import {
  FaLaptopCode,
  FaMobileAlt,
  FaShoppingCart,
  FaCode,
  FaCloud,
  FaPalette,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";

const services = [
  {
    slug: "website-development",
    icon: <FaLaptopCode />,
    title: "Website Development",
    description:
      "Premium responsive websites built using modern technologies with outstanding UI/UX."
  },
  {
    slug: "mobile-applications",
    icon: <FaMobileAlt />,
    title: "Mobile Applications",
    description:
      "Native and cross-platform Android & iOS applications with exceptional performance."
  },
  {
    slug: "e-commerce-solutions",
    icon: <FaShoppingCart />,
    title: "E-Commerce Solutions",
    description:
      "Complete online stores with payment gateways, inventory management and analytics."
  },
  {
    slug: "custom-software",
    icon: <FaCode />,
    title: "Custom Software",
    description:
      "Business software tailored specifically for your organization's workflow."
  },
  {
    slug: "cloud-solutions",
    icon: <FaCloud />,
    title: "Cloud Solutions",
    description:
      "Deploy, monitor and scale your applications securely in modern cloud platforms."
  },
  {
    slug: "ui-ux-design",
    icon: <FaPalette />,
    title: "UI / UX Design",
    description:
      "Beautiful, intuitive and conversion-focused user interface designs."
  }
];
const process = [
  "Requirement Analysis",
  "Planning & Architecture",
  "UI / UX Design",
  "Development",
  "Testing",
  "Deployment & Support",
];

const technologies = [
  "React",
  "Spring Boot",
  "Flutter",
  "Node.js",
  "Java",
  "Python",
  "MongoDB",
  "MySQL",
  "AWS",
  "Docker",
  "Figma",
  "Git",
];

function Services() {
  return (
    <>
      <Navbar />

      <main className="services-page">
        {/* HERO */}

        <section className="services-hero">
          <span>OUR SERVICES</span>

          <h1>
            Premium Digital
            <br />
            Solutions For
            <span> Modern Businesses</span>
          </h1>

          <p>
            We transform ideas into scalable digital products through
            cutting-edge technology, elegant design and exceptional
            development practices.
          </p>
        </section>

        {/* SERVICES GRID */}

        <section className="services-grid">
          {services.map((item) => (
            <article
              className="service-card"
              key={item.slug}
            >
              <div className="service-icon">
                {item.icon}
              </div>

              <h3>{item.title}</h3>

              <p>{item.description}</p>

              <Link
                to={`/services/${item.slug}`}
                className="service-learn-more"
              >
                Learn More
                <FaArrowRight />
              </Link>
            </article>
          ))}
        </section>

        {/* DEVELOPMENT PROCESS */}

        <section className="development-process">
          <div className="process-left">
            <span>HOW WE WORK</span>

            <h2>
              Our Development
              <br />
              Process
            </h2>

            <p>
              Every project follows a proven workflow ensuring
              quality, transparency and timely delivery.
            </p>
          </div>

          <div className="process-right">
            {process.map((step, index) => (
              <div
                className="step-card"
                key={step}
              >
                <div className="step-number">
                  {index + 1}
                </div>

                <div>
                  <h3>{step}</h3>

                  <p>
                    Professional execution with complete
                    transparency and continuous communication.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TECHNOLOGIES */}

        <section className="technology-section">
          <span>TECHNOLOGIES</span>

          <h2>
            Technologies
            <br />
            We Love
          </h2>

          <div className="tech-grid">
            {technologies.map((tech) => (
              <div
                className="tech-card"
                key={tech}
              >
                <FaCheckCircle />
                {tech}
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}

        <section className="services-cta">
          <h2>
            Ready To Build
            <span> Your Next Project?</span>
          </h2>

          <p>
            Let's discuss your ideas and create something
            extraordinary together.
          </p>

          <Link
            to="/contact"
            className="services-cta-button"
          >
            Get Started
            <FaArrowRight />
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Services;