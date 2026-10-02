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
  registeredUsers,
  handleSelectAccount,

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
  handleQuickDemo
}) {
  return (
    <div className="login-page">
      {/* Left Branding View */}
      <AuthBrandingView />

      {/* Right Form Card View */}
      <div className="login-form-container">
        <div className="login-card">
          {/* Mode Switcher Tabs */}
          <div className="auth-tab-group">
            <button
              type="button"
              className={`auth-tab-btn ${authMode === "login" ? "active" : ""}`}
              onClick={() => switchAuthMode("login")}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`auth-tab-btn ${authMode === "signup" ? "active" : ""}`}
              onClick={() => switchAuthMode("signup")}
            >
              Create Account ✨
            </button>
          </div>

          <div className="login-header">
            <h2>{authMode === "login" ? "Welcome Back" : "Create Account"}</h2>
            <p>
              {authMode === "login"
                ? "Enter your details or register a dynamic new account."
                : "Sign up in 30 seconds to track orders & save invoices."}
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
              onQuickDemo={handleQuickDemo}
              registeredUsers={registeredUsers}
              onSelectAccount={handleSelectAccount}
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
          <div className="login-footer">
            <p>
              {authMode === "login" ? (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    className="auth-link-btn"
                    onClick={() => switchAuthMode("signup")}
                  >
                    Create one here →
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="auth-link-btn"
                    onClick={() => switchAuthMode("login")}
                  >
                    Sign In here →
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
