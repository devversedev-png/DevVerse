import "./Navbar.css";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/devverse-logo.png";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false);

  const { user, logout } = useAuth();

  const navigate = useNavigate();


  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-container">

        <Link to="/" className="logo">
          <img src={logo} alt="DevVerse" />
        </Link>

        <nav className={menuOpen ? "nav-links active" : "nav-links"}>

          <NavLink to="/" onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>

          <NavLink to="/services" onClick={() => setMenuOpen(false)}>
            Services
          </NavLink>

          {/* <NavLink to="/portfolio" onClick={() => setMenuOpen(false)}>
            Portfolio
          </NavLink> */}

          <NavLink to="/process" onClick={() => setMenuOpen(false)}>
            Process
          </NavLink>

          <NavLink to="/about" onClick={() => setMenuOpen(false)}>
            About Us
          </NavLink>

          <NavLink to="/contact" onClick={() => setMenuOpen(false)}>
            Contact
          </NavLink>

        </nav>

        <Link to="/chat" className="talk-btn">
          Let's Talk
        </Link>

        {
 user ? (
   <button 
      className="logout-btn"
      onClick={handleLogout}
   >
      Logout
   </button>
 ) : (
   <Link 
      to="/login"
      className="talk-btn"
   >
      Login
   </Link>
 )
}

        <button
          className="mobile-btn"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <HiOutlineMenuAlt3 />
        </button>

      </div>
    </header>
  );
}

export default Navbar;