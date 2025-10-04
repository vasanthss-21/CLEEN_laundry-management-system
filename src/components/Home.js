import React from 'react';
import bgVideo from './bgvdo1.mp4';

const App = () => {
  const AboutSection = () => (
    <div className="section-card">
      <h3 className="section-heading">Project : Smart Laundry Management System</h3>
      <p className="section-intro">
        A patented idea and working prototype designed to simplify and digitize the laundry process —
        from order placement to final delivery. Currently at prototype stage,
        but moving towards full RFID + AI-powered automation.
      </p>
    </div>
  );

  const FeaturesSection = () => (
    <div className="section-card">
      <h3 className="section-heading">Key Features</h3>
      <ul className="feature-list">
        <li>Order tracking with <b>RFID tags</b></li>
        <li>Instant SMS notifications with <b>bill, weight, and item count</b></li>
        <li>Integrated UPI/QR payments inside the dashboard</li>
        <li>Web app dashboard for <b>monthly summaries & history</b></li>
        <li>Prototype hardware with manual entry + keypad integration</li>
      </ul>
    </div>
  );

  const TechStackSection = () => (
    <div className="section-card">
      <h3 className="section-heading">🛠 Tech Stack</h3>
      <p className="section-intro">
        Built with modern tools to make laundry smarter:
      </p>
      <ul className="feature-list">
        <li>Frontend: React</li>
        <li>Backend: Node.js</li>
        <li>Database: Realtime DataBase and FireStore in Firebase</li>
        <li>Notifications: Twilio & Firebase Cloud Messaging</li>
        <li>Hardware: RFID, Keypad, ESP32 (prototype), Raspberry Pi (future plan), Sensors</li>
      </ul>
    </div>
  );

  const TeamSection = () => (
    <div className="section-card">
      <h3 className="section-heading">👥 Team Behind It</h3>
      <ul className="feature-list">
        <li>Shreenivas A. – Hardware & Software Integration</li>
        <li>Seshua Sai – Presentation & Hardware Support</li>
        <li>Vasanth S S – Web App Development</li>
        <li>S Srikar – Business Model & Software Support</li>
        <li>Teja Sree – Business Model & Hardware Support</li>
        <li>Blessy Sam – App Development</li>
      </ul>
    </div>
  );

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

body {
    margin: 0;
    font-family: 'Inter', sans-serif;
}

.home-container {
    position: relative;
    min-height: 100vh;
    overflow: hidden;
    border-radius: 20px;
}

.video-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1;
}

.content-wrapper {
    z-index: 1;
    min-height: 100vh;
    padding: 2rem 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: rgba(17, 24, 39, 0.6);
    color: #fff;
}

.main-heading {
    text-align: center;
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 1rem;
}

.welcome-text {
    text-align: center;
    font-size: 1rem;
    font-weight: 300;
    margin-bottom: 2rem;
    line-height: 1.6;
}

.content-sections {
    width: 100%;
    max-width: 80rem;
}

.section-card {
    background: rgba(255, 255, 255, 0.19);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 1rem;
    padding: 2rem;
    margin-bottom: 2rem;
    backdrop-filter: blur(10px);
}

.section-heading {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    text-align: center;
}

.section-intro {
    text-align: center;
    color: #d1d5db;
    margin-bottom: 1.5rem;
    line-height: 1.6;
}

.feature-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 0.75rem;
}

.feature-list li {
    background: rgba(31, 41, 55, 0.5);
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    text-align: center;
    line-height: 1.6;
}

@media (max-width: 768px) {
    .main-heading {
        font-size: 2rem;
    }
    .welcome-text {
        font-size: 0.9rem;
    }
}
        `}
      </style>

      <div className="home-container">
        <video className="video-background" autoPlay loop muted playsInline>
          <source src={bgVideo} type="video/mp4" />
        </video>

        <div className="content-wrapper">
          <div className="content-sections">
            <div className="text-container">
              <h2 className="main-heading">Welcome to Big Laundry</h2>
              <p className="welcome-text">
                A smarter way to manage laundry — from manual prototype today to fully automated RFID + AI tomorrow.
              </p>
            </div>
            <AboutSection />
            <FeaturesSection />
            <TechStackSection /> 
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
