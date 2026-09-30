/**
 * Pure Presentation Component: Left Branding Panel
 */
export default function AuthBrandingView() {
  return (
    <div className="login-branding">
      <div className="brand-logo">
        <span>🌿 SkinCare Co.</span>
      </div>

      <h1 className="slogan-title">Your skin, but better 🌿</h1>
      <p className="slogan-subtitle">Glow naturally with clean skincare</p>

      <div className="brand-owner">
        Owner:{" "}
        <a
          href="https://www.facebook.com/share/1ExFCeLE93/?mibextid=wwXIfr"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ms Putheanita Prom (015 241471)
        </a>
      </div>
    </div>
  );
}
