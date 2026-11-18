import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { sendContactMessage } from "../../../services/contactApi";
import { useVisitor } from "../../../context/VisitorContext";
import { budgetOptions, contact, projectTypeOptions } from "../../../data/site";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  projectType: "",
  budget: "",
  message: "",
};

function validate(form) {
  const errors = {};

  if (!form.name.trim()) {
    errors.name = "Please enter your name.";
  }

  if (!form.email.trim()) {
    errors.email = "Please enter your email address.";
  } else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
    errors.email = "That email address doesn\u2019t look right. Check it and try again.";
  }

  if (!form.message.trim()) {
    errors.message = "Tell us a little about your project so we know where to start.";
  }

  return errors;
}

function InquiryDrawer({ open, onClose }) {
  const { email: visitorEmail } = useVisitor();
  const reduceMotion = useReducedMotion();
  const uid = useId();

  const prefill = () => ({
    ...emptyForm,
    email: visitorEmail || "",
  });

  const [form, setForm] = useState(prefill);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent
  const [serverError, setServerError] = useState("");

  const panelRef = useRef(null);
  const successRef = useRef(null);
  const returnFocusRef = useRef(null);

  // Fill in the email once the visitor has shared it.
  useEffect(() => {
    if (!visitorEmail) return;

    setForm((current) => ({
      ...current,
      email: current.email || visitorEmail,
    }));
  }, [visitorEmail]);

  // Focus, scroll lock, Esc and Tab handling while the drawer is open.
  useEffect(() => {
    if (!open) return undefined;

    returnFocusRef.current = document.activeElement;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = setTimeout(() => {
      const first = panelRef.current?.querySelector("input, button");
      first?.focus();
    }, 60);

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const items = Array.from(
        panelRef.current.querySelectorAll(FOCUSABLE)
      ).filter((el) => el.offsetParent !== null);

      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;

      const target = returnFocusRef.current;
      if (target && typeof target.focus === "function") {
        target.focus();
      }
    };
  }, [open, onClose]);

  // Move focus to the confirmation so screen readers announce it.
  useEffect(() => {
    if (status === "sent") {
      successRef.current?.focus();
    }
  }, [status]);

  const setField = (field) => (event) => {
    const value = event.target.value;

    setForm((current) => ({ ...current, [field]: value }));

    if (errors[field]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const found = validate(form);
    setErrors(found);
    setServerError("");

    const firstInvalid = Object.keys(found)[0];

    if (firstInvalid) {
      panelRef.current
        ?.querySelector(`[name="${firstInvalid}"]`)
        ?.focus();
      return;
    }

    try {
      setStatus("sending");

      // Same request the existing Contact page sends.
      await sendContactMessage({
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      });

      setForm(prefill());
      setStatus("sent");
    } catch (err) {
      setServerError(
        err?.message ||
          "We couldn\u2019t send your message. Please try again, or email us directly."
      );
      setStatus("idle");
    }
  };

  const sendAnother = () => {
    setStatus("idle");
    setErrors({});
    setServerError("");
  };

  const duration = reduceMotion ? 0 : 0.38;

  const field = (name) => ({
    id: `${uid}-${name}`,
    name,
    value: form[name],
    onChange: setField(name),
    "aria-invalid": errors[name] ? "true" : undefined,
    "aria-describedby": errors[name] ? `${uid}-${name}-error` : undefined,
  });

  const fieldError = (name) =>
    errors[name] ? (
      <p className="dv-field__error" id={`${uid}-${name}-error`}>
        {errors[name]}
      </p>
    ) : null;

  return (
    <AnimatePresence>
      {open && (
        <div className="dv-drawer-root">
          <motion.div
            className="dv-drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration }}
            onClick={onClose}
          />

          <motion.aside
            className="dv-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${uid}-title`}
            ref={panelRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration, ease: [0.32, 0.72, 0, 1] }}
          >
            <div className="dv-drawer__top">
              <h2 className="dv-display" id={`${uid}-title`}>
                Start a project
              </h2>
              <button
                type="button"
                className="dv-drawer__close"
                onClick={onClose}
                aria-label="Close the project form"
              >
                <span>Close</span>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {status === "sent" ? (
              <div className="dv-drawer__done" role="status">
                <h3
                  className="dv-display"
                  tabIndex={-1}
                  ref={successRef}
                >
                  Message sent. Thank you!
                </h3>
                <p>
                  We&rsquo;ve received your enquiry and will get back to you as
                  soon as we can.
                </p>
                <div className="dv-drawer__done-actions">
                  <button
                    type="button"
                    className="dv-btn dv-btn--solid"
                    onClick={onClose}
                  >
                    Done
                  </button>
                  <button
                    type="button"
                    className="dv-btn dv-btn--ghost"
                    onClick={sendAnother}
                  >
                    Send another
                  </button>
                </div>
              </div>
            ) : (
              <form
                className="dv-form"
                onSubmit={handleSubmit}
                noValidate
              >
                <p className="dv-form__intro">
                  Tell us what you have in mind. A rough idea is fine.
                </p>

                <div className="dv-field">
                  <label htmlFor={`${uid}-name`}>
                    Your name <span>required</span>
                  </label>
                  <input
                    type="text"
                    autoComplete="name"
                    {...field("name")}
                  />
                  {fieldError("name")}
                </div>

                <div className="dv-field">
                  <label htmlFor={`${uid}-email`}>
                    Email address <span>required</span>
                  </label>
                  <input
                    type="email"
                    autoComplete="email"
                    {...field("email")}
                  />
                  {fieldError("email")}
                </div>

                <div className="dv-field">
                  <label htmlFor={`${uid}-phone`}>Phone number</label>
                  <input
                    type="tel"
                    autoComplete="tel"
                    {...field("phone")}
                  />
                </div>

                <div className="dv-field">
                  <label htmlFor={`${uid}-projectType`}>Project type</label>
                  <select {...field("projectType")}>
                    <option value="">Select a service</option>
                    {projectTypeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="dv-field">
                  <label htmlFor={`${uid}-budget`}>Budget range</label>
                  <select {...field("budget")}>
                    <option value="">Select a budget range</option>
                    {budgetOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="dv-field">
                  <label htmlFor={`${uid}-message`}>
                    About your project <span>required</span>
                  </label>
                  <textarea rows="5" {...field("message")} />
                  {fieldError("message")}
                </div>

                {serverError && (
                  <p className="dv-form__error" role="alert">
                    {serverError}{" "}
                    <a href={`mailto:${contact.email}`}>{contact.email}</a>
                  </p>
                )}

                <button
                  type="submit"
                  className="dv-btn dv-btn--solid dv-form__submit"
                  disabled={status === "sending"}
                >
                  {status === "sending" ? "Sending\u2026" : "Send message"}
                </button>
              </form>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

export default InquiryDrawer;
