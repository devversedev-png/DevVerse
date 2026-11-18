import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { fetchLeads } from "../../services/leadApi";
import logo from "../../assets/devverse-logo.png";

import "./AdminLeads.css";

function formatDate(value) {
  if (!value) return "-";

  return new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function AdminLeads() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState({
    totalLeads: 0,
    totalVisits: 0,
    leads: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await fetchLeads(token);
      setData(result);
    } catch (err) {
      if (err.unauthorized) {
        logout();
        navigate("/admin/login", { replace: true });
        return;
      }

      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, logout, navigate]);

  useEffect(() => {
    load();
  }, [load]);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();

    return term
      ? data.leads.filter((lead) => lead.email.includes(term))
      : data.leads;
  }, [data.leads, query]);

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="ald-page">
      <header className="ald-top">
        <Link to="/admin/leads" className="ald-brand" aria-label="DevVerse admin">
          <img src={logo} alt="DevVerse" />
          <span>Admin</span>
        </Link>

        <nav className="ald-nav" aria-label="Admin">
          <Link to="/admin/leads" aria-current="page">
            Leads
          </Link>
          <Link to="/admin/chats">Chats</Link>
          <Link to="/">View site</Link>
        </nav>

        <button type="button" className="ald-logout" onClick={handleLogout}>
          Log out
        </button>
      </header>

      <main className="ald-main">
        <h1>Leads</h1>
        <p className="ald-sub">
          Everyone who entered an email on the website, and how many times
          they have visited.
        </p>

        <div className="ald-stats">
          <div className="ald-stat">
            <span>Total leads</span>
            <strong>{data.totalLeads}</strong>
          </div>
          <div className="ald-stat">
            <span>Total visits</span>
            <strong>{data.totalVisits}</strong>
          </div>
        </div>

        <div className="ald-tools">
          <label htmlFor="ald-search" className="ald-visually-hidden">
            Search by email
          </label>
          <input
            id="ald-search"
            type="search"
            placeholder="Search by email"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          <button type="button" onClick={load} disabled={loading}>
            {loading ? "Refreshing\u2026" : "Refresh"}
          </button>
        </div>

        {error && (
          <p className="ald-error" role="alert">
            {error}
          </p>
        )}

        <div className="ald-table-wrap">
          <table className="ald-table">
            <thead>
              <tr>
                <th scope="col">Email</th>
                <th scope="col">Visits</th>
                <th scope="col">First visit</th>
                <th scope="col">Last visit</th>
                <th scope="col">Last page</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((lead) => (
                <tr key={lead.email}>
                  <th scope="row">{lead.email}</th>
                  <td>
                    <span className="ald-count">{lead.visitCount}</span>
                  </td>
                  <td>{formatDate(lead.firstVisitAt)}</td>
                  <td>{formatDate(lead.lastVisitAt)}</td>
                  <td>{lead.lastPath}</td>
                </tr>
              ))}

              {!loading && visible.length === 0 && (
                <tr>
                  <td colSpan="5" className="ald-empty">
                    {data.leads.length === 0
                      ? "No visitors have left an email yet."
                      : "No emails match your search."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default AdminLeads;
