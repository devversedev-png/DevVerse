import { useCallback, useEffect, useState } from "react";

import "./studio/studio.css";

import StudioHeader from "./studio/StudioHeader";
import HeroReveal from "./studio/HeroReveal";
import SelectedWork from "./studio/SelectedWork";
import ServicesList from "./studio/ServicesList";
import HowWeWork from "./studio/HowWeWork";
import TeamIntro from "./studio/TeamIntro";
import Statement from "./studio/Statement";
import Comparison from "./studio/Comparison";
import Faq from "./studio/Faq";
import ContactSection from "./studio/ContactSection";
import InquiryDrawer from "./studio/InquiryDrawer";

function Home() {
  const [inquiryOpen, setInquiryOpen] = useState(false);

  const openInquiry = useCallback(() => setInquiryOpen(true), []);
  const closeInquiry = useCallback(() => setInquiryOpen(false), []);

  // The global stylesheet paints the body dark. Switch it to the studio
  // palette while the homepage is mounted, and restore it on the way out.
  useEffect(() => {
    document.body.classList.add("dv-studio-body");

    const previousTitle = document.title;
    document.title = "DevVerse | Websites, apps and software from Chennai";

    return () => {
      document.body.classList.remove("dv-studio-body");
      document.title = previousTitle;
    };
  }, []);

  return (
    <div className="dv-home">
      {/* inert keeps the page behind the drawer out of reach while it is open */}
      <div inert={inquiryOpen}>
        <StudioHeader onStart={openInquiry} />

        <main>
          <HeroReveal onStart={openInquiry} />

          <div className="dv-after">
            <Statement />
            <SelectedWork />
            <ServicesList />
            <Comparison />
            <HowWeWork onStart={openInquiry} />
            <TeamIntro />
            <Faq />
            <ContactSection onStart={openInquiry} />
          </div>
        </main>
      </div>

      <InquiryDrawer open={inquiryOpen} onClose={closeInquiry} />
    </div>
  );
}

export default Home;
