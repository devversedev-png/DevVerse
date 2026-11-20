import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminTopBar from "../../components/Admin/AdminTopBar";
import { useAuth } from "../../context/AuthContext";
import { fetchLeads } from "../../services/leadApi";

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
  const [slow, setSlow] = useState(false);
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

  // The free hosting plan sleeps when idle. Tell the admin why it is slow.
  useEffect(() => {
    if (!loading) {
      setSlow(false);
      return undefined;
    }

    const timer = setTimeout(() => setSlow(true), 4000);
    return () => clearTimeout(timer);
  }, [loading]);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();

    return term
      ? data.leads.filter((lead) => lead.email.includes(term))
      : data.leads;
  }, [data.leads, query]);

  return (
    <div className="ald-page">
      <AdminTopBar current="/admin/leads" />

      <main className="ald-main">
        <h1>Leads</h1>
        <p className="ald-sub">
          Everyone who entered an email on the website, and how many times
          they have visited. Click an email to write to them.
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

        {slow && (
          <p className="ald-note" role="status">
            Waking up the server. This can take up to a minute.
          </p>
        )}

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
                  <th scope="row">
                    <a
                      className="ald-mail"
                      href={`mailto:${lead.email}?subject=${encodeURIComponent(
                        "Hello from DevVerse"
                      )}`}
                      title={`Write an email to ${lead.email}`}
                    >
                      {lead.email}
                    </a>
                  </th>
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
