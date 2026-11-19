import { Link } from "react-router-dom";
import {
  FaLaptopCode,
  FaMobileAlt,
  FaShoppingCart,
  FaCode,
  FaCloud,
  FaPenNib,
} from "react-icons/fa";

import { services } from "../../../data/site";
import Reveal from "./Reveal";

const icons = {
  "website-development": FaLaptopCode,
  "mobile-applications": FaMobileAlt,
  "e-commerce-solutions": FaShoppingCart,
  "custom-software": FaCode,
  "cloud-solutions": FaCloud,
  "ui-ux-design": FaPenNib,
};

function ServicesList() {
  return (
    <section
      className="dv-section dv-services"
      id="services"
      aria-labelledby="services-title"
    >
      <div className="dv-container">
        <Reveal as="header" className="dv-services__head">
          <p className="dv-eyebrow">What we do</p>
          <h2 className="dv-display dv-h2" id="services-title">
            Don&rsquo;t buy a poster.
            <br />
            Build something that works.
          </h2>
          <p>
            We combine design, technology and a bit of strategy to build
            digital products that fit your business.
          </p>
        </Reveal>

        <ul className="dv-svc-grid">
          {services.map((service, index) => {
            const Icon = icons[service.slug] || FaCode;

            return (
            <Reveal as="li" delay={(index % 3) * 0.08} key={service.slug}>
              <Link to={`/services/${service.slug}`} className="dv-svc">
                <span className="dv-svc__icon" aria-hidden="true">
                  <Icon />
                </span>
                <span className="dv-svc__num" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="dv-display dv-svc__name">{service.title}</span>
                <span className="dv-svc__text">{service.description}</span>
                <span className="dv-svc__more" aria-hidden="true">
                  Explore
                </span>
              </Link>
            </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default ServicesList;
