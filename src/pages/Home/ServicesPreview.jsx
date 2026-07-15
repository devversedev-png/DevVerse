import "./ServicesPreview.css";

import { Link } from "react-router-dom";

import {
  FaLaptopCode,
  FaMobileAlt,
  FaShoppingCart,
  FaCode,
  FaCloud,
  FaPaintBrush,
  FaArrowRight,
} from "react-icons/fa";

const services = [
  {
    slug: "website-development",
    icon: <FaLaptopCode />,
    title: "Web Development",
    description:
      "Modern, responsive and scalable websites built with the latest technologies.",
  },
  {
    slug: "mobile-applications",
    icon: <FaMobileAlt />,
    title: "Mobile Applications",
    description:
      "Beautiful Android & iOS applications with native-like performance.",
  },
  {
    slug: "e-commerce-solutions",
    icon: <FaShoppingCart />,
    title: "E-Commerce",
    description:
      "Online stores with secure payment gateways and inventory management.",
  },
  {
    slug: "custom-software",
    icon: <FaCode />,
    title: "Software Development",
    description:
      "Custom business software tailored for startups and enterprises.",
  },
  {
    slug: "cloud-solutions",
    icon: <FaCloud />,
    title: "Cloud Solutions",
    description:
      "Deploy, monitor and scale applications securely in the cloud.",
  },
  {
    slug: "ui-ux-design",
    icon: <FaPaintBrush />,
    title: "UI / UX Design",
    description:
      "Clean, intuitive and visually engaging user experiences.",
  },
];

function ServicesPreview() {
  return (
    <section className="services-preview">
      <div className="services-header">
        <span>OUR SERVICES</span>

        <h2>
          Digital Solutions
          <br />
          Designed For Growth
        </h2>

        <p>
          We combine creativity, technology and strategy
          to build digital products that elevate your business.
        </p>
      </div>

      <div className="services-grid">
        {services.map((service) => (
          <div
            className="service-box"
            key={service.slug}
          >
            <div className="service-icon">
              {service.icon}
            </div>

            <h3>{service.title}</h3>

            <p>{service.description}</p>

            <Link
              to={`/services/${service.slug}`}
              className="service-preview-link"
            >
              Learn More
              <FaArrowRight />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ServicesPreview;