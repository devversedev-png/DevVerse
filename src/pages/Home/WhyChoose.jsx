import "./WhyChoose.css";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaRocket,
  FaShieldAlt,
  FaClock,
  FaHeadset,
  FaCode
} from "react-icons/fa";

const features = [
  {
    icon: <FaRocket />,
    title: "Fast Development",
    desc: "We deliver scalable and high-performance digital products with agile development."
  },
  {
    icon: <FaShieldAlt />,
    title: "Secure Solutions",
    desc: "Security and reliability are at the core of every application we build."
  },
  {
    icon: <FaClock />,
    title: "On-Time Delivery",
    desc: "Projects are delivered on schedule without compromising quality."
  },
  {
    icon: <FaHeadset />,
    title: "Continuous Support",
    desc: "We're always available to improve, maintain and support your product."
  }
];

const points = [
  "Premium UI & UX Design",
  "Responsive for All Devices",
  "Clean & Maintainable Code",
  "SEO Friendly Architecture",
  "Scalable Business Solutions",
  "Modern Tech Stack"
];

function WhyChoose() {
  return (
    <section className="why">

      <div className="why-container">

        {/* LEFT */}

        <motion.div
          className="why-left"
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: .8 }}
          viewport={{ once: true }}
        >

          <span className="why-tag">
            WHY CHOOSE DEVVERSE
          </span>

          <h2>

            Building Software

            <span> That Makes</span>

            <br />

            Businesses Grow

          </h2>

          <p>

            We focus on delivering premium digital experiences
            with modern technologies, beautiful designs and
            scalable architectures. Whether you're a startup or
            an established business, we help bring your vision
            to life.

          </p>

          <div className="why-list">

            {points.map((item, index) => (

              <div className="why-item" key={index}>

                <FaCheckCircle />

                <span>{item}</span>

              </div>

            ))}

          </div>

        </motion.div>

        {/* RIGHT */}

        <motion.div
          className="why-right"
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: .8 }}
          viewport={{ once: true }}
        >

          {features.map((feature, index) => (

            <div className="feature-card" key={index}>

              <div className="feature-icon">

                {feature.icon}

              </div>

              <div>

                <h3>{feature.title}</h3>

                <p>{feature.desc}</p>

              </div>

            </div>

          ))}

          <div className="experience-card">

            <FaCode />

            <h1>Modern Development</h1>

            <p>
              React • Spring Boot • Flutter • Node.js • MongoDB
            </p>

          </div>

        </motion.div>

      </div>

    </section>
  );
}

export default WhyChoose;