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
  isSuccess
}) {
  return (
    <form onSubmit={onSubmit} className="auth-form-body">
      <div className="form-group">
        <label htmlFor="identifier" style={{ fontFamily: "'Battambang', sans-serif" }}>អ៊ីមែល ឬ លេខទូរស័ព្ទ</label>
        <input
          id="identifier"
          type="text"
          placeholder="ឧ. 015 241471 ឬ putheanitaprom@gmail.com"
          value={identifier}
          onChange={(e) => onIdentifierChange(e.target.value)}
          className="login-input"
          required
          disabled={isSuccess}
        />
      </div>

      <div className="form-group">
        <label htmlFor="password" style={{ fontFamily: "'Battambang', sans-serif" }}>ពាក្យសម្ងាត់</label>
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
        style={{ fontFamily: "'Battambang', sans-serif", fontSize: "1rem" }}
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
            ជោគជ័យ! កំពុងចូល...
          </span>
        ) : isLoading ? (
          <span className="btn-status">
            <span className="btn-spinner"></span>
            កំពុងផ្ទៀងផ្ទាត់...
          </span>
        ) : (
          "ចូលគណនី"
        )}
      </button>
    </form>
  );
}
