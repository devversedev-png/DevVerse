import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
  easeInOut,
} from "framer-motion";

import { projects, stack } from "../../../data/site";
import markImage from "../../../assets/devverse-mark.png";
import ProjectPreview from "./ProjectPreview";
import { useMediaQuery } from "./hooks";

/* The hero lives at full size first, then scales into the centre tile. */
const TILE_SCALE = 0.36;
const SHRINK_END = 0.55;

function HeroContent({ onStart, interactive = true }) {
  return (
    <div className="dv-hero">
      <h1 className="dv-display dv-hero__title">
        Your next idea deserves a great website.
      </h1>

      <div className="dv-hero__lower">
        <div className="dv-hero__copy">
          <p className="dv-hero__lede">
            We&rsquo;re DevVerse, a young team of five developers in Chennai
            building websites, mobile apps, online stores and custom software.
          </p>

          <div className="dv-hero__actions" inert={!interactive}>
            <button
              type="button"
              className="dv-btn dv-btn--solid"
              onClick={onStart}
            >
              Start a project
            </button>
            <a className="dv-btn dv-btn--ghost" href="#work">
              View our work
            </a>
          </div>
        </div>

      </div>

      <div className="dv-marquee" role="group" aria-label="Technologies we use">
        <div className="dv-marquee__track">
          {[...stack, ...stack].map((item, index) => (
            <span
              className="dv-display"
              key={`${item}-${index}`}
              aria-hidden={index >= stack.length ? "true" : undefined}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* One tile of the mosaic. It slides out from behind the hero as it grows in. */
function MosaicTile({ progress, order, from, className, children }) {
  const start = 0.1 + order * 0.035;
  const end = start + 0.36;

  const opacity = useTransform(progress, [start, end], [0, 1], {
    clamp: true,
  });
  const scale = useTransform(progress, [start, end], [0.82, 1], {
    clamp: true,
    ease: easeInOut,
  });
  const x = useTransform(progress, [start, end], [from.x, "0%"], {
    clamp: true,
    ease: easeInOut,
  });
  const y = useTransform(progress, [start, end], [from.y, "0%"], {
    clamp: true,
    ease: easeInOut,
  });

  return (
    <motion.div
      className={`dv-tile ${className}`}
      style={{ opacity, scale, x, y }}
    >
      {children}
    </motion.div>
  );
}

function ProjectTile({ project, interval }) {
  return (
    <>
      <ProjectPreview project={project} interval={interval} />
      <span className="dv-tile__chip">{project.title}</span>
    </>
  );
}

function PinnedReveal({ onStart }) {
  const sectionRef = useRef(null);
  const [heroLive, setHeroLive] = useState(true);
  const [ctaLive, setCtaLive] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const scale = useTransform(
    scrollYProgress,
    [0, SHRINK_END],
    [1, TILE_SCALE],
    { clamp: true, ease: easeInOut }
  );

  // Keep the visible corner radius around 20px as the tile shrinks.
  const borderRadius = useTransform(
    scrollYProgress,
    [0, SHRINK_END],
    [0, 20 / TILE_SCALE],
    { clamp: true }
  );

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setHeroLive(value < 0.08);
    setCtaLive(value > 0.75);
  });

  const [mobileApp, shop, dashboard, soon] = projects;

  return (
    <section
      className="dv-reveal"
      ref={sectionRef}
      aria-label="Introduction and a preview of our work"
    >
      <div className="dv-reveal__stage">
        <div className="dv-mosaic">
          <MosaicTile
            progress={scrollYProgress}
            order={0}
            from={{ x: "45%", y: "45%" }}
            className="dv-tile--a"
          >
            <div aria-hidden="true" className="dv-tile__fill">
              <ProjectTile project={mobileApp} interval={4200} />
            </div>
          </MosaicTile>

          <MosaicTile
            progress={scrollYProgress}
            order={1}
            from={{ x: "0%", y: "55%" }}
            className="dv-tile--b"
          >
            <div aria-hidden="true" className="dv-tile__fill">
              <ProjectTile project={shop} interval={4900} />
            </div>
          </MosaicTile>

          <MosaicTile
            progress={scrollYProgress}
            order={2}
            from={{ x: "-45%", y: "45%" }}
            className="dv-tile--c"
          >
            <div aria-hidden="true" className="dv-tile__fill dv-tile--text dv-tile--sand">
              <p className="dv-tile__kicker">What we build with</p>
              <p className="dv-tile__stack">{stack.join(", ")}</p>
            </div>
          </MosaicTile>

          <MosaicTile
            progress={scrollYProgress}
            order={3}
            from={{ x: "55%", y: "0%" }}
            className="dv-tile--d"
          >
            <div aria-hidden="true" className="dv-tile__fill dv-tile--text dv-tile--dark">
              <p className="dv-tile__big">Five developers</p>
              <p className="dv-tile__small">Based in Chennai</p>
            </div>
          </MosaicTile>

          <MosaicTile
            progress={scrollYProgress}
            order={4}
            from={{ x: "-55%", y: "0%" }}
            className="dv-tile--e"
          >
            <div aria-hidden="true" className="dv-tile__fill">
              <ProjectTile project={dashboard} interval={5300} />
            </div>
          </MosaicTile>

          <MosaicTile
            progress={scrollYProgress}
            order={5}
            from={{ x: "45%", y: "-45%" }}
            className="dv-tile--f"
          >
            <div aria-hidden="true" className="dv-tile__fill dv-tile--logo">
              <img src={markImage} alt="" width="192" height="192" />
            </div>
          </MosaicTile>

          <MosaicTile
            progress={scrollYProgress}
            order={6}
            from={{ x: "0%", y: "-55%" }}
            className="dv-tile--g"
          >
            <div aria-hidden="true" className="dv-tile__fill">
              <ProjectTile project={soon} interval={5000} />
            </div>
          </MosaicTile>

          <MosaicTile
            progress={scrollYProgress}
            order={7}
            from={{ x: "-45%", y: "-45%" }}
            className="dv-tile--h"
          >
            <div className="dv-tile__fill dv-tile--text dv-tile--bronze">
              <p className="dv-tile__big">Have an idea?</p>
              <button
                type="button"
                className="dv-btn dv-btn--light"
                onClick={onStart}
                inert={!ctaLive}
              >
                Start a project
              </button>
            </div>
          </MosaicTile>
        </div>

        <motion.div
          className="dv-hero-tile"
          style={{ scale, borderRadius }}
        >
          <HeroContent onStart={onStart} interactive={heroLive} />
        </motion.div>
      </div>
    </section>
  );
}

/*
 * Phones and reduced-motion visitors skip the pinned animation.
 * - Phones: the hero stays put (sticky) and the work section slides over it.
 * - Reduced motion: the hero is a normal block, then the work follows.
 */
function FlowHero({ onStart, sheet }) {
  return (
    <section
      className={sheet ? "dv-flow dv-flow--sheet" : "dv-flow"}
      aria-label="Introduction"
    >
      <HeroContent onStart={onStart} />
    </section>
  );
}

function HeroReveal({ onStart }) {
  const reduceMotion = useReducedMotion();
  const isPhone = useMediaQuery("(max-width: 767px)");

  if (reduceMotion) {
    return <FlowHero onStart={onStart} sheet={false} />;
  }

  if (isPhone) {
    return <FlowHero onStart={onStart} sheet />;
  }

  return <PinnedReveal onStart={onStart} />;
}

export default HeroReveal;
