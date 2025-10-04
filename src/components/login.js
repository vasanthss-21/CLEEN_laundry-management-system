import { useState, useEffect } from "react";
import { db, ref, get } from "../firebaseConfig";
import bgImg from "./image.png";
import logoImg from "./logo.png";

const Login = ({ onlogin }) => {
  const [TagId, setTagId] = useState("63e5ff27");
  const [password, setPassword] = useState("22222222");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good morning!");
    } else if (hour < 18) {
      setGreeting("Good afternoon!");
    } else {
      setGreeting("Good evening!");
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!TagId || !password) {
      setError("Please enter both TagId and password");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const userRef = ref(db, `Auth/${TagId}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const userData = snapshot.val();
        if (parseInt(userData.password) === parseInt(password)) {
          onlogin(TagId);
        } else {
          setError("Incorrect Password. Try again.");
        }
      } else {
        setError("User not found. Check your TagId.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("Error connecting to server. Try again later.");
    }
    setLoading(false);
  };

  return (
    <>
      <style>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          overflow: hidden;
          padding: 20px;
          height:100vh;
        }

        .login-container::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: url(${bgImg});
          background-size: cover;
          background-position: center;
          filter: blur(8px) brightness(0.7);
          z-index: -1;
        }

        .login-box {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 20px 35px;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          width: 100%;
          max-width: 500px;
          text-align: center;
          color: #fff;
          animation: fadeIn 0.8s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .login-header {
          margin-bottom: 25px;
        }

        .login-logo {
          width: 70px;
          height: 70px;
          margin-bottom: 15px;
          border-radius: 50%;
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
        }

        .login-greeting {
          font-size: 1.2rem;
          font-weight: 400;
          margin: 0;
          color: #e0e0e0;
        }

        .login-title {
          font-size: 2.0rem;
          font-weight: 700;
          margin: 5px 0 10px;
        }

        .login-tagline {
          font-size: 0.95rem;
          font-weight: 300;
          color: #d0d0d0;
          line-height: 1.5;
          margin: 0 auto 25px;
        }

        .login-error {
          color: #ff8a8a;
          background-color: rgba(255, 0, 0, 0.15);
          border: 1px solid #ff5252;
          border-radius: 8px;
          padding: 10px;
          font-size: 0.9rem;
          margin-bottom: 15px;
        }

        .input-group {
          margin-bottom: 20px;
          text-align: left;
        }

        .input-group label {
          display: block;
          font-size: 0.9rem;
          margin-bottom: 8px;
          font-weight: 500;
          color: #e0e0e0;
        }

        .input-field {
          width: 100%;
          padding: 12px 15px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          font-size: 1rem;
          background-color: rgba(255, 255, 255, 0.1);
          color: #fff;
          transition: all 0.3s;
        }

        .input-field::placeholder {
          color: #a0a0a0;
        }

        .input-field:focus {
          border-color: #3498db;
          outline: none;
          background-color: rgba(255, 255, 255, 0.2);
          box-shadow: 0 0 8px rgba(52, 152, 219, 0.5);
        }

        .checkbox-group {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 15px 0 20px;
          font-size: 0.9rem;
          color: #e0e0e0;
        }

        .checkbox-group input {
          accent-color: #3498db;
        }

        .login-button {
          width: 100%;
          padding: 14px;
          background: linear-gradient(90deg, #3498db, #2980b9);
          border: none;
          border-radius: 8px;
          font-size: 1.1rem;
          color: white;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
        }

        .login-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(52, 152, 219, 0.4);
        }

        .login-button:disabled {
          background: #5a6874;
          cursor: not-allowed;
        }

        .spinner {
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top: 3px solid white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          animation: spin 1s linear infinite;
          display: inline-block;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <div className="login-container">
        <div className="login-box">
          <div className="login-header">
            <img src={logoImg} alt="CLEEN Logo" className="login-logo" />
            <p className="login-greeting">{greeting}</p>
            <h2 className="login-title">Welcome to CLEEN</h2>
            <p className="login-tagline">
              A smarter way to manage laundry — from manual prototype today to fully automated RFID + AI tomorrow.
            </p>
          </div>

          {error && <p className="login-error">{error}</p>}
          
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label htmlFor="tagId">TagId</label>
              <input
                id="tagId"
                type="text"
                className="input-field"
                placeholder="Enter your TagId"
                value={TagId}
                onChange={(e) => setTagId(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="input-field"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="input-group checkbox-group">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <label htmlFor="showPassword">Show Password</label>
            </div>
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? <span className="spinner"></span> : "Login"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;