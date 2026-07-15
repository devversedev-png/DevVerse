import "./Home.css";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import Hero from "./Hero";
import FloatingCards from "./FloatingCards";
import ServicesPreview from "./ServicesPreview";
import Stats from "./Stats";
import WhyChoose from "./WhyChoose";
// import Projects from "./Projects";
import CTA from "./CTA";

function Home() {
  return (
    <div className="home-page">

      {/* Background Effects */}
      <div className="background-blur blur-one"></div>
      <div className="background-blur blur-two"></div>
      <div className="background-blur blur-three"></div>

      <Navbar />

      <Hero />

      <FloatingCards />

      <ServicesPreview />

      <Stats />

      <WhyChoose />

      {/* <Projects /> */}

      <CTA />

      <Footer />

    </div>
  );
}

export default Home;