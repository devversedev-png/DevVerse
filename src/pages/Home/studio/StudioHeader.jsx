import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import markImage from "../../../assets/devverse-mark.png";

const homeNavItems = [
  { href: "#services", label: "Services" },
  { href: "#work", label: "Work" },
  { href: "#process", label: "Process" },
  { href: "#team", label: "About" },
  { href: "#faq", label: "FAQ" },
];

const pageNavItems = [
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Work" },
  { to: "/process", label: "Process" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

/* Anchor link on the homepage, router link on the other pages. */
function NavItem({ item, onClick }) {
  if (item.to) {
    return (
      <Link to={item.to} onClick={onClick}>
        {item.label}
      </Link>
    );
  }

  return (
    <a href={item.href} onClick={onClick}>
      {item.label}
    </a>
  );
}

function StudioHeader({ onStart, mode = "home" }) {
  const navItems = mode === "home" ? homeNavItems : pageNavItems;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const menuRef = useRef(null);

  const closeMenu = () => setMenuOpen(false);

  const startFromMenu = () => {
    setMenuOpen(false);
    onStart();
  };

  // Esc closes the menu and returns focus to the menu button.
  useEffect(() => {
    if (!menuOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    const onPointerDown = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !menuButtonRef.current?.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [menuOpen]);

  // If the window grows to desktop width, drop the open mobile menu.
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 900px)");
    const onChange = (event) => {
      if (event.matches) setMenuOpen(false);
    };

    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return (
    <header className="dv-header">
      <div className="dv-header__wrap">
        <div className="dv-header__bar">
          <Link
            to="/"
            className="dv-brand"
            aria-label="DevVerse home"
            onClick={closeMenu}
          >
            <img src={markImage} alt="" width="40" height="40" />
            <span className="dv-display">DevVerse</span>
          </Link>

          <nav className="dv-nav" aria-label="Primary">
            {navItems.map((item) => (
              <NavItem key={item.href || item.to} item={item} />
            ))}
          </nav>

          <div className="dv-header__actions">
            <span className="dv-header__ready">Ready to build?</span>

            <Link to="/chat" className="dv-textbtn dv-header__account">
              Chat
            </Link>

            <button
              type="button"
              className="dv-btn dv-btn--solid dv-header__cta"
              onClick={onStart}
            >
              Start a project
            </button>

            <button
              type="button"
              ref={menuButtonRef}
              className="dv-menubtn"
              aria-expanded={menuOpen}
              aria-controls="dv-mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                aria-hidden="true"
              >
                {menuOpen ? (
                  <path
                    d="M5 5l12 12M17 5L5 17"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                ) : (
                  <path
                    d="M4 8h14M4 14h14"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="dv-menu" id="dv-mobile-menu" ref={menuRef}>
            <nav aria-label="Mobile">
              {navItems.map((item) => (
                <NavItem
                  key={item.href || item.to}
                  item={item}
                  onClick={closeMenu}
                />
              ))}
              <Link to="/chat" onClick={closeMenu}>
                Chat with us
              </Link>
            </nav>

            <div className="dv-menu__foot">
              <button
                type="button"
                className="dv-btn dv-btn--solid"
                onClick={startFromMenu}
              >
                Start a project
              </button>

            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default StudioHeader;
