import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleNavigation = (e, path) => {
    e.preventDefault();
    if (menuOpen) {
      setMenuOpen(false);
    }
    setLoading(true);
    setTimeout(() => {
      navigate(path);
      setLoading(false);
    }, 800);
  };

  return (
    <>
      {/* The header no longer gets a blur class */}
      <header className="header">
        <div className="header-container">
          <NavLink to="/" onClick={(e) => handleNavigation(e, '/')}>
            <img src="logo.png" alt="Cleen Logo" className="logo" />
          </NavLink>
          <h1 className="header-title">Laundry Service</h1>
          <button
            className={`burger-menu ${menuOpen ? "open" : ""}`}
            onClick={toggleMenu}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
          >
            <div className="line line1"></div>
            <div className="line line2"></div>
            <div className="line line3"></div>
          </button>
          <nav className={`nav ${menuOpen ? "open" : ""}`}>
            <ul className="nav-links">
              <li>
                <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={(e) => handleNavigation(e, '/')}>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={(e) => handleNavigation(e, '/dashboard')}>
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink to="/services" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={(e) => handleNavigation(e, '/services')}>
                  Services
                </NavLink>
              </li>
              <li>
                <NavLink to="/profile" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={(e) => handleNavigation(e, '/profile')}>
                  Profile
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* This overlay handles the blur for the page content behind it */}
      {(
        <div className={`loading-overlay ${loading ? "show" : ""}`}>
          <img src="LOGO.gif" alt="Loading..." className="loading-gif" />
        </div>
      )}


      {/* --- INLINE CSS --- */}
      <style>{`
        /* General Header Styling */
        .header {
          background-color: rgba(0, 33, 73, 0.94);
          padding: 10px 0;
          border-bottom: 1px solid #0a2d57;
          position: sticky;
          top: 0;
          width: 100%;
          z-index: 1000;
          backdrop-filter: blur(12px);       /* ✅ glass effect */
          -webkit-backdrop-filter: blur(12px);
        }
        .header-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        .logo {
          height: 50px;
          /* Make sure initial width is also set for a perfect circle */
          width: 50px; 
          cursor: pointer;
          border-radius: 999px;
          box-shadow: 0 0 8px #fff;
        }
        .header-title {
          color: white;
          font-size: 1.5rem;
          font-weight: bold;
          margin: 0;
        }
        /* --- Navigation Links --- */
        .nav-links {
          list-style: none;
          display: flex;
          gap: 20px;
          margin: 0;
          padding: 0;
        }
        .nav-link {
          color: #ffffff;
          text-decoration: none;
          font-size: 1rem;
          padding: 8px 15px;
          border-radius: 5px;
          transition: background-color 0.3s, color 0.3s;
          position: relative;
        }
        .nav-link.active {
          color: #3498db;
          font-weight: bold;
        }        
        .nav-link:hover {
          background-color: #3498db;
          color: #fff;
        }

        /* --- Burger Menu for Mobile --- */
        .burger-menu {
          display: none;
          flex-direction: column;
          justify-content: space-around;
          width: 2rem;
          height: 2rem;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          z-index: 10;
        }
        .burger-menu:focus {
          outline: none;
        }
        .line {
          width: 2rem;
          height: 0.25rem;
          background: white;
          border-radius: 10px;
          transition: all 0.3s linear;
          position: relative;
          transform-origin: 1px;
        }
        .burger-menu.open .line1 { transform: rotate(45deg); }
        .burger-menu.open .line2 { opacity: 0; transform: translateX(20px); }
        .burger-menu.open .line3 { transform: rotate(-45deg); }
        /* --- Responsive Design (Mobile View) --- */
        @media (max-width: 768px) {
          
          .burger-menu {
            display: flex;
          }
          .nav {
            position: fixed;
            top: 100px;
            right: 20px;
            width: 92.25%;
            border-radius:20px;
            background-color: rgba(0, 33, 73, 0.98);
            flex-direction: column;
            justify-content: center;
            align-items: center;
            transform: translateX(150%);
            transition: transform 0.5s ease-in-out;
          }
          .nav.open {
            transform: translateX(0);
          }
          .nav-links {
            flex-direction: column;
            text-align: center;
            margin:20px;
            gap: 10px;
          }
          .nav-link {
            font-size: 1.2rem;
          }
        }
        /* Show title on medium screens and center it */
        @media (min-width: 769px) {
          .header-title {
            display: block;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
          }
        }
        /* --- Loading Overlay --- */
        .loading-overlay {
          position: fixed;
          top: 0; left: 0;
          width: 100vw; height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;

          /* Glassy overlay */
          backdrop-filter: blur(6px);
          background: rgba(255, 255, 255, 0.08);

          /* Animation */
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.4s ease-in-out;
        }

        .loading-overlay.show {
          opacity: 1;
          pointer-events: all;
        }
        .loading-gif {
          width: 100px;
          height: 100px;
          animation: pulse 1.2s ease-in-out infinite; /* subtle zoom effect */
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </>
  );
};

export default Header;