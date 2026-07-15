import "./ServiceDetails.css";

import { Link, useParams } from "react-router-dom";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import {
  FaLaptopCode,
  FaMobileAlt,
  FaShoppingCart,
  FaCode,
  FaCloud,
  FaPalette,
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";

const services = {
  "website-development": {
    icon: <FaLaptopCode />,
    label: "WEB DEVELOPMENT",
    title: "Website Development",
    subtitle:
      "Powerful digital experiences built for performance, scalability and growth.",

    aboutTitle: "What Is Website Development?",

    about:
      "Website development is the process of designing, building and maintaining websites and web applications that users can access through the internet. A professionally developed website acts as the digital foundation of a business, helping customers discover your brand, understand your services and connect with you.",

    aboutExtra:
      "At DevVerse, we build modern websites that are responsive, fast, secure and designed around real business goals. Whether you need a company website, customer portal or advanced web platform, we create solutions that deliver a smooth experience across desktop, tablet and mobile devices.",

    description:
      "We combine modern technology, thoughtful design and scalable architecture to create websites that help businesses establish a strong digital presence and grow confidently.",

    features: [
      "Responsive Website Development",
      "Modern UI / UX",
      "SEO-Friendly Structure",
      "High Performance",
      "API Integration",
      "Secure & Scalable Architecture",
    ],

    process: [
      "Understand your business requirements",
      "Plan the website structure and user journey",
      "Design a modern and responsive interface",
      "Develop the frontend and backend",
      "Test performance, security and responsiveness",
      "Deploy and provide ongoing support",
    ],

    technologies: [
      "React",
      "Vite",
      "Node.js",
      "Spring Boot",
      "MongoDB",
      "MySQL",
    ],
  },

  "mobile-applications": {
    icon: <FaMobileAlt />,
    label: "MOBILE DEVELOPMENT",
    title: "Mobile Applications",
    subtitle:
      "Modern mobile experiences designed to perform beautifully on every device.",

    aboutTitle: "What Is Mobile App Development?",

    about:
      "Mobile application development is the process of creating software applications designed to run on smartphones and tablets. Mobile apps allow businesses to provide their services directly to customers through fast, convenient and personalized digital experiences.",

    aboutExtra:
      "At DevVerse, we develop modern Android, iOS and cross-platform applications with intuitive interfaces and scalable backend systems. Our goal is to create applications that are easy to use, reliable and capable of growing with your business.",

    description:
      "From business applications to customer-facing platforms, we create mobile experiences that combine performance, usability and modern technology.",

    features: [
      "Android Applications",
      "iOS Applications",
      "Cross-Platform Development",
      "API Integration",
      "Push Notifications",
      "App Maintenance & Support",
    ],

    process: [
      "Understand the application idea and users",
      "Plan features and application architecture",
      "Create wireframes and UI / UX designs",
      "Develop the mobile application",
      "Connect APIs and backend services",
      "Test, deploy and maintain the application",
    ],

    technologies: [
      "Flutter",
      "React Native",
      "Java",
      "Node.js",
      "Firebase",
      "MongoDB",
    ],
  },

  "e-commerce-solutions": {
    icon: <FaShoppingCart />,
    label: "E-COMMERCE",
    title: "E-Commerce Solutions",
    subtitle:
      "Complete online shopping experiences built to convert visitors into customers.",

    aboutTitle: "What Is An E-Commerce Solution?",

    about:
      "An e-commerce solution is a digital platform that allows businesses to sell products or services online. It manages everything from product discovery and shopping carts to secure payments, orders and customer experiences.",

    aboutExtra:
      "At DevVerse, we create modern online stores designed for simplicity, security and growth. Our e-commerce solutions help businesses manage products, inventory, customers and orders while providing shoppers with a smooth purchasing experience.",

    description:
      "We build scalable e-commerce platforms that help businesses sell online efficiently while delivering secure and convenient shopping experiences.",

    features: [
      "Product Management",
      "Secure Payment Integration",
      "Shopping Cart & Checkout",
      "Inventory Management",
      "Order Tracking",
      "Analytics & Reporting",
    ],

    process: [
      "Understand your products and business model",
      "Plan the customer shopping journey",
      "Design the storefront and checkout experience",
      "Develop product and order management",
      "Integrate secure payment services",
      "Test, deploy and optimize the store",
    ],

    technologies: [
      "React",
      "Node.js",
      "Spring Boot",
      "MongoDB",
      "MySQL",
      "Payment APIs",
    ],
  },

  "custom-software": {
    icon: <FaCode />,
    label: "CUSTOM SOFTWARE",
    title: "Custom Software Development",
    subtitle:
      "Software designed specifically around your business processes and goals.",

    aboutTitle: "What Is Custom Software Development?",

    about:
      "Custom software development is the process of creating software specifically for the unique requirements of a business. Unlike ready-made software, a custom solution is designed around your workflows, users and operational challenges.",

    aboutExtra:
      "At DevVerse, we analyze how your business works and create software that simplifies operations, reduces repetitive work and improves productivity. The result is a solution built specifically for the way your organization operates.",

    description:
      "We transform complex business requirements into secure, scalable and easy-to-use software solutions that support long-term growth.",

    features: [
      "Business Process Automation",
      "Custom Dashboards",
      "ERP Integrations",
      "API Development",
      "Role-Based Access",
      "Long-Term Support",
    ],

    process: [
      "Analyze existing business processes",
      "Identify challenges and automation opportunities",
      "Design the software architecture",
      "Develop required modules and integrations",
      "Test with real business workflows",
      "Deploy, improve and provide support",
    ],

    technologies: [
      "Java",
      "Spring Boot",
      "React",
      "Node.js",
      "Python",
      "MySQL",
    ],
  },

  "cloud-solutions": {
    icon: <FaCloud />,
    label: "CLOUD SOLUTIONS",
    title: "Cloud Solutions",
    subtitle:
      "Secure, scalable and reliable infrastructure for modern applications.",

    aboutTitle: "What Are Cloud Solutions?",

    about:
      "Cloud solutions allow applications, databases and digital services to run on internet-based infrastructure instead of depending entirely on local servers. This provides businesses with greater flexibility, accessibility and scalability.",

    aboutExtra:
      "At DevVerse, we help deploy and manage applications using modern cloud infrastructure. We focus on reliable deployment, application availability and infrastructure that can grow as your users and business requirements increase.",

    description:
      "We help businesses build reliable deployment environments for modern applications while improving scalability and operational efficiency.",

    features: [
      "Cloud Deployment",
      "Application Hosting",
      "Database Management",
      "Docker Deployment",
      "Performance Monitoring",
      "Scalable Infrastructure",
    ],

    process: [
      "Analyze the application requirements",
      "Choose the appropriate infrastructure",
      "Prepare the deployment environment",
      "Deploy applications and databases",
      "Configure monitoring and security",
      "Maintain and scale the infrastructure",
    ],

    technologies: [
      "AWS",
      "Docker",
      "Linux",
      "MongoDB Atlas",
      "Git",
      "CI / CD",
    ],
  },

  "ui-ux-design": {
    icon: <FaPalette />,
    label: "UI / UX DESIGN",
    title: "UI / UX Design",
    subtitle:
      "Beautiful digital experiences designed around real users and business goals.",

    aboutTitle: "What Is UI / UX Design?",

    about:
      "UI and UX design focus on how a digital product looks, feels and works. UI, or User Interface design, focuses on the visual appearance of a product, while UX, or User Experience design, focuses on making the product simple, intuitive and enjoyable to use.",

    aboutExtra:
      "At DevVerse, we design digital experiences that balance visual quality with usability. Every screen, interaction and user journey is carefully planned to help users understand and navigate the product naturally.",

    description:
      "We transform ideas into clean, modern and user-friendly interfaces that strengthen your brand and improve the overall digital experience.",

    features: [
      "User Interface Design",
      "User Experience Design",
      "Wireframes",
      "Interactive Prototypes",
      "Responsive Design",
      "Design Systems",
    ],

    process: [
      "Understand the product and target users",
      "Research user needs and requirements",
      "Create the information architecture",
      "Design wireframes and user flows",
      "Create high-fidelity visual designs",
      "Build prototypes and refine the experience",
    ],

    technologies: [
      "Figma",
      "Prototyping",
      "Wireframing",
      "Design Systems",
      "Responsive UI",
      "User Research",
    ],
  },
};

function ServiceDetails() {
  const { slug } = useParams();

  const service = services[slug];

  if (!service) {
    return (
      <>
        <Navbar />

        <main className="service-not-found">
          <h1>Service Not Found</h1>

          <p>
            The service you are looking for does not exist.
          </p>

          <Link to="/services">
            <FaArrowLeft />
            Back to Services
          </Link>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="service-details-page">
        <div className="service-details-glow glow-left" />
        <div className="service-details-glow glow-right" />

        {/* =========================
            HERO
        ========================= */}

        <section className="service-details-hero">
          <Link
            to="/services"
            className="back-to-services"
          >
            <FaArrowLeft />
            Back to Services
          </Link>

          <div className="service-details-icon">
            {service.icon}
          </div>

          <span className="service-details-label">
            {service.label}
          </span>

          <h1>{service.title}</h1>

          <p className="service-details-subtitle">
            {service.subtitle}
          </p>
        </section>

        {/* =========================
            WHAT IS THIS SERVICE?
        ========================= */}

        <section className="service-about-section">
          <div className="service-about-content">
            <span className="service-section-label">
              UNDERSTANDING THE SERVICE
            </span>

            <h2>{service.aboutTitle}</h2>

            <p>{service.about}</p>

            <p>{service.aboutExtra}</p>
          </div>

          <div className="service-about-visual">
            <div className="service-visual-glow" />

            <div className="service-visual-card">
              <div className="service-visual-icon">
                {service.icon}
              </div>

              <span>{service.label}</span>

              <h3>
                Ideas Into
                <br />
                Digital Experiences
              </h3>

              <div className="service-visual-lines">
                <div />
                <div />
                <div />
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            WHAT WE DELIVER
        ========================= */}

        <section className="service-overview">
          <div className="service-overview-content">
            <span>WHAT WE DELIVER</span>

            <h2>
              Built Around
              <br />
              Your Business
            </h2>

            <p>{service.description}</p>

            <Link
              to="/contact"
              className="service-contact-btn"
            >
              Start Your Project
              <FaArrowRight />
            </Link>
          </div>

          <div className="service-features">
            {service.features.map((feature) => (
              <div
                className="service-feature-card"
                key={feature}
              >
                <FaCheckCircle />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </section>

        {/* =========================
            DEVELOPMENT PROCESS
        ========================= */}

        <section className="service-process-section">
          <div className="service-process-heading">
            <span className="service-section-label">
              HOW WE WORK
            </span>

            <h2>
              From Idea To
              <br />
              Digital Product
            </h2>

            <p>
              Every project follows a structured process
              designed to maintain quality, transparency
              and continuous progress.
            </p>
          </div>

          <div className="service-process-list">
            {service.process.map((step, index) => (
              <div
                className="service-process-card"
                key={step}
              >
                <div className="service-process-number">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div>
                  <span>STEP {index + 1}</span>
                  <h3>{step}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================
            TECHNOLOGIES
        ========================= */}

        <section className="service-tech-section">
          <span className="service-section-label">
            OUR TECHNOLOGY
          </span>

          <h2>Tools We Use To Build</h2>

          <div className="service-tech-grid">
            {service.technologies.map((technology) => (
              <div
                className="service-tech-card"
                key={technology}
              >
                {technology}
              </div>
            ))}
          </div>
        </section>

        {/* =========================
            CTA
        ========================= */}

        <section className="service-details-cta">
          <span>LET'S BUILD TOGETHER</span>

          <h2>
            Have A Project
            <br />
            In Mind?
          </h2>

          <p>
            Tell us about your idea and let's transform it
            into a powerful digital product.
          </p>

          <Link to="/contact">
            Start a Conversation
            <FaArrowRight />
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default ServiceDetails;