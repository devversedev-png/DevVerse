import "./Portfolio.css";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";
import { useProjects } from "../../context/ProjectsContext";

import {
  FaMobileAlt,
  FaShoppingCart,
  FaLaptopCode,
  FaCode,
  FaArrowRight,
  FaRocket
} from "react-icons/fa";

const iconByKind = {
  mobile: <FaMobileAlt />,
  shop: <FaShoppingCart />,
  dashboard: <FaLaptopCode />,
  soon: <FaCode />,
};

function statusClass(status) {
  const value = status.toLowerCase();

  if (value === "completed" || value === "live") return "status-completed";
  if (value === "in progress") return "status-progress";
  return "status-coming";
}

function Portfolio() {
  const { projects } = useProjects();

  return (
    <>
      <Navbar />

      <main className="portfolio-page">

        {/* HERO */}

        <section className="portfolio-hero">

          <span className="portfolio-label">
            OUR PROJECTS
          </span>

          <h1>
            Ideas Turned Into
            <br />
            <span>Digital Experiences.</span>
          </h1>

          <p>
            We're a growing team focused on building meaningful digital
            products. Every project helps us learn, improve and create
            better solutions for our clients.
          </p>

        </section>

        {/* PROJECTS */}

        <section className="portfolio-projects">

          <div className="portfolio-section-heading">

            <div>
              <span>SELECTED WORK</span>

              <h2>
                A Few Things
                <br />
                We've Been Building
              </h2>
            </div>

            <p>
              We're at the beginning of our journey. Instead of filling our
              portfolio with fake projects, we prefer to showcase the real
              work and solutions we're building.
            </p>

          </div>

          <div className="portfolio-grid">

            {projects.map((project, index) => (

              <article className="portfolio-card" key={index}>

                <div className="portfolio-card-visual">

                  <div className="portfolio-card-number">
                    0{index + 1}
                  </div>

                  {project.images && project.images.length > 0 ? (
                    <img
                      className="portfolio-card-shot"
                      src={project.images[0]}
                      alt={`${project.title} homepage`}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="portfolio-project-icon">
                      {iconByKind[project.kind]}
                    </div>
                  )}

                  <span
                    className={`portfolio-status ${statusClass(project.status)}`}
                  >
                    {project.status}
                  </span>

                </div>

                <div className="portfolio-card-content">

                  <span className="portfolio-category">
                    {project.category}
                  </span>

                  <h3>{project.title}</h3>

                  <p>{project.description}</p>

                  <div className="portfolio-technologies">

                    {project.technologies.map((technology, techIndex) => (
                      <span key={techIndex}>
                        {technology}
                      </span>
                    ))}

                  </div>

                  <Link
                    className="portfolio-view-button"
                    to={`/portfolio/${project.slug}`}
                  >
                    View Project
                    <FaArrowRight />
                  </Link>

                </div>

              </article>

            ))}

          </div>

        </section>

        {/* GROWING SECTION */}

        <section className="portfolio-growing">

          <div className="portfolio-growing-icon">
            <FaRocket />
          </div>

          <div className="portfolio-growing-content">

            <span>WE'RE JUST GETTING STARTED</span>

            <h2>
              Our Portfolio Is
              <span> Growing With Us.</span>
            </h2>

            <p>
              DevVerse is a young team with a strong passion for technology
              and design. As we work with more clients and build more
              products, this space will continue to grow with real work and
              real stories.
            </p>

          </div>

        </section>

        {/* CTA */}

        <section className="portfolio-cta">

          <span>YOUR IDEA COULD BE NEXT</span>

          <h2>
            Have Something
            <br />
            <span>Great In Mind?</span>
          </h2>

          <p>
            Tell us about your idea. We'll help you transform it into a
            beautiful and functional digital product.
          </p>

          <Link to="/contact">
            Start A Project
            <FaArrowRight />
          </Link>

        </section>

      </main>

      <Footer />
    </>
  );
}

export default Portfolio;