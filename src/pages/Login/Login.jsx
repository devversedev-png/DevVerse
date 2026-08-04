import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/devverse-logo.png";

import { useAuth } from "../../context/AuthContext";

import {
  checkEmail,
  sendOTP,
  verifyOTP,
  adminLogin,
} from "../../services/authApi";

import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [step, setStep] = useState("email");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* ==============================
     RESET MESSAGES
  ============================== */

  const resetMessages = () => {
    setMessage("");
    setError("");
  };

  /* ==============================
     CHECK EMAIL
  ============================== */

  const handleCheckEmail = async (e) => {
    e.preventDefault();
    resetMessages();

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      const data = await checkEmail(email.trim());

      if (data.isAdmin) {
        setStep("admin");
      } else {
        setStep("customer");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ==============================
     SEND OTP
  ============================== */

  const handleSendOTP = async (e) => {
    e.preventDefault();
    resetMessages();

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    try {
      setLoading(true);

      const data = await sendOTP(
        name.trim(),
        email.trim()
      );

      setMessage(data.message);
      setStep("otp");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ==============================
     VERIFY OTP
  ============================== */

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    resetMessages();

    if (!otp.trim()) {
      setError("Please enter the OTP.");
      return;
    }

    try {
      setLoading(true);

      const data = await verifyOTP(
        name.trim(),
        email.trim(),
        otp.trim()
      );

      login(data.user, data.token);

      navigate("/", {
        replace: true,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ==============================
     ADMIN LOGIN
  ============================== */

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    resetMessages();

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const data = await adminLogin(
        email.trim(),
        password
      );

      login(data.user, data.token);

      navigate("/admin/chats", {
        replace: true,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ==============================
     CHANGE EMAIL
  ============================== */

  const handleChangeEmail = () => {
    setStep("email");
    setName("");
    setPassword("");
    setOtp("");
    resetMessages();
  };

  return (
    <main className="login-page">
      <div className="login-glow login-glow-one" />
      <div className="login-glow login-glow-two" />

      <section className="login-card">
        <div className="login-brand">
          <div className="login-brand-mark">
            <img src={logo} alt="DevVerse Logo" />
          </div>

          <div>
            <h1>DevVerse</h1>
            <p>Build beyond imagination.</p>
          </div>
        </div>

        <div className="login-heading">
          <span className="login-badge">
            Welcome to DevVerse
          </span>

          <h2>
            {step === "admin"
              ? "Admin Login"
              : step === "otp"
                ? "Verify your email"
                : "Enter the Verse"}
          </h2>

          <p>
            {step === "admin"
              ? "Enter your administrator password to continue."
              : step === "otp"
                ? `We sent a verification code to ${email}`
                : "Sign in to explore, connect and start building with us."}
          </p>
        </div>

        {/* EMAIL STEP */}

        {step === "email" && (
          <form
            className="login-form"
            onSubmit={handleCheckEmail}
          >
            <label htmlFor="login-email">
              Email address
            </label>

            <input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              autoComplete="email"
              required
            />

            <button
              type="submit"
              className="login-primary-btn"
              disabled={loading}
            >
              {loading
                ? "Checking..."
                : "Continue"}
            </button>
          </form>
        )}

        {/* CUSTOMER NAME STEP */}

        {step === "customer" && (
          <form
            className="login-form"
            onSubmit={handleSendOTP}
          >
            <div className="login-email-preview">
              <span>{email}</span>

              <button
                type="button"
                onClick={handleChangeEmail}
              >
                Change
              </button>
            </div>

            <label htmlFor="customer-name">
              Your name
            </label>

            <input
              id="customer-name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              autoComplete="name"
              required
            />

            <button
              type="submit"
              className="login-primary-btn"
              disabled={loading}
            >
              {loading
                ? "Sending OTP..."
                : "Send verification code"}
            </button>
          </form>
        )}

        {/* OTP STEP */}

        {step === "otp" && (
          <form
            className="login-form"
            onSubmit={handleVerifyOTP}
          >
            <label htmlFor="login-otp">
              Verification code
            </label>

            <input
              id="login-otp"
              className="login-otp-input"
              type="text"
              inputMode="numeric"
              maxLength="6"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) =>
                setOtp(
                  e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 6)
                )
              }
              autoComplete="one-time-code"
              required
            />

            <button
              type="submit"
              className="login-primary-btn"
              disabled={
                loading || otp.length !== 6
              }
            >
              {loading
                ? "Verifying..."
                : "Verify & Enter"}
            </button>

            <button
              type="button"
              className="login-secondary-btn"
              onClick={handleChangeEmail}
            >
              Use another email
            </button>
          </form>
        )}

        {/* ADMIN STEP */}

        {step === "admin" && (
          <form
            className="login-form"
            onSubmit={handleAdminLogin}
          >
            <div className="login-email-preview">
              <span>{email}</span>

              <button
                type="button"
                onClick={handleChangeEmail}
              >
                Change
              </button>
            </div>

            <label htmlFor="admin-password">
              Admin password
            </label>

            <input
              id="admin-password"
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              autoComplete="current-password"
              required
            />

            <button
              type="submit"
              className="login-primary-btn"
              disabled={loading}
            >
              {loading
                ? "Signing in..."
                : "Login as Admin"}
            </button>
          </form>
        )}

        {message && (
          <p className="login-message success">
            {message}
          </p>
        )}

        {error && (
          <p className="login-message error">
            {error}
          </p>
        )}

        <p className="login-footer-text">
          Secure access powered by DevVerse.
        </p>
      </section>
    </main>
  );
}

export default Login;