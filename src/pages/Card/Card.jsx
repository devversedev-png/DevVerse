import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaPhoneAlt,
  FaWhatsapp,
  FaEnvelope,
  FaGlobe,
  FaMapMarkerAlt,
  FaLinkedinIn,
  FaInstagram,
  FaGithub,
  FaShareAlt,
  FaDownload,
  FaRegCopy,
} from "react-icons/fa";

import QrCode from "../../components/QrCode";
import logo from "../../assets/devverse-logo.png";
import { contact, services, site, socials } from "../../data/site";

import "./Card.css";

const socialIcons = {
  LinkedIn: FaLinkedinIn,
  Instagram: FaInstagram,
  GitHub: FaGithub,
};

const TAGLINE =
  "A young team of five developers building websites, mobile apps, online stores and custom software.";

function buildVCard(siteUrl) {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "FN:DevVerse",
    "N:;DevVerse;;;",
    "ORG:DevVerse",
    "TITLE:Websites, apps and software",
    `TEL;TYPE=WORK,VOICE:${contact.phone.replace(/\s/g, "")}`,
    `EMAIL;TYPE=INTERNET:${contact.email}`,
    `URL:${siteUrl}`,
    "ADR;TYPE=WORK:;;;Chennai;Tamil Nadu;;India",
    "NOTE:Websites, mobile apps, online stores and custom software from Chennai.",
    "END:VCARD",
  ];

  return lines.join("\r\n");
}

function Card() {
  // The QR code, "Copy link" and "Share" all open the DevVerse home page.
  const siteUrl = site.url.replace(/\/$/, "");
  const siteLabel = siteUrl.replace(/^https?:\/\//, "");

  const [notice, setNotice] = useState("");

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "DevVerse | Digital card";

    return () => {
      document.title = previousTitle;
    };
  }, []);

  useEffect(() => {
    if (!notice) return undefined;

    const timer = setTimeout(() => setNotice(""), 2600);
    return () => clearTimeout(timer);
  }, [notice]);

  const saveContact = () => {
    const blob = new Blob([buildVCard(siteUrl)], {
      type: "text/vcard;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "DevVerse.vcf";
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice("Contact file downloaded. Open it to add DevVerse.");
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(siteUrl);
      setNotice("Website link copied.");
    } catch {
      setNotice("Could not copy. Long-press the link to copy it.");
    }
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "DevVerse",
          text: "DevVerse: websites, apps and software from Chennai.",
          url: siteUrl,
        });
        return;
      } catch (error) {
        if (error && error.name === "AbortError") return;
      }
    }

    copyLink();
  };

  const actions = [
    {
      label: "Call",
      detail: contact.phone,
      href: contact.phoneHref,
      Icon: FaPhoneAlt,
    },
    {
      label: "WhatsApp",
      detail: "Chat on WhatsApp",
      href: contact.whatsappHref,
      Icon: FaWhatsapp,
      external: true,
    },
    {
      label: "Email",
      detail: contact.email,
      href: `mailto:${contact.email}`,
      Icon: FaEnvelope,
    },
    {
      label: "Website",
      detail: siteLabel,
      href: siteUrl,
      Icon: FaGlobe,
      external: true,
    },
    {
      label: "Location",
      detail: contact.location,
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        "Chennai, Tamil Nadu, India"
      )}`,
      Icon: FaMapMarkerAlt,
      external: true,
    },
  ];

  return (
    <main className="dc-page">
      <article className="dc-card">
        <header className="dc-hero">
          <img className="dc-logo" src={logo} alt="DevVerse" />
          <h1>DevVerse</h1>
          <p className="dc-role">Websites, apps and software</p>
          <p className="dc-place">
            <FaMapMarkerAlt aria-hidden="true" /> Chennai, Tamil Nadu
          </p>
        </header>

        <div className="dc-body">
          <p className="dc-about">{TAGLINE}</p>

          <div className="dc-primary">
            <button type="button" className="dc-btn dc-btn--solid" onClick={saveContact}>
              <FaDownload aria-hidden="true" /> Save contact
            </button>
            <button type="button" className="dc-btn dc-btn--ghost" onClick={share}>
              <FaShareAlt aria-hidden="true" /> Share
            </button>
          </div>

          <p className="dc-notice" role="status" aria-live="polite">
            {notice}
          </p>

          <ul className="dc-actions">
            {actions.map(({ label, detail, href, Icon, external, internal }) => (
              <li key={label}>
                {internal ? (
                  <Link className="dc-action" to={href}>
                    <span className="dc-action__icon" aria-hidden="true">
                      <Icon />
                    </span>
                    <span className="dc-action__text">
                      <strong>{label}</strong>
                      <small>{detail}</small>
                    </span>
                  </Link>
                ) : (
                  <a
                    className="dc-action"
                    href={href}
                    {...(external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    <span className="dc-action__icon" aria-hidden="true">
                      <Icon />
                    </span>
                    <span className="dc-action__text">
                      <strong>{label}</strong>
                      <small>{detail}</small>
                    </span>
                  </a>
                )}
              </li>
            ))}
          </ul>

          <section className="dc-section" aria-labelledby="dc-services">
            <h2 id="dc-services">What we build</h2>
            <ul className="dc-chips">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link to={`/services/${service.slug}`}>{service.title}</Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="dc-section" aria-labelledby="dc-social">
            <h2 id="dc-social">Follow us</h2>
            <ul className="dc-social">
              {socials.map((social) => {
                const Icon = socialIcons[social.label] || FaGlobe;

                return (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${social.label} (opens in a new tab)`}
                    >
                      <Icon aria-hidden="true" />
                      <span>{social.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="dc-qr" aria-labelledby="dc-qr-title">
            <QrCode
              className="dc-qr__code"
              value={siteUrl}
              label={`QR code that opens ${siteLabel}`}
            />
            <div>
              <h2 id="dc-qr-title">Scan to visit our website</h2>
              <p>Point a phone camera at the code to open the DevVerse home page.</p>
              <button type="button" className="dc-copy" onClick={copyLink}>
                <FaRegCopy aria-hidden="true" /> Copy link
              </button>
            </div>
          </section>

          <Link className="dc-btn dc-btn--solid dc-start" to="/contact">
            Start a project with us
          </Link>
        </div>

        <footer className="dc-foot">
          <Link to="/">Visit the full website</Link>
          <span>&copy; 2026 DevVerse</span>
        </footer>
      </article>
    </main>
  );
}

export default Card;
