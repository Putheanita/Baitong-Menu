import { useState, useEffect } from "react";
import "./PchumBenBanner.css";

// 🪷 Pchum Ben Promo: Sep 30, 2026 → Oct 12, 2026
const PROMO_START_DATE = new Date("2026-09-30T00:00:00");
const PROMO_END_DATE   = new Date("2026-10-12T23:59:59");
const PROMO_CODE       = "BAITONG";

function getTimeLeft() {
  const now = new Date();
  if (now < PROMO_START_DATE || now > PROMO_END_DATE) return null;
  const diff = PROMO_END_DATE - now;
  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

export default function PchumBenBanner({ onClose }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      const t = getTimeLeft();
      setTimeLeft(t);
      if (!t) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(PROMO_CODE).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose && onClose(), 350);
  };

  if (!timeLeft) return null;

  return (
    <section className={`pcb-banner ${isVisible ? "pcb-enter" : "pcb-exit"}`}>
      {/* Background Artwork */}
      <div className="pcb-bg-artwork" aria-hidden="true" />
      <div className="pcb-right-blur" aria-hidden="true" />

      <div className="pcb-container">
        <div className="pcb-left-spacer" aria-hidden="true"></div>

        <div className="pcb-promo-content">
          {/* Title Header */}
          <div className="pcb-header-group">
            <h1 className="pcb-title" style={{ fontFamily: "'Moul', 'Dangrek', 'Battambang', serif" }}>
              ភ្ជុំបិណ្ឌ
            </h1>
            <p className="pcb-subtitle" style={{ fontFamily: "'Battambang', sans-serif" }}>
              ពិធីបុណ្យភ្ជុំបិណ្ឌប្រពៃណីជាតិខ្មែរ • ផ្ទះបៃតង
            </p>
          </div>

          {/* 20% Offer + Countdown Timer Row */}
          <div className="pcb-offer-row">
            <div className="pcb-discount-badge">
              <span className="pcb-discount-pct">20%</span>
              <div className="pcb-discount-labels" style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}>
                <span className="pcb-discount-off">បញ្ចុះ</span>
                <span className="pcb-discount-site">ទូទាំងហាង</span>
              </div>
            </div>

            <div className="pcb-timer-block" style={{ fontFamily: "'Battambang', sans-serif" }}>
              <span className="pcb-ends-label">⏳ ផុតកំណត់ត្រឹម ថ្ងៃទី១២ តុលា:</span>
              <div className="pcb-timer-wrap">
                <div className="pcb-timer-unit">
                  <span className="pcb-timer-num">{String(timeLeft.days).padStart(2, "0")}</span>
                  <span className="pcb-timer-lbl">ថ្ងៃ</span>
                </div>
                <span className="pcb-timer-sep">:</span>
                <div className="pcb-timer-unit">
                  <span className="pcb-timer-num">{String(timeLeft.hours).padStart(2, "0")}</span>
                  <span className="pcb-timer-lbl">ម៉ោង</span>
                </div>
                <span className="pcb-timer-sep">:</span>
                <div className="pcb-timer-unit">
                  <span className="pcb-timer-num">{String(timeLeft.minutes).padStart(2, "0")}</span>
                  <span className="pcb-timer-lbl">នាទី</span>
                </div>
                <span className="pcb-timer-sep">:</span>
                <div className="pcb-timer-unit">
                  <span className="pcb-timer-num">{String(timeLeft.seconds).padStart(2, "0")}</span>
                  <span className="pcb-timer-lbl">វិនាទី</span>
                </div>
              </div>
            </div>
          </div>

          {/* Promo Code Section */}
          <div className="pcb-code-section">
            <div className="pcb-code-labels" style={{ fontFamily: "'Battambang', sans-serif" }}>
              <p className="pcb-code-kh-label">វាយលេខកូដ</p>
              <p className="pcb-code-label">ប្រើកូដពេលកុម្ម៉ង់ទូទាត់</p>
            </div>

            <button
              className={`pcb-code-btn ${copied ? "pcb-copied" : ""}`}
              onClick={handleCopy}
              id="pchumben-copy-btn"
              title="ចុចដើម្បីចម្លងកូដ"
            >
              <span className="pcb-code-text">{PROMO_CODE}</span>
              <span className="pcb-copy-icon">
                {copied ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                )}
              </span>
            </button>

            <div className="pcb-copied-msg" style={{ fontFamily: "'Battambang', sans-serif" }}>
              {copied ? "✓ បានចម្លងកូដជោគជ័យ!" : "\u00a0"}
            </div>
          </div>

          <span className="pcb-perk-text" style={{ fontFamily: "'Battambang', sans-serif" }}>
            ✦ បញ្ចុះតម្លៃ 20% គ្រប់មុខម្ហូប • ដឹកជញ្ជូនឥតគិតថ្លៃសម្រាប់ការកុម្ម៉ង់លើសពី $30
          </span>
        </div>
      </div>

      <button className="pcb-close-btn" onClick={handleClose} aria-label="បិទផ្ទាំងផ្សាយ">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </section>
  );
}
