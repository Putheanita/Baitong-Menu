import "./WelcomeHeroView.css";

export default function WelcomeHeroView({ onExploreMenu, onNavigateContact, onOpenSlideshow }) {
  return (
    <section className="welcome-split-hero">
      <div className="welcome-split-container">
        
        {/* ════════════════════════════════════════════════
            LEFT SIDE: Exact Welcome Branding & Slogan
           ════════════════════════════════════════════════ */}
        <div className="welcome-left-panel">
          {/* Top Brand Tag */}
          <div className="welcome-top-brand">
            <span className="welcome-brand-emoji">🍲</span>
            <span className="welcome-brand-text">SOVANNAPHUM KHMER CUISINE</span>
            <span className="welcome-brand-subtag">• ផ្ទះបៃតង</span>
          </div>

          {/* Majestic Headline */}
          <div className="welcome-title-wrap">
            <h1 className="welcome-main-title">
              Taste the Soul of Cambodia <span className="title-emoji">🍲</span>
            </h1>
            <h2 className="welcome-khmer-title">
              រសជាតិម្ហូបខ្មែរពិតៗ
            </h2>
          </div>

          {/* Subtitles */}
          <p className="welcome-subtitle">
            Authentic Cambodian dishes, cooked fresh daily
          </p>
          <p className="welcome-subtitle-kh">
            ម្ហូបខ្មែរឈ្ងុយឆ្ងាញ់ប្រពៃណី ចម្អិនស្រស់ៗថ្មីៗរាល់ថ្ងៃ
          </p>

          {/* Quick Action Buttons */}
          <div className="welcome-actions-row">
            <button
              type="button"
              className="welcome-explore-btn"
              onClick={onExploreMenu}
            >
              <span>📖 មើលបញ្ជីមុខម្ហូប (Explore Menu)</span>
            </button>
            {onOpenSlideshow && (
              <button
                type="button"
                className="welcome-slideshow-btn"
                onClick={onOpenSlideshow}
                title="បើកផ្ទាំងស្លាយស្វាគមន៍ &amp; រូបមេចុងភៅ"
              >
                <span>🎞️ ស្លាយស្វាគមន៍ &amp; មេចុងភៅ</span>
              </button>
            )}
            {onNavigateContact && (
              <button
                type="button"
                className="welcome-contact-btn"
                onClick={onNavigateContact}
              >
                <span>📞 កក់តុ &amp; ទំនាក់ទំនង</span>
              </button>
            )}
          </div>

          {/* Bottom Founder & Owner Tag */}
          <div className="welcome-founder-footer">
            <div className="founder-row">
              <span className="founder-label">ម្ចាស់ហាង (Shop Owner):</span>
              <strong className="founder-name">CHUM BUNTHARY</strong>
              <span className="founder-phone">(015 241471)</span>
            </div>
            <div className="manager-row">
              <span className="founder-label">អ្នកគ្រប់គ្រងគេហទំព័រ (Website Manager):</span>
              <a href="mailto:putheanitaprom@gmail.com" className="manager-email">
                putheanitaprom@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════
            RIGHT SIDE: Signature Khmer Dishes Showcase (NO CHEF PHOTO)
           ════════════════════════════════════════════════ */}
        <div className="welcome-right-dishes-panel">
          <div className="hero-dishes-card">
            
            <div className="hero-dishes-header">
              <span className="hero-dishes-badge">🍲 មុខម្ហូបខ្មែរប្រចាំហាង (Signature Specialties)</span>
              <span className="hero-dishes-fresh">✨ ចម្អិនក្តៅៗរាល់ថ្ងៃ</span>
            </div>

            <div className="hero-dish-featured">
              <div className="hero-dish-img-wrap">
                <img
                  src="/images/khmer-fish-amok.jpg"
                  alt="អាម៉ុកត្រីស្លឹកចេក"
                  className="hero-dish-cover"
                />
                <span className="hero-dish-price-tag">$6.50</span>
              </div>
              <div className="hero-dish-info">
                <h3 className="hero-dish-title">អាម៉ុកត្រីស្លឹកចេកប្រពៃណី</h3>
                <p className="hero-dish-desc">
                  ត្រីផ្ទក់បឹងទន្លេសាបស្រស់ ចំហុយជាមួយគ្រឿងបុកត្បាល់ថ្ម និងខ្ទិះដូងខាប់ឈ្ងុយឆ្ងាញ់
                </p>
              </div>
            </div>

            {/* Quick Feature Badges */}
            <div className="hero-perks-grid">
              <div className="hero-perk-pill">
                <span>🌿</span> គ្រឿងបុកត្បាល់ថ្ម ១០០%
              </div>
              <div className="hero-perk-pill">
                <span>🚀</span> ដឹកជូនក្តៅៗទាន់ចិត្ត
              </div>
              <div className="hero-perk-pill">
                <span>🏦</span> ស្កេនទូទាត់ ABA KHQR
              </div>
              <div className="hero-perk-pill">
                <span>🌾</span> អង្ករផ្ការំដួលខ្មែរ
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
