const rows = [
  {
    label: "Who builds it",
    agency: "Account managers, then a handoff to a team",
    us: "The five developers themselves",
  },
  {
    label: "Communication",
    agency: "Through layers of contacts",
    us: "Direct, with the people building your product",
  },
  {
    label: "Approach",
    agency: "Fixed packages",
    us: "Flexible, shaped around your idea",
  },
  {
    label: "Technology",
    agency: "Whatever the agency already uses",
    us: "A modern stack chosen for your project",
  },
  {
    label: "Honesty about size",
    agency: "Large team, large overhead",
    us: "A young team that works hard to earn your trust",
  },
];

import Reveal from "./Reveal";

function Comparison() {
  return (
    <section
      className="dv-section dv-compare"
      aria-labelledby="compare-title"
    >
      <div className="dv-container">
        <Reveal>
          <p className="dv-eyebrow">Why a small team</p>
          <h2 className="dv-display dv-h2" id="compare-title">
            A small team, on purpose.
          </h2>
        </Reveal>

        <Reveal className="dv-compare__scroll" delay={0.1}>
          <table className="dv-compare__table">
            <caption className="dv-visually-hidden">
              How working with DevVerse compares with a typical large agency
            </caption>
            <thead>
              <tr>
                <th scope="col">
                  <span className="dv-visually-hidden">What</span>
                </th>
                <th scope="col">A typical large agency</th>
                <th scope="col" className="dv-compare__us">
                  DevVerse
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label}>
                  <th scope="row">{row.label}</th>
                  <td>{row.agency}</td>
                  <td className="dv-compare__us">{row.us}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </div>
    </section>
  );
}

export default Comparison;
