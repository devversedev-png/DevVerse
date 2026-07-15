import "./Stats.css";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaProjectDiagram,
  FaLaptopCode,
  FaAward
} from "react-icons/fa";

const stats = [
  {
    icon: <FaUsers />,
    value: "5+",
    title: "Team Members",
    subtitle: "Passionate Developers"
  },
  {
    icon: <FaProjectDiagram />,
    value: "6",
    title: "Core Services",
    subtitle: "Built for Modern Businesses"
  },
  {
    icon: <FaLaptopCode />,
    value: "100%",
    title: "Custom Solutions",
    subtitle: "Designed Around Your Needs"
  },
  {
    icon: <FaAward />,
    value: "24/7",
    title: "Driven to Build",
    subtitle: "Learning, Creating & Growing"
  }
];

function Stats() {
  return (
    <section className="stats">

      <div className="stats-heading">

        <span>WHO WE ARE</span>

        <h2>

          Small Team.

          <br />

          Big Dreams.

        </h2>

        <p>
          We are a growing software team focused on building modern,
          reliable and scalable digital solutions for businesses.
        </p>

      </div>

      <div className="stats-grid">

        {stats.map((item, index) => (

          <motion.div
            key={index}
            className="stats-card"
            whileHover={{ y: -12 }}
            transition={{ duration: .3 }}
          >

            <div className="stats-icon">

              {item.icon}

            </div>

            <h1>

              {item.value}

            </h1>

            <h3>

              {item.title}

            </h3>

            <p>

              {item.subtitle}

            </p>

          </motion.div>

        ))}

      </div>

    </section>
  );
}

export default Stats;