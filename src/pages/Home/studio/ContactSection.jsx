import { Link } from "react-router-dom";

import { contact, socials } from "../../../data/site";

function ContactSection({ onStart }) {
  return (
    <>
      <section
        className="dv-contact"
        id="contact"
        aria-labelledby="contact-title"
      >
        <div className="dv-container dv-contact__grid">
          <div>
            <h2 className="dv-display dv-contact__title" id="contact-title">
              Have an idea? Let&rsquo;s talk.
            </h2>
            <p className="dv-contact__text">
              You don&rsquo;t need to have everything figured out. Tell us what
              you&rsquo;re planning and we&rsquo;ll help you find the best way
              to move forward.
            </p>

            <div className="dv-contact__actions">
              <button
                type="button"
                className="dv-btn dv-btn--solid dv-btn--arrow"
                onClick={onStart}
              >
                Start a project
              </button>
              <Link className="dv-btn dv-btn--ghost" to="/chat">
                Chat with us
              </Link>
            </div>
          </div>

          <dl className="dv-contact__details">
            <div>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>
                <a href={contact.phoneHref}>{contact.phone}</a>
              </dd>
            </div>
            <div>
              <dt>Based in</dt>
              <dd>{contact.location}</dd>
            </div>
            <div>
              <dt>Elsewhere</dt>
              <dd className="dv-contact__socials">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {social.label}
                  </a>
                ))}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <footer className="dv-footer">
        <p className="dv-wordmark dv-display" aria-hidden="true">
          DevVerse
        </p>

        <div className="dv-container dv-footer__row">
          <p>&copy; 2026 DevVerse. All rights reserved.</p>
          <nav aria-label="Footer">
            <Link to="/services">Services</Link>
            <Link to="/portfolio">Portfolio</Link>
            <Link to="/process">Process</Link>
            <Link to="/about">About us</Link>
            <Link to="/contact">Contact</Link>
          </nav>
        </div>
      </footer>
    </>
  );
}

export default ContactSection;
