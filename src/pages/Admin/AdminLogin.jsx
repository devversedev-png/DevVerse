import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { adminLogin } from "../../services/authApi";
import logo from "../../assets/devverse-logo.png";

import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();
  const { login, isAdmin, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && isAdmin) {
    return <Navigate to="/admin/leads" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setSubmitting(true);

      const data = await adminLogin(email.trim(), password);

      login(data.user, data.token);
      navigate("/admin/leads", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="al-page">
      <section className="al-brand" aria-hidden="true">
        <img src={logo} alt="" />
        <p className="al-brand__big">Welcome back to DevVerse.</p>
        <p className="al-brand__small">
          Leads, projects and chats, all in one place.
        </p>
      </section>

      <section className="al-panel">
        <form className="al-card" onSubmit={handleSubmit} noValidate>
          <p className="al-eyebrow">Admin area</p>
          <h1>Sign in</h1>
          <p className="al-sub">This area is for the DevVerse team only.</p>

          <label htmlFor="al-email">Email</label>
          <input
            id="al-email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <label htmlFor="al-password">Password</label>
          <div className="al-password">
            <input
              id="al-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button
              type="button"
              className="al-toggle"
              onClick={() => setShowPassword((current) => !current)}
              aria-pressed={showPassword}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {error && (
            <p className="al-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="al-submit" disabled={submitting}>
            {submitting ? "Signing in\u2026" : "Sign in"}
          </button>

          {submitting && (
            <p className="al-hint" role="status">
              The server can take up to a minute to wake up.
            </p>
          )}

          <Link className="al-back" to="/">
            Back to the website
          </Link>
        </form>
      </section>
    </main>
  );
}

export default AdminLogin;
