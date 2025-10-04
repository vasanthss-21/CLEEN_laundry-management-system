import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ isOpen }) => {
  return (
    <>
      <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/services">Services</Link></li>
          <li><Link to="/faq">FAQs</Link></li>
        </ul>
      </aside>

      <style>{`
        .sidebar {
          width: 250px;
          background: rgba(0, 33, 73, 0.94);
          min-height: 100vh;
          padding: 15px;
          left: 0;
          top: 0;
          transition: transform 0.3s ease-in-out;
          box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .sidebar.closed {
          transform: translateX(-100%);
        }

        .sidebar.open {
          transform: translateX(0);
        }

        .sidebar ul {
          list-style: none;
          padding: 0;
          margin: 0;
          
        }

        .sidebar li {
          margin: 10px 0;
        }

        .sidebar a {
          text-decoration: none;
          color: #ffffff;
          font-size: 15px;
          display: block;
          padding: 10px;
          border-radius: 5px;
          transition: background 0.3s, color 0.3s;
        }

        .sidebar a:hover {
          background: #3498db;
          color: #ffffff;
        }

        .sidebar a.active {
          background: #2980b9;
          color: #ffffff;
        }
      `}</style>
    </>
  );
};

export default Sidebar;
