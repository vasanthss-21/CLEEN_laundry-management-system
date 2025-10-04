import React, { useState } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import Login from "./components/login";
import MonthDetails from "./components/MonthDetails";
import ServicesSection from "./components/ServiceSection";
import FAQSection from "./components/FAQSection";
import Profile from "./components/Profile";

function App() {
  const [user, setUser] = useState(""); // Store user ID
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Handle login and store user ID
  const handleLogin = (tagid) => {
    setUser(tagid);
    navigate("/"); // Redirect to dashboard after login
  };

  // Toggle sidebar state
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      
      {user ? ( // ✅ Show UI only if logged in
        <>
          <Header onToggleSidebar={toggleSidebar} />
          <div style={{ display: "flex", flex: 1 }}>
          <Sidebar isOpen={isSidebarOpen} />
          <div style={{  flex: 1,padding: "20px",marginLeft: isSidebarOpen ? "5px" : "-253px", // Adjust width dynamically
            transition: "margin-left 0.3s ease", // Smooth transition effect
              }}
          >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard user={user} />} />
            <Route path="/services" element={<ServicesSection user={user} />} />
            <Route path="/profile" element={<Profile TagId={user} />} />
            <Route path="/month/:monthName" element={<MonthDetails userid={user} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          </div>
          </div>
        </>
      ) : (
        <Login onlogin={handleLogin} /> // ✅ Show login screen if not logged in
      )}
    </div>
  );
}

export default App;
