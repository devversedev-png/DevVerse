import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";

/*
 * Shows a project as a gently auto-sliding set of frames.
 * - If project.images has real screenshots, those are used.
 * - Otherwise a small illustrated wireframe is drawn for the project type.
 *   These are illustrations, not screenshots, and the Selected Work cards
 *   label them as such.
 */

function Line({ w = "100%", accent = false, h }) {
  return (
    <i
      className={accent ? "dv-wf-line dv-wf-line--accent" : "dv-wf-line"}
      style={{ width: w, height: h }}
    />
  );
}

function Wireframe({ kind, variant }) {
  if (kind === "mobile") {
    return (
      <div className="dv-wf dv-wf--center">
        <div className="dv-wf-phone">
          <Line w="38%" />
          {variant === 0 ? (
            <>
              <div className="dv-wf-box dv-wf-box--tall" />
              <Line w="80%" />
              <Line w="55%" />
              <div className="dv-wf-row">
                <div className="dv-wf-box" />
                <div className="dv-wf-box dv-wf-box--accent" />
              </div>
            </>
          ) : (
            <>
              <div className="dv-wf-row">
                <div className="dv-wf-dot" />
                <Line w="70%" />
              </div>
              <div className="dv-wf-row">
                <div className="dv-wf-dot" />
                <Line w="60%" />
              </div>
              <div className="dv-wf-row">
                <div className="dv-wf-dot dv-wf-dot--accent" />
                <Line w="75%" accent />
              </div>
              <div className="dv-wf-box dv-wf-box--grow" />
            </>
          )}
        </div>
      </div>
    );
  }

  if (kind === "shop") {
    return (
      <div className="dv-wf dv-wf--browser">
        <div className="dv-wf-chrome">
          <i />
          <i />
          <i />
        </div>
        {variant === 0 ? (
          <div className="dv-wf-grid">
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <div className="dv-wf-product" key={n}>
                <div className={n === 1 ? "dv-wf-box dv-wf-box--accent" : "dv-wf-box"} />
                <Line w="70%" />
                <Line w="40%" accent />
              </div>
            ))}
          </div>
        ) : (
          <div className="dv-wf-split">
            <div className="dv-wf-box dv-wf-box--grow" />
            <div className="dv-wf-stack">
              <Line w="80%" h="12px" />
              <Line w="55%" />
              <Line w="90%" />
              <Line w="75%" />
              <div className="dv-wf-button">Add to cart</div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (kind === "dashboard") {
    return (
      <div className="dv-wf dv-wf--browser">
        <div className="dv-wf-chrome">
          <i />
          <i />
          <i />
        </div>
        <div className="dv-wf-split dv-wf-split--side">
          <div className="dv-wf-side">
            <Line w="70%" accent />
            <Line w="60%" />
            <Line w="65%" />
            <Line w="50%" />
          </div>
          {variant === 0 ? (
            <div className="dv-wf-stack dv-wf-stack--fill">
              <div className="dv-wf-bars">
                {[45, 70, 55, 90, 62, 80].map((h, n) => (
                  <span
                    key={n}
                    className={n === 3 ? "dv-wf-bar dv-wf-bar--accent" : "dv-wf-bar"}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <Line w="90%" />
              <Line w="70%" />
            </div>
          ) : (
            <div className="dv-wf-kanban">
              {[0, 1, 2].map((col) => (
                <div className="dv-wf-col" key={col}>
                  <Line w="60%" accent={col === 1} />
                  <div className="dv-wf-box" />
                  <div className="dv-wf-box" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // "soon"
  return (
    <div className="dv-wf dv-wf--center">
      <div className="dv-wf-empty">
        <span>+</span>
      </div>
    </div>
  );
}

function framesFor(project) {
  if (project.images && project.images.length > 0) {
    return project.images.map((src) => ({ src }));
  }

  return project.kind === "soon"
    ? [{ variant: 0 }]
    : [{ variant: 0 }, { variant: 1 }];
}

function ProjectPreview({ project, interval = 4600, alt = "" }) {
  const reduceMotion = useReducedMotion();
  const frames = useMemo(() => framesFor(project), [project]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion || frames.length < 2) return undefined;

    const timer = setInterval(() => {
      if (!document.hidden) {
        setIndex((current) => (current + 1) % frames.length);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [reduceMotion, frames.length, interval]);

  const step = 100 / frames.length;

  return (
    <div className="dv-slides">
      <div
        className="dv-slides__track"
        style={{
          width: `${frames.length * 100}%`,
          transform: `translateX(-${index * step}%)`,
        }}
      >
        {frames.map((frame, n) => (
          <div
            className="dv-slides__frame"
            style={{ width: `${step}%` }}
            key={n}
          >
            {frame.src ? (
              <img
                src={frame.src}
                alt={alt}
                loading="lazy"
                decoding="async"
              />
            ) : (
              <Wireframe kind={project.kind} variant={frame.variant} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectPreview;
