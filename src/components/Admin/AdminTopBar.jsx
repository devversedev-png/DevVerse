import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/devverse-logo.png";

import "./AdminTopBar.css";

const links = [
  { to: "/admin/leads", label: "Leads" },
  { to: "/admin/projects", label: "Projects" },
  { to: "/admin/chats", label: "Chats" },
  { to: "/", label: "View site" },
];

function AdminTopBar({ current }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <header className="atb">
      <Link to="/admin/leads" className="atb-brand" aria-label="DevVerse admin">
        <img src={logo} alt="DevVerse" />
        <span>Admin</span>
      </Link>

      <nav className="atb-nav" aria-label="Admin">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            aria-current={current === link.to ? "page" : undefined}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <button type="button" className="atb-logout" onClick={handleLogout}>
        Log out
      </button>
    </header>
  );
}

export default AdminTopBar;
