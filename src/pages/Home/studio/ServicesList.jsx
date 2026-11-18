import { Link } from "react-router-dom";

import { services } from "../../../data/site";

function ServicesList() {
  return (
    <section
      className="dv-section dv-services"
      id="services"
      aria-labelledby="services-title"
    >
      <div className="dv-container">
        <header className="dv-services__head">
          <h2 className="dv-display dv-h2" id="services-title">
            Don&rsquo;t buy a poster.
            <br />
            Build something that works.
          </h2>
          <p>
            We combine design, technology and a bit of strategy to build
            digital products that fit your business.
          </p>
        </header>

        <ul className="dv-svc-grid">
          {services.map((service, index) => (
            <li key={service.slug}>
              <Link to={`/services/${service.slug}`} className="dv-svc">
                <span className="dv-svc__num" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="dv-display dv-svc__name">{service.title}</span>
                <span className="dv-svc__text">{service.description}</span>
                <span className="dv-svc__more" aria-hidden="true">
                  Explore
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default ServicesList;
