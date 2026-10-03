import AuthBrandingView from "./AuthBrandingView";
import AuthAlertView from "./AuthAlertView";
import LoginFormView from "./LoginFormView";
import SignUpFormView from "./SignUpFormView";

/**
 * Pure Presentation Component: Login & Sign Up View
 * Receives state and action handlers from useLoginController.
 * Zero business logic or storage manipulation here.
 */
export default function LoginView({
  // State
  authMode,
  identifier,
  password,
  signupName,
  signupEmail,
  signupPhone,
  signupPassword,
  confirmPassword,
  signupAvatar,
  feedback,
  isLoading,
  isSuccess,

  // Setters & Actions
  setIdentifier,
  setPassword,
  setSignupName,
  setSignupEmail,
  setSignupPhone,
  setSignupPassword,
  setConfirmPassword,
  setSignupAvatar,
  dismissFeedback,
  switchAuthMode,
  handleLogin,
  handleSignUp,
  onBack
}) {
  return (
    <div className="login-page">
      {/* Left Branding View */}
      <AuthBrandingView />

      {/* Right Form Card View */}
      <div className="login-form-container">
        <div className="login-card">
          {/* Back to Home Button */}
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              style={{
                background: "none",
                border: "none",
                color: "#2d6a4f",
                fontFamily: "'Battambang', sans-serif",
                fontSize: "0.92rem",
                fontWeight: 600,
                cursor: "pointer",
                padding: "0 0 16px 0",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              ← ត្រឡប់ទៅមើលមុខម្ហូប (ទំព័រដើម)
            </button>
          )}

          {/* Mode Switcher Tabs */}
          <div className="auth-tab-group">
            <button
              type="button"
              className={`auth-tab-btn ${authMode === "login" ? "active" : ""}`}
              onClick={() => switchAuthMode("login")}
              style={{ fontFamily: "'Battambang', sans-serif" }}
            >
              ចូលគណនី
            </button>
            <button
              type="button"
              className={`auth-tab-btn ${authMode === "signup" ? "active" : ""}`}
              onClick={() => switchAuthMode("signup")}
              style={{ fontFamily: "'Battambang', sans-serif" }}
            >
              ចុះឈ្មោះថ្មី ✨
            </button>
          </div>

          <div className="login-header">
            <h2 style={{ fontFamily: "'Moul', 'Battambang', serif" }}>
              {authMode === "login" ? "សូមស្វាគមន៍មកកាន់ ផ្ទះបៃតង" : "បង្កើតគណនីថ្មី"}
            </h2>
            <p style={{ fontFamily: "'Battambang', sans-serif" }}>
              {authMode === "login"
                ? "សូមបញ្ចូលព័ត៌មានរបស់អ្នកដើម្បីចូលគណនី និងកុម្ម៉ង់ម្ហូប"
                : "ចុះឈ្មោះត្រឹមតែ ៣០ វិនាទី ដើម្បីតាមដានការកុម្ម៉ង់ និងវិក្កយបត្រ"}
            </p>
          </div>

          {/* Feedback & Error Alert View */}
          <AuthAlertView feedback={feedback} onDismiss={dismissFeedback} />

          {/* Tab 1: Sign In View */}
          {authMode === "login" ? (
            <LoginFormView
              identifier={identifier}
              onIdentifierChange={(val) => {
                setIdentifier(val);
                if (feedback?.type === "error") dismissFeedback();
              }}
              password={password}
              onPasswordChange={(val) => {
                setPassword(val);
                if (feedback?.type === "error") dismissFeedback();
              }}
              onSubmit={handleLogin}
              isLoading={isLoading}
              isSuccess={isSuccess}
            />
          ) : (
            /* Tab 2: Sign Up View */
            <SignUpFormView
              signupName={signupName}
              onNameChange={(val) => {
                setSignupName(val);
                if (feedback?.type === "error") dismissFeedback();
              }}
              signupEmail={signupEmail}
              onEmailChange={(val) => {
                setSignupEmail(val);
                if (feedback?.type === "error") dismissFeedback();
              }}
              signupPhone={signupPhone}
              onPhoneChange={(val) => {
                setSignupPhone(val);
                if (feedback?.type === "error") dismissFeedback();
              }}
              signupPassword={signupPassword}
              onPasswordChange={(val) => {
                setSignupPassword(val);
                if (feedback?.type === "error") dismissFeedback();
              }}
              confirmPassword={confirmPassword}
              onConfirmPasswordChange={(val) => {
                setConfirmPassword(val);
                if (feedback?.type === "error") dismissFeedback();
              }}
              signupAvatar={signupAvatar}
              onAvatarChange={setSignupAvatar}
              onSubmit={handleSignUp}
              isLoading={isLoading}
              isSuccess={isSuccess}
            />
          )}

          {/* View Footer: Switch Mode Links */}
          <div className="login-footer" style={{ fontFamily: "'Battambang', sans-serif" }}>
            <p>
              {authMode === "login" ? (
                <>
                  មិនទាន់មានគណនីមែនទេ?{" "}
                  <button
                    type="button"
                    className="auth-link-btn"
                    onClick={() => switchAuthMode("signup")}
                    style={{ fontFamily: "'Battambang', sans-serif" }}
                  >
                    ចុះឈ្មោះនៅទីនេះ →
                  </button>
                </>
              ) : (
                <>
                  មានគណនីរួចហើយមែនទេ?{" "}
                  <button
                    type="button"
                    className="auth-link-btn"
                    onClick={() => switchAuthMode("login")}
                    style={{ fontFamily: "'Battambang', sans-serif" }}
                  >
                    ចូលគណនីនៅទីនេះ →
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
