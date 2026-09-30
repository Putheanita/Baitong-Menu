/**
 * Pure Presentation Component: Feedback & Error Alert
 */
export default function AuthAlertView({ feedback, onDismiss }) {
  if (!feedback) return null;

  return (
    <div className={`auth-alert auth-alert-${feedback.type}`} role="alert">
      <div className="auth-alert-icon">
        {feedback.type === "success" ? (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        ) : (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
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
      {feedback.type === "error" && onDismiss && (
        <button
          type="button"
          className="auth-alert-close"
          onClick={onDismiss}
          aria-label="Dismiss alert"
        >
          &times;
        </button>
      )}
    </div>
  );
}
