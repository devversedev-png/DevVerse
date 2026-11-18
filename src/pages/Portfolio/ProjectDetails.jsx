import { Link, Navigate, useParams } from "react-router-dom";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProjectPreview from "../Home/studio/ProjectPreview";
import { getProject, projects } from "../../data/site";

import "./ProjectDetails.css";

function ProjectDetails() {
  const { slug } = useParams();
  const project = getProject(slug);

  if (!project) {
    return <Navigate to="/portfolio" replace />;
  }

  const others = projects.filter((item) => item.slug !== project.slug);
  const isUpcoming = project.kind === "soon";

  return (
    <>
      <Navbar />

      <main className="pd-page">
        <div className="pd-wrap">
          <Link className="pd-back" to="/portfolio">
            Back to all projects
          </Link>

          <header className="pd-head">
            <p className="pd-meta">
              <span>{project.status}</span>
              <span>{project.category}</span>
            </p>
            <h1>{project.title}</h1>
            <p className="pd-lead">{project.description}</p>
          </header>

          <div className="pd-media">
            <ProjectPreview
              project={project}
              alt={`${project.title} screenshot`}
            />
          </div>
          {!(project.images && project.images.length) && (
            <p className="pd-note">Illustrated preview, not a screenshot.</p>
          )}

          <section className="pd-grid" aria-label="About this project">
            <div className="pd-block">
              <h2>About this project</h2>
              {project.details.overview.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="pd-block">
              <h2>Built with</h2>
              <ul className="pd-tags">
                {project.technologies.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>

              <h2>{isUpcoming ? "How we would start" : "What it covers"}</h2>
              <ul className="pd-list">
                {project.details.scope.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <h2>A good fit if</h2>
              <ul className="pd-list">
                {project.details.fit.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="pd-cta" aria-labelledby="pd-cta-title">
            <h2 id="pd-cta-title">
              {isUpcoming
                ? "Want your idea on this page?"
                : "Want something like this?"}
            </h2>
            <p>
              Tell us what you have in mind. A rough idea is enough to start.
            </p>
            <div className="pd-actions">
              <Link className="pd-btn pd-btn--solid" to="/contact">
                Start a project
              </Link>
              <Link className="pd-btn pd-btn--ghost" to="/chat">
                Chat with us
              </Link>
            </div>
          </section>

          <nav className="pd-more" aria-label="More projects">
            <h2>More projects</h2>
            <ul>
              {others.map((item) => (
                <li key={item.slug}>
                  <Link to={`/portfolio/${item.slug}`}>
                    <span>{item.title}</span>
                    <small>{item.category}</small>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default ProjectDetails;
