import "./FloatingCards.css";
import {
  FaLaptopCode,
  FaMobileAlt,
  FaShoppingCart,
  FaRocket,
} from "react-icons/fa";

function FloatingCards() {
  const cards = [
    {
      icon: <FaLaptopCode />,
      title: "Web Applications",
      desc: "Modern React & Next Generation Web Apps",
    },
    {
      icon: <FaMobileAlt />,
      title: "Mobile Apps",
      desc: "Android & iOS Applications",
    },
    {
      icon: <FaShoppingCart />,
      title: "E-Commerce",
      desc: "Complete Online Shopping Solutions",
    },
    {
      icon: <FaRocket />,
      title: "Software Solutions",
      desc: "Custom Business Software Development",
    },
  ];

  return (
    <section className="floating-section">

      <div className="floating-title">

        <span>OUR EXPERTISE</span>

        <h2>
          Everything You Need
          <br />
          To Build Your Business
        </h2>

        <p>
          We create premium digital products with modern technologies,
          clean architecture and exceptional user experiences.
        </p>

      </div>

      <div className="floating-grid">

        {cards.map((card, index) => (
          <div className="floating-box" key={index}>

            <div className="floating-icon">
              {card.icon}
            </div>

            <h3>{card.title}</h3>

            <p>{card.desc}</p>

          </div>
        ))}

      </div>

    </section>
  );
}

export default FloatingCards;