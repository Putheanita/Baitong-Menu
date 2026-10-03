/**
 * Pure Presentation Component: Left Branding Panel
 */
export default function AuthBrandingView() {
  return (
    <div className="login-branding">
      <div className="brand-logo" style={{ fontFamily: "'Moul', 'Battambang', serif" }}>
        <span>🌿 ផ្ទះបៃតង (Baitong House)</span>
      </div>

      <h1 className="slogan-title" style={{ fontFamily: "'Moul', 'Battambang', serif", fontSize: "2rem", lineHeight: "1.4" }}>
        រសជាតិម្ហូបខ្មែរពិតៗ 🍲
      </h1>
      <p className="slogan-subtitle" style={{ fontFamily: "'Battambang', sans-serif" }}>
        ម្ហូបខ្មែរឈ្ងុយឆ្ងាញ់ ចម្អិនស្រស់ៗថ្មីៗរាល់ថ្ងៃ
      </p>

      <div className="brand-owner" style={{ fontFamily: "'Battambang', sans-serif", fontSize: "0.95rem", lineHeight: "1.6" }}>
        <div>ម្ចាស់ហាង: <strong style={{ color: "#ffd700" }}>CHUM BUNTHARY</strong> (ជុំ ប៊ុនថារី)</div>
        <div style={{ marginTop: "6px", fontSize: "0.88rem", opacity: 0.9 }}>
          អ្នកគ្រប់គ្រងគេហទំព័រ:{" "}
          <a
            href="mailto:putheanitaprom@gmail.com"
            style={{ color: "#ffffff", textDecoration: "underline" }}
          >
            Putheanita Prom (putheanitaprom@gmail.com)
          </a>
          {" "}<span>(015 241471)</span>
        </div>
      </div>
    </div>
  );
}
