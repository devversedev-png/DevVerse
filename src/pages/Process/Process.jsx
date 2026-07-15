import "./Process.css";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";

import {
  FaComments,
  FaLightbulb,
  FaPalette,
  FaCode,
  FaVial,
  FaRocket,
  FaHeadset,
  FaArrowRight,
  FaCheckCircle
} from "react-icons/fa";

const processSteps = [
  {
    number: "01",
    icon: <FaComments />,
    title: "Discovery & Discussion",
    description:
      "We begin by understanding your idea, business goals, target audience and project requirements.",
    points: [
      "Understand your vision",
      "Identify project goals",
      "Discuss requirements"
    ]
  },
  {
    number: "02",
    icon: <FaLightbulb />,
    title: "Planning & Strategy",
    description:
      "We create a clear development roadmap and choose the right technologies for your project.",
    points: [
      "Project roadmap",
      "Technology selection",
      "Feature planning"
    ]
  },
  {
    number: "03",
    icon: <FaPalette />,
    title: "UI / UX Design",
    description:
      "We design clean, modern and user-friendly interfaces focused on delivering a great experience.",
    points: [
      "Wireframes",
      "Visual design",
      "Responsive experience"
    ]
  },
  {
    number: "04",
    icon: <FaCode />,
    title: "Development",
    description:
      "Our team transforms the approved design into a secure, scalable and high-performance product.",
    points: [
      "Clean development",
      "Modern technologies",
      "Regular progress updates"
    ]
  },
  {
    number: "05",
    icon: <FaVial />,
    title: "Testing & Quality",
    description:
      "We carefully test the product across devices and scenarios to ensure quality and reliability.",
    points: [
      "Functional testing",
      "Responsive testing",
      "Performance checks"
    ]
  },
  {
    number: "06",
    icon: <FaRocket />,
    title: "Launch & Deployment",
    description:
      "Once everything is ready, we deploy your product and make it available to your users.",
    points: [
      "Production deployment",
      "Final verification",
      "Successful launch"
    ]
  }
];

function Process() {
  return (
    <>
      <Navbar />

      <main className="process-page">

        {/* HERO */}

        <section className="process-hero">
          <span className="process-label">HOW WE WORK</span>

          <h1>
            From Your First Idea
            <br />
            To A <span>Digital Product.</span>
          </h1>

          <p>
            A simple, transparent and collaborative process designed to turn
            your ideas into reliable digital experiences.
          </p>
        </section>

        {/* PROCESS INTRO */}

        <section className="process-intro">

          <div className="process-intro-content">
            <span>OUR APPROACH</span>

            <h2>
              Clear Process.
              <br />
              Better Results.
            </h2>
          </div>

          <p>
            We believe great products are built through communication,
            planning and collaboration. You stay informed throughout the
            journey while we focus on turning your requirements into a
            polished solution.
          </p>

        </section>

        {/* PROCESS STEPS */}

        <section className="process-timeline">

          <div className="process-line"></div>

          {processSteps.map((step, index) => (
            <article
              className={`process-step ${index % 2 === 0 ? "process-step-left" : "process-step-right"
                }`}
              key={index}
            >

              <div className="process-step-marker">
                <span>{step.number}</span>
              </div>

              <div className="process-step-card">

                <div className="process-step-top">

                  <div className="process-step-icon">
                    {step.icon}
                  </div>

                  <span className="process-step-number">
                    STEP {step.number}
                  </span>

                </div>

                <h3>{step.title}</h3>

                <p>{step.description}</p>

                <div className="process-step-points">

                  {step.points.map((point, pointIndex) => (
                    <div key={pointIndex}>
                      <FaCheckCircle />
                      <span>{point}</span>
                    </div>
                  ))}

                </div>

              </div>

            </article>
          ))}

        </section>

        {/* SUPPORT */}

        <section className="process-support">

          <div className="process-support-icon">
            <FaHeadset />
          </div>

          <div className="process-support-content">
            <span>AFTER LAUNCH</span>

            <h2>
              We Don't Disappear
              <span> After Deployment.</span>
            </h2>

            <p>
              After your product goes live, we can continue supporting,
              maintaining and improving it as your business grows.
            </p>
          </div>

        </section>

        {/* CTA */}

        <section className="process-cta">

          <span>READY TO GET STARTED?</span>

          <h2>
            Let's Build Your
            <br />
            <span>Next Big Idea.</span>
          </h2>

          <p>
            Tell us what you're planning. We'll discuss your requirements
            and help you find the right way to bring your idea to life.
          </p>

          <Link to="/contact">
            Start A Conversation
            <FaArrowRight />
          </Link>

        </section>

      </main>

      <Footer />
    </>
  );
}

export default Process;