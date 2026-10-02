import { useRef } from "react";

/**
 * Pure Presentation Component: Create Account (Sign Up) Form
 * Includes optional avatar photo upload when creating an account.
 */
export default function SignUpFormView({
  signupName,
  onNameChange,
  signupEmail,
  onEmailChange,
  signupPhone,
  onPhoneChange,
  signupPassword,
  onPasswordChange,
  confirmPassword,
  onConfirmPasswordChange,
  signupAvatar,
  onAvatarChange,
  onSubmit,
  isLoading,
  isSuccess
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (JPG, PNG).");
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      alert("Photo must be less than 3MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (onAvatarChange) {
        onAvatarChange(event.target?.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <form onSubmit={onSubmit} className="auth-form-body">
      {/* Optional Photo Upload */}
      <div className="signup-avatar-row">
        <div
          className="signup-avatar-preview"
          onClick={() => fileInputRef.current?.click()}
          title="Click to upload profile photo"
        >
          {signupAvatar ? (
            <img src={signupAvatar} alt="Avatar" className="signup-avatar-img" />
          ) : (
            <span className="signup-avatar-icon">📷</span>
          )}
        </div>
        <div className="signup-avatar-info">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <button
            type="button"
            className="signup-photo-btn"
            onClick={() => fileInputRef.current?.click()}
          >
            {signupAvatar ? "Change Photo" : "Upload Profile Photo (Optional)"}
          </button>
          {signupAvatar && (
            <button
              type="button"
              className="signup-photo-remove"
              onClick={() => onAvatarChange("")}
            >
              Remove
            </button>
          )}
          <span className="signup-photo-hint">Adds your avatar to your customer account</span>
        </div>
      </div>

      <div className="form-group">
        <label>Full Name (ឈ្មោះ)</label>
        <input
          type="text"
          placeholder="e.g. Puthea Nita"
          value={signupName}
          onChange={(e) => onNameChange(e.target.value)}
          className="login-input"
          required
        />
      </div>

      <div className="form-row-2">
        <div className="form-group">
          <label>Email Address (អ៊ីមែល)</label>
          <input
            type="email"
            placeholder="nita@example.com"
            value={signupEmail}
            onChange={(e) => onEmailChange(e.target.value)}
            className="login-input"
            required
          />
        </div>

        <div className="form-group">
          <label>Phone (លេខទូរស័ព្ទ)</label>
          <input
            type="tel"
            placeholder="015 241471"
            value={signupPhone}
            onChange={(e) => onPhoneChange(e.target.value)}
            className="login-input"
          />
        </div>
      </div>

      <div className="form-row-2">
        <div className="form-group">
          <label>Password (យ៉ាងតិច 6 ខ្ទង់)</label>
          <input
            type="password"
            placeholder="••••••••"
            value={signupPassword}
            onChange={(e) => onPasswordChange(e.target.value)}
            className="login-input"
            required
            minLength={6}
          />
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => onConfirmPasswordChange(e.target.value)}
            className="login-input"
            required
            minLength={6}
          />
        </div>
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
            Account Created! Entering...
          </span>
        ) : isLoading ? (
          <span className="btn-status">
            <span className="btn-spinner"></span>
            Registering...
          </span>
        ) : (
          "Create Account & Sign In ✨"
        )}
      </button>
    </form>
  );
}
