import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Avatar from "./Avatar";

import {
  FaHome,
  FaBriefcase,
  FaCode,
  FaUserTie,
  FaFileAlt,
  FaChevronDown,
  FaChevronRight,
  FaSignOutAlt,
  FaMoon,
  FaSun,
  FaBars,
  FaTimes
} from "react-icons/fa";

function Sidebar() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    general: true,
    career: true,
    learning: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
  };

  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const navSections = [
    {
      id: "general",
      title: "General",
      links: [
        { to: "/dashboard", label: "Dashboard", icon: <FaHome /> },
        { to: "/profile", label: "Profile", icon: <FaUserTie /> },
      ],
    },
    {
      id: "career",
      title: "Career",
      links: [
        { to: "/applications", label: "Applications", icon: <FaBriefcase /> },
        { to: "/interviews", label: "Interviews", icon: <FaUserTie /> },
        { to: "/resumes", label: "Resumes", icon: <FaFileAlt /> },
      ],
    },
    {
      id: "learning",
      title: "Learning",
      links: [
        { to: "/dsa", label: "DSA Tracker", icon: <FaCode /> },
      ],
    },
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        className="mobile-toggle" 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div className="sidebar-overlay" onClick={closeMobileMenu}></div>
      )}

      <aside className={`sidebar ${isMobileMenuOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-icon">C</div>
            <h2>CareerTracker</h2>
          </div>
        </div>

        <div className="sidebar-user">
          <Avatar type={user?.avatar} url={user?.avatarUrl} size={40} />
          <div className="user-info">
            <span className="user-name">{user?.name || "User"}</span>
            <span className="user-email">{user?.email}</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navSections.map((section) => (
            <div key={section.id} className="nav-section">
              <button 
                className="section-header" 
                onClick={() => toggleSection(section.id)}
              >
                <span>{section.title}</span>
                {expandedSections[section.id] ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
              </button>
              
              {expandedSections[section.id] && (
                <div className="section-links">
                  {section.links.map((link) => (
                    <NavLink 
                      key={link.to} 
                      to={link.to} 
                      className="nav-link"
                      onClick={closeMobileMenu}
                    >
                      <span className="link-icon">{link.icon}</span>
                      <span className="link-label">{link.label}</span>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button onClick={toggleTheme} className="footer-btn theme-toggle">
            <FaMoon className="dark-icon" />
            <FaSun className="light-icon" />
            <span>Theme</span>
          </button>
          <button onClick={logout} className="footer-btn logout-btn">
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
