import { useState, useEffect } from "react";
import "./WelcomeModal.css";

const CHEF_MOM_IMAGE = "/images/chum-bunthary-portrait.png";

const SLIDES = [
  {
    id: "chef",
    type: "chef",
    badge: "👩‍🍳 មេចុងភៅឯក & ម្ចាស់ហាង (Head Chef & Owner)",
    title: "លោកស្រី ជុំ ប៊ុនថារី (CHUM BUNTHARY)",
    subtitle: "ស្នាដៃម្ហូបខ្មែរបុរាណដូនតា ចម្អិនដោយក្តីស្រឡាញ់ និងគ្រឿងផ្សំក្នុងស្រុកពិតៗ",
    image: CHEF_MOM_IMAGE
  },
  {
    id: "amok",
    type: "dish",
    badge: "🍲 មុខម្ហូបប្រចាំហាង (Signature Dish)",
    title: "អាម៉ុកត្រីស្លឹកចេក (Traditional Fish Amok)",
    subtitle: "ចម្អិនជាមួយគ្រឿងបុកត្បាល់ថ្ម ខ្ទិះដូងស្រស់ និងស្លឹកញ",
    image: "/images/khmer-fish-amok.jpg"
  },
  {
    id: "loklak",
    type: "dish",
    badge: "🥩 ម្ហូបឆាក្តៅៗ (Wok Specialties)",
    title: "ឡុកឡាក់សាច់គោខ្ទះក្តៅ (Beef Lok Lak)",
    subtitle: "សាច់គោផុយទន់ ជ្រលក់ទឹកត្រីម្រេចក្រូចឆ្មាកំពតពិតៗ",
    image: "/images/khmer-lok-lak.jpg"
  },
  {
    id: "numbanhchok",
    type: "dish",
    badge: "🍜 កេរដំណែលដូនតា (Royal Heritage)",
    title: "នំបញ្ចុកសម្លខ្មែរ (Num Banh Chok Khmer)",
    subtitle: "សរសៃនំស្រស់ ស្រោចទឹកសម្លប្រហើរត្រីអណ្តែងរ៉ស់ឈ្ងុយឆ្ងាញ់",
    image: "/images/khmer-num-banh-chok.jpg"
  },
  {
    id: "dessert",
    type: "dish",
    badge: "🥭 បង្អែមខ្មែរ (Traditional Dessert)",
    title: "បាយដំណើបស្វាយទុំ (Mango Sticky Rice)",
    subtitle: "ដំណើបខ្ទិះដូងឈ្ងុយ សាច់ស្វាយកែវរមៀតផ្អែមស្រទន់",
    image: "/images/khmer-mango-sticky-rice.jpg"
  }
];

export default function WelcomeModal({ isOpen, onClose, onExploreMenu }) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isChefRevealed, setIsChefRevealed] = useState(false);

  // Step 1: Open with title only
  // Step 2: Smooth transition to reveal the chef photo after 1.5s
  useEffect(() => {
    if (!isOpen) {
      setIsChefRevealed(false);
      setCurrentSlideIndex(0);
      return;
    }

    // Always start with title-only view
    setIsChefRevealed(false);
    setCurrentSlideIndex(0);

    // Transition smoothly to reveal chef photo
    const revealTimer = setTimeout(() => {
      setIsChefRevealed(true);
    }, 1500);

    return () => clearTimeout(revealTimer);
  }, [isOpen]);

  // Auto-slide every 4 seconds ONLY after chef is revealed and not paused
  useEffect(() => {
    if (!isOpen || isPaused || !isChefRevealed) return;

    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % SLIDES.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [isOpen, isPaused, isChefRevealed]);

  if (!isOpen) return null;

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const currentSlide = SLIDES[currentSlideIndex];

  const handleEnterRestaurant = () => {
    if (onClose) onClose();
    if (onExploreMenu) onExploreMenu();
  };

  return (
    <div className="welcome-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className={`welcome-modal-card ${isChefRevealed ? "chef-revealed" : "title-only"}`}
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Top Close Button */}
        <button className="welcome-modal-close-btn" onClick={onClose} aria-label="បិទផ្ទាំងស្វាគមន៍">
          &times;
        </button>

        {/* Transition Teaser (when in title-only mode) */}
        {!isChefRevealed && (
          <div className="wm-transition-teaser" onClick={() => setIsChefRevealed(true)} title="ចុចដើម្បីមើលរូបមេចុងភៅភ្លាមៗ">
            <div className="wm-teaser-pulse"></div>
            <span>កំពុងរៀបចំបង្ហាញរូបមេចុងភៅ... (ចុចមើលភ្លាមៗ)</span>
          </div>
        )}

        <div className="welcome-modal-grid">
          
          {/* ════════════════════════════════════════════════
              LEFT COLUMN: Exact Branding from Screenshot
             ════════════════════════════════════════════════ */}
          <div className="wm-left-panel">
            {/* Brand Logo with Soup Bowl */}
            <div className="wm-brand-logo">
              <span className="wm-brand-icon">🍲</span>
              <span className="wm-brand-name">SOVANNAPHUM KHMER CUISINE</span>
              <span className="wm-brand-sub">• ផ្ទះបៃតង</span>
            </div>

            {/* Slogan Title */}
            <div className="wm-title-wrap">
              <h1 className="wm-main-title">
                Taste the Soul of Cambodia <span className="wm-title-emoji">🍲</span>
              </h1>
              <h2 className="wm-khmer-title">
                រសជាតិម្ហូបខ្មែរពិតៗ
              </h2>
            </div>

            {/* Slogan Subtitle */}
            <p className="wm-subtitle-en">
              Authentic Cambodian dishes, cooked fresh daily
            </p>
            <p className="wm-subtitle-kh">
              ម្ហូបខ្មែរឈ្ងុយឆ្ងាញ់ប្រពៃណី ចម្អិនស្រស់ៗថ្មីៗរាល់ថ្ងៃ
            </p>

            {/* Action Buttons */}
            <div className="wm-action-wrap">
              <button
                type="button"
                className="wm-enter-btn"
                onClick={handleEnterRestaurant}
              >
                <span>🍽️ ចូលមើលបញ្ជីមុខម្ហូប (Explore Menu)</span>
              </button>

              {!isChefRevealed ? (
                <button
                  type="button"
                  className="wm-reveal-chef-btn"
                  onClick={() => setIsChefRevealed(true)}
                  title="ចុចដើម្បីបង្ហាញរូបមេចុងភៅភ្លាមៗ"
                >
                  <span>👩‍🍳 បង្ហាញរូបមេចុងភៅ (Meet Chef)</span>
                  <span className="wm-arrow-anim">➔</span>
                </button>
              ) : (
                <div className="wm-chef-revealed-tag">
                  <span className="wm-live-sparkle">✨</span>
                  <span>មេចុងភៅឯក & ម្ចាស់ហាង</span>
                </div>
              )}
            </div>

            {/* Founder Footer matching screenshot */}
            <div className="wm-founder-box">
              <div className="wm-founder-row">
                <span className="wm-founder-lbl">ម្ចាស់ហាង (Shop Owner):</span>
                <strong className="wm-founder-val">CHUM BUNTHARY</strong>
                <span className="wm-founder-phone">(015 241471)</span>
              </div>
              <div className="wm-manager-row">
                <span className="wm-founder-lbl">អ្នកគ្រប់គ្រងគេហទំព័រ (Website Manager):</span>
                <a href="mailto:putheanitaprom@gmail.com" className="wm-manager-link">
                  putheanitaprom@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* ════════════════════════════════════════════════
              RIGHT COLUMN: Interactive Photo Slideshow
             ════════════════════════════════════════════════ */}
          <div className="wm-right-slideshow-panel">
            <div className="wm-slideshow-viewport">
              
              {/* Active Slide Image */}
              <div className="wm-slide-image-wrap">
                <img
                  key={currentSlideIndex}
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  className="wm-slide-img fade-in"
                />
              </div>

              {/* Slide Caption Box */}
              <div className="wm-slide-caption">
                <span className="wm-slide-badge">{currentSlide.badge}</span>
                <h3 className="wm-slide-title">{currentSlide.title}</h3>
                <p className="wm-slide-desc">{currentSlide.subtitle}</p>
              </div>

              {/* Slideshow Nav Arrows */}
              <button
                type="button"
                className="wm-slide-arrow left"
                onClick={prevSlide}
                aria-label="រូបមុន"
              >
                ‹
              </button>
              <button
                type="button"
                className="wm-slide-arrow right"
                onClick={nextSlide}
                aria-label="រូបបន្ទាប់"
              >
                ›
              </button>

              {/* Dots Indicators */}
              <div className="wm-slide-dots">
                {SLIDES.map((slide, idx) => (
                  <button
                    key={slide.id}
                    type="button"
                    className={`wm-dot ${idx === currentSlideIndex ? "active" : ""}`}
                    onClick={() => setCurrentSlideIndex(idx)}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
