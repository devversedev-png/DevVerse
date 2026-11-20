import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

/*
 * React Router keeps the old scroll position when the page changes.
 * This sends every new page to the top, or to the #section in the link.
 * The jump is instant on purpose, because the homepage turns on smooth scrolling.
 */
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1));

      if (target) {
        target.scrollIntoView({ behavior: "auto", block: "start" });
        return;
      }
    }

    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash]);

  return null;
}

export default ScrollToTop;
