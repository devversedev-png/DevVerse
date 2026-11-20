import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import { useVisitor } from "../../context/VisitorContext";

import "./VisitorGate.css";

/*
 * Asks visitors for an email so DevVerse can count visits per lead.
 * - Shows once per browser session (until the visitor enters an email).
 * - "Not now" hides it for the rest of the session.
 * - Never shown on /admin pages.
 */
function VisitorGate() {
  const { email, skipped, gateForced, saveEmail, skip } = useVisitor();
  const { pathname } = useLocation();

  const [ready, setReady] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const inputRef = useRef(null);
  // No pop-up on admin pages or on the shareable digital card.
  const isAdminArea =
    pathname.startsWith("/admin") || pathname.startsWith("/card");

  // Let the page appear first, then ask.
  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 1800);
    return () => clearTimeout(timer);
  }, []);

  const open =
    !isAdminArea && !email && (gateForced || (ready && !skipped));

  useEffect(() => {
    if (!open) return undefined;

    const focusTimer = setTimeout(() => inputRef.current?.focus(), 50);

    const onKeyDown = (event) => {
      if (event.key === "Escape") skip();
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, skip]);

  if (!open) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      setSaving(true);
      await saveEmail(value);
    } catch (err) {
      setError(err.message);
      inputRef.current?.focus();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="vg-root">
      <div className="vg-backdrop" onClick={skip} />

      <div
        className="vg-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="vg-title"
      >
        <h2 id="vg-title">Welcome to DevVerse</h2>

        <p className="vg-text">
          Leave your email and we can follow up about your idea. We count each
          visit by email, and we don&rsquo;t share it with anyone.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="vg-email">Your email address</label>

          <input
            id="vg-email"
            ref={inputRef}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            aria-invalid={error ? "true" : undefined}
            aria-describedby={error ? "vg-error" : undefined}
          />

          {error && (
            <p className="vg-error" id="vg-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="vg-primary" disabled={saving}>
            {saving ? "Saving\u2026" : "Continue"}
          </button>
        </form>

        <button type="button" className="vg-skip" onClick={skip}>
          Not now
        </button>
      </div>
    </div>
  );
}

export default VisitorGate;
