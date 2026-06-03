import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import ProfileIcon from "../assets/people.png";
import vector from "../assets/Vector.svg";

function Navbar({ title = "Home" }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("email");
    navigate("/");
  };

  return (
    <div className="navbar">
      <div className="navbar-mobile-brand">
        <span>Productr</span>
        <img src={vector} alt="Logo" className="navbar-logo-img" />
      </div>

      <div className="navbar-title">
        <span className="navbar-title-icon">
          {title === "Home" ? (
            <img src="/home.svg" alt="Home" />
          ) : (
            <img src="/Shopping-bag.svg" alt="Products" />
          )}
        </span>
        <span>{title}</span>
      </div>

      <div className="navbar-search-container">
        <img
          src="/Search.svg"
          alt="Search"
          className="navbar-search-icon"
        />
        <input
          type="text"
          placeholder="Search"
          className="navbar-search"
        />
      </div>

      <div
        className="navbar-profile-container"
        onClick={() => setShowDropdown(!showDropdown)}
        ref={dropdownRef}
      >
        <div className="navbar-avatar">
          <img src={ProfileIcon} alt="Avatar" />
        </div>
        <span className={`navbar-arrow ${showDropdown ? "open" : ""}`}>▼</span>

        {showDropdown && (
          <div className="navbar-dropdown">
            <div className="navbar-dropdown-header">
              <span className="navbar-dropdown-label">Signed in as</span>
              <span className="navbar-dropdown-email" title={email}>
                {email || "guest@productr.com"}
              </span>
            </div>
            <div className="navbar-dropdown-divider"></div>
            <button className="navbar-dropdown-item" onClick={handleLogout}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "8px" }}>
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;