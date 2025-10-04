import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgVideo from "./bgvdo1.mp4";
import { uploadStudentProfiles } from './uploadStudentProfiles';
import { uploadDemoData } from "./uploadDemoData"; // ⬅️ import the function

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function Dashboard({ user }) {
  console.log("User ID in Dashboard:", user);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false); // ⬅️ state for demo upload
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="error-container">
        <p>Error: User ID is missing. Please log in again.</p>
      </div>
    );
  }
  const handleProfileUpload = () => {
    uploadStudentProfiles();
  };
  // 🔹 Handle month click with loading
  const handleMonthClick = (month) => {
    setLoading(true);
    setTimeout(() => {
      navigate(`/month/${month}?user=${user}`);
      setLoading(false);
    }, 800); // match GIF duration
  };

  // 🔹 Handle demo data upload
  const handleUploadClick = async () => {
    setUploading(true);
    try {
      await uploadDemoData(user); // ⬅️ call the upload function
      alert("✅ Demo data uploaded!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("❌ Failed to upload demo data. Check console.");
    }
    setUploading(false);
  };

  return (
    <>
      {/* 🔹 Background video */}
      <video className="video-background" autoPlay loop muted playsInline>
        <source src={bgVideo} type="video/mp4" />
      </video>
      <div className="overlay"></div>

      {/* 🔹 Foreground content */}
      <div className={`dashboard-container ${loading ? "blurred" : ""}`}>
        <div className="dashboard-content">
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">
            Select a month to view laundry details:
          </p>

          {/* 🔹 Upload Demo Data Button */}
          {/* <button
            className="upload-button"
            onClick={handleProfileUpload}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload Demo Data"}
          </button> */}

          {/* 🔹 Month Grid */}
          <div className="month-grid">
            {months.map((month) => (
              <button
                key={month}
                onClick={() => handleMonthClick(month)}
                className="month-card"
              >
                {month}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 🔹 Loading Overlay */}
      <div className={`loading-overlay ${loading ? "show" : ""}`}>
        <img src="/LOGO.gif" alt="Loading..." className="loading-gif" />
      </div>

      <style>{`
        .video-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: -2;
        }

        .dashboard-container {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          color: white;
          text-align: center;
          padding: 2rem;
          transition: filter 0.3s ease;
        }

        .blurred {
          filter: blur(5px);
          pointer-events: none;
        }

        .dashboard-content {
          background-color: rgba(0, 0, 0, 0.51);
          border-radius: 20px;
          padding: 2rem;
          width: 100%;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.37);
        }

        .dashboard-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }

        .dashboard-subtitle {
          font-size: 1.2rem;
          margin-bottom: 1rem;
          font-weight: 300;
        }

        /* Upload Button */
        .upload-button {
          padding: 10px 20px;
          margin-bottom: 2rem;
          background-color: #27ae60;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .upload-button:hover {
          background-color: #219653;
          transform: scale(1.05);
        }
        .upload-button:disabled {
          background-color: #7f8c8d;
          cursor: not-allowed;
        }

        .month-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
        }

        .month-card {
          padding: 1.7rem 0.5rem;
          background-color: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(5px);
          border-radius: 10px;
          text-decoration: none;
          color: white;
          font-weight: 600;
          font-size: 20px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
          border: 2px solid transparent;
          cursor: pointer;
        }

        .month-card:hover {
          transform: translateY(-10px) scale(1.05);
          border: 2px solid white;
          background-color: rgba(0, 0, 0, 0);
        }

        .error-container {
          font-family: sans-serif;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #f8f9fa;
          color: #dc3545;
        }

        .loading-overlay {
          position: fixed;
          top: 0; left: 0;
          width: 100vw; height: 100vh;
          backdrop-filter: blur(6px);
          background: rgba(255, 255, 255, 0.25);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
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
          object-fit: contain;
          animation: pulse 1.2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.08); opacity: 1; }
        }

        @media (max-width: 992px) {
          .month-grid {
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 1rem;
          }
          .month-card {
            font-weight: 600;
            font-size: 16px;
          }
          .dashboard-container {
            padding: 0.5rem;
          }
          .dashboard-title {
            font-size: 2rem;
            margin-bottom: 0.5rem;
          }
          .dashboard-subtitle {
            font-size: 1rem;
          }
        }
      `}</style>
    </>
  );
}

export default Dashboard;
