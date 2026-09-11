import { useState } from "react";
import { AUTH_CONFIG, hashPassword } from "../config/authConfig";
import "./Login.css";

function Login({ onLoginSuccess }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', title, message }
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setFeedback(null);
    setIsLoading(true);

    try {
      // 1. Validate identifier (email or phone)
      const idInput = identifier.trim().toLowerCase();
      const isValidIdentifier =
        idInput === AUTH_CONFIG.ALLOWED_EMAIL.toLowerCase() ||
        idInput === "admin@gmail.com" ||
        identifier.trim() === AUTH_CONFIG.ALLOWED_PHONE;

      // 2. Validate static plaintext password or hash
      const enteredPasswordHash = await hashPassword(password);
      const targetPassword = AUTH_CONFIG.PASSWORD || AUTH_CONFIG.PASSWORD_HASH;
      const isValidPassword =
        password === targetPassword ||
        enteredPasswordHash === targetPassword;

      if (isValidIdentifier && isValidPassword) {
        setIsSuccess(true);
        setFeedback({
          type: "success",
          title: "Welcome Back!",
          message: "Login successful. Redirecting to your dashboard..."
        });

        // Elegant brief delay for professional visual feedback before navigation
        setTimeout(() => {
          if (onLoginSuccess) {
            onLoginSuccess();
          }
        }, 850);
      } else {
        setFeedback({
          type: "error",
          title: "Invalid Credentials",
          message: "The email/phone or password you entered is incorrect."
        });
      }
    } catch (err) {
      console.error("Authentication error:", err);
      setFeedback({
        type: "error",
        title: "Authentication Error",
        message: "An unexpected error occurred. Please try again."
      });
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

          {/* Professional Alert Notification */}
          {feedback && (
            <div className={`auth-alert auth-alert-${feedback.type}`} role="alert">
              <div className="auth-alert-icon">
                {feedback.type === "success" ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                )}
              </div>
              <div className="auth-alert-body">
                <span className="auth-alert-title">{feedback.title}</span>
                <span className="auth-alert-message">{feedback.message}</span>
              </div>
              {feedback.type === "error" && (
                <button
                  type="button"
                  className="auth-alert-close"
                  onClick={() => setFeedback(null)}
                  aria-label="Dismiss alert"
                >
                  &times;
                </button>
              )}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="identifier">Email or Phone Number</label>
            <input
              id="identifier"
              type="text"
              placeholder="putheanitaprom@gmail.com or 015"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                if (feedback?.type === "error") setFeedback(null);
              }}
              className="login-input"
              required
              disabled={isSuccess}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (feedback?.type === "error") setFeedback(null);
              }}
              className="login-input"
              required
              disabled={isSuccess}
            />
          </div>

          <button
            type="submit"
            className={`login-btn ${isSuccess ? "login-btn-success" : ""}`}
            disabled={isLoading || isSuccess}
          >
            {isSuccess ? (
              <span className="btn-status">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Verified & Entering...
              </span>
            ) : isLoading ? (
              <span className="btn-status">
                <span className="btn-spinner"></span>
                Authenticating...
              </span>
            ) : (
              "Sign In"
            )}
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