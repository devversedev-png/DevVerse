import { Link } from "react-router-dom";

import { teamHighlights } from "../../../data/site";

function TeamIntro() {
  return (
    <section
      className="dv-section dv-team"
      id="team"
      aria-labelledby="team-title"
    >
      <div className="dv-container dv-team__grid">
        <div className="dv-team__lead">
          <h2 className="dv-display dv-h2" id="team-title">
            A small team with big ideas.
          </h2>
          <p>
            DevVerse started with a simple idea: bring together a small group
            of people who love technology and build useful digital products.
            We&rsquo;re five developers, still early in our journey, and proud
            of it. We don&rsquo;t pretend to be a huge agency, and you talk
            directly to the people building your product.
          </p>
          <Link className="dv-textlink" to="/about">
            More about us
          </Link>
        </div>

        <div className="dv-team__side">
          <p className="dv-display dv-team__motto">
            Listen.
            <br />
            Understand.
            <br />
            Build.
          </p>

          <ul className="dv-team__list">
            {teamHighlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default TeamIntro;
