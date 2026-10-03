import { useState } from "react";
import "./Contact.css";

function Contact({ onBack, onNavigateShop, onNavigateAbout }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return;
    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => {
      setSubmitted(false);
    }, 4500);
  };

  return (
    <div className="contact-page">
      {/* Header */}
      <header className="contact-header">
        <div className="contact-header-left">
          <button onClick={onBack} className="contact-back-btn" style={{ fontFamily: "'Battambang', sans-serif" }}>
            ← ត្រឡប់ក្រោយ
          </button>
          <span className="contact-header-brand" style={{ fontFamily: "'Moul', 'Battambang', serif" }}>
            ផ្ទះបៃតង (Baitong House)
          </span>
        </div>

        <nav className="contact-nav">
          <span className="contact-nav-item" onClick={onNavigateShop || onBack} style={{ fontFamily: "'Battambang', sans-serif" }}>
            មុខម្ហូប
          </span>
          <span className="contact-nav-item" onClick={onNavigateAbout} style={{ fontFamily: "'Battambang', sans-serif" }}>
            អំពីយើង
          </span>
          <span className="contact-nav-item active" style={{ fontFamily: "'Battambang', sans-serif" }}>
            កក់តុ &amp; ទំនាក់ទំនង
          </span>
        </nav>
      </header>

      <main className="contact-container">
        {/* Hero Section */}
        <div className="contact-hero">
          <span className="contact-badge" style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}>
            ទំនាក់ទំនងមកកាន់យើង
          </span>
          <h1 style={{ fontFamily: "'Moul', 'Dangrek', 'Battambang', serif" }}>
            កក់តុអាហារ &amp; ទំនាក់ទំនងសាកសួរ
          </h1>
          <p style={{ fontFamily: "'Battambang', sans-serif" }}>
            មានចម្ងល់អំពីការកក់តុ កម្មវិធីជប់លៀងគ្រួសារ ឬមុខម្ហូបខ្មែរប្រចាំហាង ក្រុមការងារផ្ទះបៃតងរីករាយបម្រើលោកអ្នកជានិច្ច។
          </p>
        </div>

        <div className="contact-grid">
          {/* Contact Information & Channels */}
          <div className="contact-info-card">
            <h2 style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}>ព័ត៌មានទំនាក់ទំនងផ្ទាល់</h2>
            <p className="info-subtitle" style={{ fontFamily: "'Battambang', sans-serif" }}>
              ទាក់ទងមកកាន់ផ្នែកបម្រើអតិថិជន ឬថ្នាក់ដឹកនាំហាងដោយផ្ទាល់។
            </p>

            <div className="info-item">
              <div className="info-icon">📞</div>
              <div className="info-text">
                <span className="info-label" style={{ fontFamily: "'Battambang', sans-serif" }}>ខ្សែទូរស័ព្ទកុម្ម៉ង់ &amp; កក់តុ (Hotline)</span>
                <a href="tel:015241471" className="info-value">015 241471 (ខ្សែផ្ទាល់)</a>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">✉️</div>
              <div className="info-text">
                <span className="info-label" style={{ fontFamily: "'Battambang', sans-serif" }}>អ៊ីមែលផ្លូវការ (អ្នកគ្រប់គ្រងគេហទំព័រ)</span>
                <a href="mailto:putheanitaprom@gmail.com" className="info-value">putheanitaprom@gmail.com</a>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">📍</div>
              <div className="info-text">
                <span className="info-label" style={{ fontFamily: "'Battambang', sans-serif" }}>ទីតាំងភោជនីយដ្ឋាន</span>
                <span className="info-value" style={{ fontFamily: "'Battambang', sans-serif" }}>ផ្លូវលេខ ២៧១ រាជធានីភ្នំពេញ កម្ពុជា</span>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">⏰</div>
              <div className="info-text">
                <span className="info-label" style={{ fontFamily: "'Battambang', sans-serif" }}>ម៉ោងបម្រើការ &amp; ដឹកជញ្ជូន</span>
                <span className="info-value" style={{ fontFamily: "'Battambang', sans-serif" }}>រៀងរាល់ថ្ងៃ: ៧:០០ ព្រឹក – ៩:៣០ យប់</span>
              </div>
            </div>

            {/* Social Channels with Founders */}
            <div className="leadership-connect">
              <h3 style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}>ថ្នាក់ដឹកនាំហាង</h3>
              <div className="social-links-group">
                <a
                  href="https://www.facebook.com/share/1ExFCeLE93/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-social-pill"
                  style={{ fontFamily: "'Battambang', sans-serif" }}
                >
                  <span className="social-icon">🌿</span>
                  <span>ម្ចាស់ហាង: លោកស្រី ជុំ ប៊ុនថារី (CHUM BUNTHARY)</span>
                </a>
                <a
                  href="https://www.facebook.com/share/18cXkjfnwn/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-social-pill"
                  style={{ fontFamily: "'Battambang', sans-serif" }}
                >
                  <span className="social-icon">✨</span>
                  <span>អ្នកគ្រប់គ្រងគេហទំព័រ: Putheanita Prom (015 241471)</span>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form Card */}
          <div className="contact-form-card">
            <h2 style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}>ផ្ញើសារ ឬស្នើសុំកក់តុ</h2>
            <p className="form-subtitle" style={{ fontFamily: "'Battambang', sans-serif" }}>
              សូមបំពេញទម្រង់បែបបទខាងក្រោម ក្រុមការងារយើងនឹងឆ្លើយតបជូនយ៉ាងរហ័ស។
            </p>

            {submitted && (
              <div className="contact-success-alert" style={{ fontFamily: "'Battambang', sans-serif" }}>
                <span className="alert-icon">✓</span>
                <div>
                  <strong>សូមអរគុណ!</strong> យើងខ្ញុំបានទទួលសាររបស់លោកអ្នកហើយ។ ក្រុមការងារ ផ្ទះបៃតង នឹងឆ្លើយតបជូនឆាប់ៗនេះ។
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="contact-form-row">
                <div className="contact-form-group">
                  <label htmlFor="name" style={{ fontFamily: "'Battambang', sans-serif" }}>ឈ្មោះរបស់អ្នក *</label>
                  <input
                    id="name"
                    type="text"
                    required
                    placeholder="បញ្ចូលឈ្មោះរបស់អ្នក"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ fontFamily: "'Battambang', sans-serif" }}
                  />
                </div>
                <div className="contact-form-group">
                  <label htmlFor="email" style={{ fontFamily: "'Battambang', sans-serif" }}>អាសយដ្ឋានអ៊ីមែល *</label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="example@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{ fontFamily: "'Battambang', sans-serif" }}
                  />
                </div>
              </div>

              <div className="contact-form-group">
                <label htmlFor="subject" style={{ fontFamily: "'Battambang', sans-serif" }}>ប្រធានបទ</label>
                <input
                  id="subject"
                  type="text"
                  placeholder="ឧ. កក់តុអាហារពេលល្ងាច, កុម្ម៉ង់កម្មវិធីជប់លៀង..."
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  style={{ fontFamily: "'Battambang', sans-serif" }}
                />
              </div>

              <div className="contact-form-group">
                <label htmlFor="message" style={{ fontFamily: "'Battambang', sans-serif" }}>ខ្លឹមសារសារ *</label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  placeholder="រៀបរាប់ពីព័ត៌មានលម្អិតនៃការកក់តុ ចំនួនភ្ញៀវ ឬមុខម្ហូបដែលចង់កុម្ម៉ង់..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{ fontFamily: "'Battambang', sans-serif" }}
                ></textarea>
              </div>

              <button type="submit" className="contact-submit-btn" style={{ fontFamily: "'Battambang', sans-serif" }}>
                ផ្ញើសារឥឡូវនេះ
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Contact;
