import "./Contact.css";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { sendContactMessage } from "../../services/contactApi";
import { useVisitor } from "../../context/VisitorContext";
import Swal from "sweetalert2";
import Select from "react-select";

import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaArrowRight
} from "react-icons/fa";

const serviceOptions = [
  {
    value: "Website Development",
    label: "🌐 Website Development",
  },
  {
    value: "Mobile Application",
    label: "📱 Mobile Application",
  },
  {
    value: "E-Commerce Platform",
    label: "🛒 E-Commerce Platform",
  },
  {
    value: "Custom Software",
    label: "⚙️ Custom Software",
  },
  {
    value: "UI / UX Design",
    label: "🎨 UI / UX Design",
  },
  {
    value: "Other",
    label: "✨ Other",
  },
];

const budgetOptions = [
  {
    value: "Let's Discuss",
    label: "💬 Let's Discuss",
  },
  {
    value: "₹10,000 - ₹25,000",
    label: "💰 ₹10,000 - ₹25,000",
  },
  {
    value: "₹25,000 - ₹50,000",
    label: "💰 ₹25,000 - ₹50,000",
  },
  {
    value: "₹50,000 - ₹1,00,000",
    label: "💎 ₹50,000 - ₹1,00,000",
  },
  {
    value: "₹1,00,000+",
    label: "🚀 ₹1,00,000+",
  },
];


function Contact() {

    const navigate = useNavigate();
  const { email: visitorEmail } = useVisitor();

  const [form, setForm] = useState({
  name: "",
  email: visitorEmail || "",
  phone: "",
  projectType: "",
  budget: "",
  message: "",
});

  const [sending, setSending] = useState(false);

   useEffect(() => {
  if (visitorEmail) {
    setForm((prev) => ({
      ...prev,
      email: prev.email || visitorEmail,
    }));
  }
}, [visitorEmail]);


 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setSending(true);

    await sendContactMessage(form);

    Swal.fire({
  title: "🎉 Message Sent Successfully!",
  html: `
      <div style="font-size:15px;line-height:1.8">
        <p>Thank you for choosing <b style="color:#8a5a2e">DevVerse</b>.</p>

        <p>Your project enquiry has been received.</p>

        <p style="color:#66513f">
          Our team will contact you as soon as possible.
        </p>
      </div>
  `,
  icon: "success",
  width: 520,
  background: "#fffcf5",
  color: "#2a1b12",
  confirmButtonText: "Continue",
  confirmButtonColor: "#2a1b12",
  allowOutsideClick: false,
  customClass: {
    popup: "devverse-popup",
    confirmButton: "devverse-btn"
  }
});

    setForm({
      name: "",
      email: "",
      phone: "",
      projectType: "",
      budget: "",
      message: "",
    });

  } catch (err) {
    alert(err.message);
  } finally {
    setSending(false);
  }
};

const selectStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#fffcf5",
    borderRadius: "16px",
    border: state.isFocused
      ? "2px solid #8a5a2e"
      : "1px solid rgba(42,27,18,.25)",
    boxShadow: state.isFocused
      ? "0 0 0 4px rgba(138,90,46,.2)"
      : "none",
    minHeight: "60px",
    transition: "all .25s ease",
    cursor: "pointer",
  }),

  menu: (base) => ({
    ...base,
    background: "#fffcf5",
    borderRadius: "16px",
    overflow: "hidden",
    border: "1px solid rgba(42,27,18,.25)",
    boxShadow:
      "0 20px 50px rgba(42,27,18,.25)",
  }),

  option: (base, state) => ({
    ...base,
    background: state.isSelected
      ? "linear-gradient(90deg,#f3cda3,#e9b866)"
      : state.isFocused
      ? "rgba(233,184,102,.3)"
      : "#fffcf5",

    color: "#2a1b12",

    padding: "15px 18px",

    fontSize: "15px",

    transition: "all .25s",
  }),

  singleValue: (base) => ({
    ...base,
    color: "#2a1b12",
    fontWeight: 500,
  }),

  placeholder: (base) => ({
    ...base,
    color: "#66513f",
  }),

  dropdownIndicator: (base, state) => ({
    ...base,
    color: state.isFocused
      ? "#8a5a2e"
      : "#8a5a2e",
  }),

  indicatorSeparator: () => ({
    display: "none",
  }),

  input: (base) => ({
    ...base,
    color: "#2a1b12",
  }),

  menuList: (base) => ({
    ...base,
    padding: 8,
  }),
};

  return (
    <>
      <Navbar />

      <main className="contact-page">

        {/* HERO */}

        <section className="contact-hero">
          <span className="contact-label">GET IN TOUCH</span>

          <h1>
            Let's Turn Your Idea
            <br />
            Into <span>Something Amazing.</span>
          </h1>

          <p>
            Have a project in mind or simply want to discuss an idea?
            Tell us what you're thinking and let's explore how we can
            build it together.
          </p>
        </section>

        {/* CONTACT SECTION */}

        <section className="contact-main">

          {/* LEFT SIDE */}

          <div className="contact-info">

            <span className="contact-small-label">
              START A CONVERSATION
            </span>

            <h2>
              We'd Love To
              <br />
              <span>Hear From You.</span>
            </h2>

            <p className="contact-description">
              Whether you need a website, mobile application,
              e-commerce platform or custom software solution,
              send us a message and we'll get back to you.
            </p>

            <div className="contact-details">

              <div className="contact-detail-card">
                <div className="contact-detail-icon">
                  <FaEnvelope />
                </div>

                <div>
                  <span>Email Us</span>
                  <p>devverse.dev@gmail.com</p>
                </div>
              </div>

              <div className="contact-detail-card">
                <div className="contact-detail-icon">
                  <FaPhoneAlt />
                </div>

                <div>
                  <span>Call Us</span>
                  <p>Let's connect and discuss your idea</p>
                </div>
              </div>

              <div className="contact-detail-card">
                <div className="contact-detail-icon">
                  <FaMapMarkerAlt />
                </div>

                <div>
                  <span>Based In</span>
                  <p>Chennai, Tamil Nadu, India</p>
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT SIDE - FORM */}

          <div className="contact-form-wrapper">

            <div className="contact-form-glow"></div>

            <form
              className="contact-form"
              onSubmit={handleSubmit}
            >

              <div className="contact-form-header">
                <span>TELL US ABOUT YOUR PROJECT</span>

                <h3>Start Your Project</h3>

                <p>
                  Fill in the details below and we'll connect
                  with you to discuss your requirements.
                </p>
              </div>

              <div className="contact-form-row">

                <div className="contact-input-group">
                  <label>Your Name</label>

                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={form.name}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        name: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="contact-input-group">
                  <label>Email Address</label>

                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                </div>

              </div>

              <div className="contact-form-row">

                <div className="contact-input-group">
                  <label>Phone Number</label>

                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="contact-input-group">
                  <label>Project Type</label>

                 <Select
  options={serviceOptions}
  styles={selectStyles}
  placeholder="Select a service"
  isSearchable={false}
  value={
    serviceOptions.find(
      (option) =>
        option.value === form.projectType
    ) || null
  }
  onChange={(selected) =>
    setForm({
      ...form,
      projectType: selected.value,
    })
  }
/>
                </div>

              </div>

              <div className="contact-input-group">
                <label>Project Budget</label>

              <Select
  options={budgetOptions}
  styles={selectStyles}
  placeholder="Select your budget range"
  isSearchable={false}
  value={
    budgetOptions.find(
      (option) =>
        option.value === form.budget
    ) || null
  }
  onChange={(selected) =>
    setForm({
      ...form,
      budget: selected.value,
    })
  }
/>
              </div>

              <div className="contact-input-group">
                <label>Tell Us About Your Project</label>

                <textarea
                  rows="6"
                  placeholder="Tell us about your idea..."
                  value={form.message}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      message: e.target.value,
                    })
                  }
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="contact-submit-button"
                disabled={sending}
              >
                {sending ? "Sending..." : "Send Message"}

                <FaPaperPlane />
              </button>

            </form>

          </div>

        </section>

        {/* QUICK CTA */}

        <section className="contact-bottom-cta">

          <div>
            <span>NOT SURE WHERE TO START?</span>

            <h2>
              That's Okay.
              <span> Let's Talk About It.</span>
            </h2>

            <p>
              You don't need to have everything figured out.
              Share your idea with us and we'll help you understand
              the best way to move forward.
            </p>
          </div>

          <button
            onClick={() => navigate("/chat")}
          >
            Start A Conversation
            <FaArrowRight />
          </button>

        </section>

      </main>

      <Footer />
    </>
  );
}

export default Contact;