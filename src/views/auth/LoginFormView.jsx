/**
 * Pure Presentation Component: Sign In (Login) Form
 */
export default function LoginFormView({
  identifier,
  onIdentifierChange,
  password,
  onPasswordChange,
  onSubmit,
  isLoading,
  isSuccess,
  onQuickDemo,
  registeredUsers = [],
  onSelectAccount
}) {
  return (
    <form onSubmit={onSubmit} className="auth-form-body">
      <div className="form-group">
        <label htmlFor="identifier">Email or Phone Number</label>
        <input
          id="identifier"
          type="text"
          placeholder="e.g. putheanitaprom@gmail.com or 015 241471"
          value={identifier}
          onChange={(e) => onIdentifierChange(e.target.value)}
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
          onChange={(e) => onPasswordChange(e.target.value)}
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
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Verified &amp; Entering...
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

      {/* Demo Quick Login */}
      <div className="quick-demo-box">
        <span>Owner Login:</span>
        <button
          type="button"
          className="quick-demo-btn"
          onClick={onQuickDemo}
        >
          ⚡ Puthea Nita (Admin)
        </button>
      </div>

      {/* All Available Registered Customer Accounts */}
      {registeredUsers && registeredUsers.length > 0 && (
        <div className="registered-users-box">
          <div className="reg-users-label">
            <span>👥 Registered Accounts ({registeredUsers.length}):</span>
            <small>Click to switch &amp; test</small>
          </div>
          <div className="reg-users-list">
            {registeredUsers.map((u) => (
              <button
                key={u.id || u.email}
                type="button"
                className={`reg-user-pill ${identifier.toLowerCase() === u.email?.toLowerCase() ? "selected" : ""}`}
                onClick={() => onSelectAccount && onSelectAccount(u)}
                title={`Click to fill: ${u.email} (${u.role || "Customer"})`}
              >
                <span className="reg-user-name">{u.name}</span>
                <span className="reg-user-badge">
                  {u.role?.includes("Admin") ? "👑 Admin" : "👤 Customer"}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </form>
  );
}
