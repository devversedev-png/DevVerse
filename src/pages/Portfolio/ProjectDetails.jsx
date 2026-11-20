import { Link, Navigate, useParams } from "react-router-dom";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProjectPreview from "../Home/studio/ProjectPreview";
import { useProjects } from "../../context/ProjectsContext";

import "./ProjectDetails.css";

function ProjectDetails() {
  const { slug } = useParams();
  const { projects, getProject } = useProjects();
  const project = getProject(slug);

  if (!project) {
    return <Navigate to="/portfolio" replace />;
  }

  const others = projects.filter((item) => item.slug !== project.slug);
  const isUpcoming = project.status === "Coming soon";

  const details = project.details || {};
  const overview =
    details.overview && details.overview.length
      ? details.overview
      : [project.description];
  const scope = details.scope || [];
  const fit = details.fit || [];

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

            {project.href && (
              <a
                className="pd-btn pd-btn--solid pd-live"
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit live site
                <span className="pd-visually-hidden">
                  {" "}
                  (opens in a new tab)
                </span>
              </a>
            )}
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

          {project.images && project.images.length > 1 && (
            <section className="pd-shots" aria-label="Screenshots">
              <h2>Screens from the project</h2>
              <ul>
                {project.images.map((src, index) => (
                  <li key={src}>
                    <img
                      src={src}
                      alt={`${project.title} screen ${index + 1}`}
                      loading="lazy"
                      decoding="async"
                    />
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="pd-grid" aria-label="About this project">
            <div className="pd-block">
              <h2>About this project</h2>
              {overview.map((paragraph) => (
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

              {scope.length > 0 && (
                <>
                  <h2>{isUpcoming ? "How we would start" : "What it covers"}</h2>
                  <ul className="pd-list">
                    {scope.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </>
              )}

              {fit.length > 0 && (
                <>
                  <h2>A good fit if</h2>
                  <ul className="pd-list">
                    {fit.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </>
              )}
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

          {others.length > 0 && (
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
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

export default ProjectDetails;
