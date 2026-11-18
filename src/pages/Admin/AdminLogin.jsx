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
      <form className="al-card" onSubmit={handleSubmit} noValidate>
        <img className="al-logo" src={logo} alt="DevVerse" />

        <h1>Admin sign in</h1>
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
        <input
          id="al-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        {error && (
          <p className="al-error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" disabled={submitting}>
          {submitting ? "Signing in\u2026" : "Sign in"}
        </button>

        <Link className="al-back" to="/">
          Back to the website
        </Link>
      </form>
    </main>
  );
}

export default AdminLogin;
