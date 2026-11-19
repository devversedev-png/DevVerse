import { Link } from "react-router-dom";

import { processSteps } from "../../../data/site";

// Condenses the six existing process steps into three phases.
const phases = [
  {
    when: "Now",
    title: "Discovery",
    text: processSteps[0].description,
  },
  {
    when: "Next",
    title: "Roadmap and design",
    text: `${processSteps[1].description} ${processSteps[2].description}`,
  },
  {
    when: "Then",
    title: "Build and launch",
    text: `${processSteps[3].description} ${processSteps[5].description}`,
  },
];

import Reveal from "./Reveal";

function HowWeWork({ onStart }) {
  return (
    <section
      className="dv-section dv-process"
      id="process"
      aria-labelledby="process-title"
    >
      <div className="dv-container">
        <Reveal as="header" className="dv-process__head">
          <div>
            <p className="dv-eyebrow">How we work</p>
            <h2 className="dv-display dv-h2" id="process-title">
              From first chat to launch in three steps.
            </h2>
          </div>
          <Link className="dv-textlink" to="/process">
            Read the full process
          </Link>
        </Reveal>

        <ol className="dv-phases">
          {phases.map((phase, index) => (
            <Reveal
              as="li"
              className="dv-phase"
              delay={index * 0.1}
              key={phase.title}
            >
              <span className="dv-display dv-phase__num" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="dv-phase__when">{phase.when}</span>
              <h3 className="dv-display dv-phase__title">{phase.title}</h3>
              <p>{phase.text}</p>
              {index === 0 && (
                <button
                  type="button"
                  className="dv-textlink dv-phase__start"
                  onClick={onStart}
                >
                  Start here
                </button>
              )}
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default HowWeWork;
