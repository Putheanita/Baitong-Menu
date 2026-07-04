import { useState } from "react";
import { AUTH_CONFIG, hashPassword } from "../config/authConfig";
import "./Login.css";

function Login({ onLoginSuccess }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // 1. Encrypt/hash the entered password
      const enteredPasswordHash = await hashPassword(password);

      // 2. Validate against auth configuration
      const isValidIdentifier =
        identifier.trim() === AUTH_CONFIG.ALLOWED_EMAIL ||
        identifier.trim() === AUTH_CONFIG.ALLOWED_PHONE;

      const isValidPassword = enteredPasswordHash === AUTH_CONFIG.PASSWORD_HASH;

      if (isValidIdentifier && isValidPassword) {
        alert("Login successful! 🎉");
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      } else {
        setError("Invalid email/phone number or password.");
      }
    } catch (err) {
      console.error("Authentication error:", err);
      setError("An error occurred during authentication.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Left panel with branding and slogans */}
      <div className="login-branding">
        <div className="brand-logo">
          <span>SkinCare Co.</span>
        </div>
        <h1 className="slogan-title">Your skin, but better 🌿</h1>
        <p className="slogan-subtitle">Glow naturally with clean skincare</p>
        <div className="brand-owner">
          Owner: <a href="https://www.facebook.com/share/1ExFCeLE93/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer">Ms Putheanita Prom</a>
        </div>
      </div>

      {/* Right panel with the login form */}
      <div className="login-form-container">
        <form className="login-card" onSubmit={handleLogin}>
          <div className="login-header">
            <h2>Login</h2>
            <p>Welcome back! Please enter your details.</p>
          </div>

          {error && <div style={{ color: "#d9534f", marginBottom: "15px", fontSize: "0.9rem" }}>{error}</div>}

          <div className="form-group">
            <label htmlFor="identifier">Email or Phone Number</label>
            <input
              id="identifier"
              type="text"
              placeholder="admin@gmail.com or 08123456789"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="login-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? "Authenticating..." : "Sign In"}
          </button>

          <div className="login-footer">
            <p>
              Forgot password? <a href="#reset">Reset here</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;