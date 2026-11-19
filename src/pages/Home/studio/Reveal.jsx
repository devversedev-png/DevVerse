import { motion, useReducedMotion } from "framer-motion";

/*
 * Fades and lifts content in as it scrolls into view.
 * Renders a plain element when the visitor prefers reduced motion.
 */
function Reveal({ as = "div", delay = 0, children, ...rest }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    const Plain = as;
    return <Plain {...rest}>{children}</Plain>;
  }

  const Animated = motion[as];

  return (
    <Animated
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </Animated>
  );
}

export default Reveal;
