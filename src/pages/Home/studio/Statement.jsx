import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";

const lines = [
  "Most websites are just templates.",
  "We\u2019d rather build one that fits your idea.",
  "Made by a small team you can talk to directly.",
];

function Word({ word, progress, range }) {
  const opacity = useTransform(progress, range, [0.16, 1], { clamp: true });

  return <motion.span style={{ opacity }}>{word} </motion.span>;
}

function Statement() {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "end 0.6"],
  });

  const words = lines.flatMap((line, lineIndex) =>
    line.split(" ").map((word) => ({ word, lineIndex }))
  );

  return (
    <section className="dv-statement" aria-label="Why DevVerse">
      <div className="dv-container">
        <p className="dv-display dv-statement__text" ref={ref}>
          {reduceMotion
            ? lines.map((line) => (
                <span className="dv-statement__line" key={line}>
                  {line}
                </span>
              ))
            : lines.map((line, lineIndex) => (
                <span className="dv-statement__line" key={line}>
                  {words
                    .map((item, index) => ({ ...item, index }))
                    .filter((item) => item.lineIndex === lineIndex)
                    .map((item) => {
                      const start = (item.index / words.length) * 0.85;
                      return (
                        <Word
                          key={item.index}
                          word={item.word}
                          progress={scrollYProgress}
                          range={[start, start + 0.15]}
                        />
                      );
                    })}
                </span>
              ))}
        </p>
      </div>
    </section>
  );
}

export default Statement;
