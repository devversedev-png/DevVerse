import "./Projects.css";
import { FaArrowRight, FaCode, FaMobileAlt, FaShoppingCart } from "react-icons/fa";


const projects = [
  {
    icon: <FaMobileAlt />,
    title: "Business Mobile Application",
    category: "Android & iOS",
    description:
      "A modern business application designed for seamless customer engagement and productivity.",
    status: "Completed"
  },
  {
    icon: <FaShoppingCart />,
    title: "E-Commerce Platform",
    category: "Web Development",
    description:
      "A secure and responsive online shopping platform with payment gateway integration.",
    status: "Completed"
  },
  {
    icon: <FaCode />,
    title: "Custom Business Software",
    category: "Software Solution",
    description:
      "Powerful software built to simplify business operations and improve efficiency.",
    status: "Coming Soon"
  }
];

function Projects() {
  return (
    <section className="projects-section">

      <div className="projects-header">

        <span>OUR WORK</span>

        <h2>

          Projects We've
          <br />

          Built With Passion

        </h2>

        <p>

          As a growing software company, every project reflects our
          commitment to quality, innovation and user experience.

        </p>

      </div>

      <div className="projects-grid">

        {projects.map((project, index) => (

          <div className="project-card" key={index}>

            <div className="project-image">

              <div className="project-icon">

                {project.icon}

              </div>

            </div>

            <div className="project-content">

              <span className="project-category">

                {project.category}

              </span>

              <h3>

                {project.title}

              </h3>

              <p>

                {project.description}

              </p>

              <div className="project-footer">

                <span className={`status ${project.status === "Completed" ? "completed" : "coming"}`}>

                  {project.status}

                </span>

                <button>

                  View Details

                  <FaArrowRight />

                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}

export default Projects;