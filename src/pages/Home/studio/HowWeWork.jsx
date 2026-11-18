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

function HowWeWork({ onStart }) {
  return (
    <section
      className="dv-section dv-process"
      id="process"
      aria-labelledby="process-title"
    >
      <div className="dv-container">
        <header className="dv-process__head">
          <h2 className="dv-display dv-h2" id="process-title">
            From first chat to launch in three steps.
          </h2>
          <Link className="dv-textlink" to="/process">
            Read the full process
          </Link>
        </header>

        <ol className="dv-phases">
          {phases.map((phase, index) => (
            <li className="dv-phase" key={phase.title}>
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
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default HowWeWork;
