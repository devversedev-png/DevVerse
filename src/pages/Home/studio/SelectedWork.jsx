import { Link } from "react-router-dom";

import { useProjects } from "../../../context/ProjectsContext";
import ProjectPreview from "./ProjectPreview";

const statusClass = {
  Live: "dv-status--done",
  Completed: "dv-status--done",
  "In progress": "dv-status--progress",
  "Coming soon": "dv-status--soon",
};

function CaseLink({ project, children }) {
  return (
    <Link className="dv-case__link" to={`/portfolio/${project.slug}`}>
      {children}
    </Link>
  );
}

function SelectedWork() {
  const { projects } = useProjects();

  return (
    <section className="dv-work" id="work" aria-labelledby="work-title">
      <div className="dv-container dv-work__head">
        <div>
          <p className="dv-eyebrow">Our work</p>
          <h2 className="dv-display dv-h2" id="work-title">
            Selected work
          </h2>
        </div>
        <p className="dv-work__intro">
          We&rsquo;re at the beginning of our journey, so instead of filling
          this page with made-up case studies, we show the work we&rsquo;re
          actually building and label each project honestly.
        </p>
      </div>

      <ol className="dv-cases">
        {projects.map((project, index) => {
          const hasShots = project.images && project.images.length > 0;

          return (
            <li
              className="dv-case"
              key={project.slug}
              style={{ "--i": index }}
            >
              <div className="dv-container dv-case__grid">
                <div className="dv-case__text">
                  <p className="dv-case__index" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </p>

                  <h3 className="dv-display dv-case__title">
                    <CaseLink project={project}>
                      <span>{project.title}</span>
                      <span className="dv-visually-hidden">
                        , project details
                      </span>
                    </CaseLink>
                  </h3>

                  <div className="dv-case__meta">
                    <span className={`dv-status ${statusClass[project.status]}`}>
                      {project.status}
                    </span>
                    <span>{project.category}</span>
                    {!hasShots && <span>Illustrated preview</span>}
                  </div>

                  <p className="dv-case__desc">{project.description}</p>

                  <ul className="dv-tags" aria-label="Technologies">
                    {project.technologies.map((tech) => (
                      <li key={tech}>{tech}</li>
                    ))}
                  </ul>

                  <div className="dv-case__links">
                    <span className="dv-case__more" aria-hidden="true">
                      Read more
                    </span>

                    {project.href && (
                      <a
                        className="dv-case__live"
                        href={project.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visit live site
                        <span className="dv-visually-hidden">
                          {" "}
                          for {project.title} (opens in a new tab)
                        </span>
                      </a>
                    )}
                  </div>
                </div>

                <div className="dv-case__media">
                  <ProjectPreview
                    project={project}
                    interval={4400 + index * 400}
                    alt={`${project.title} screenshot`}
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export default SelectedWork;
