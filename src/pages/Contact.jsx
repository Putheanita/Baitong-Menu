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
          <button onClick={onBack} className="contact-back-btn">
            ← Back
          </button>
          <span className="contact-header-brand">SkinCare Co.</span>
        </div>

        <nav className="contact-nav">
          <span className="contact-nav-item" onClick={onNavigateShop || onBack}>
            Shop
          </span>
          <span className="contact-nav-item" onClick={onNavigateAbout}>
            About
          </span>
          <span className="contact-nav-item active">
            Contact
          </span>
        </nav>
      </header>

      <main className="contact-container">
        {/* Hero Section */}
        <div className="contact-hero">
          <span className="contact-badge">GET IN TOUCH</span>
          <h1>We’d Love to Hear from You</h1>
          <p>
            Have a question about our clean botanical formulations, need skin advice, or want to partner with us? Our team is always here for you.
          </p>
        </div>

        <div className="contact-grid">
          {/* Contact Information & Channels */}
          <div className="contact-info-card">
            <h2>Direct Channels</h2>
            <p className="info-subtitle">
              Reach out to our customer care or connect with our leadership team directly.
            </p>

            <div className="info-item">
              <div className="info-icon">📞</div>
              <div className="info-text">
                <span className="info-label">Customer Hotline / Phone</span>
                <a href="tel:015" className="info-value">015 (Direct Support)</a>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">✉️</div>
              <div className="info-text">
                <span className="info-label">Official Email</span>
                <a href="mailto:putheanitaprom@gmail.com" className="info-value">putheanitaprom@gmail.com</a>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">📍</div>
              <div className="info-text">
                <span className="info-label">Office & Studio</span>
                <span className="info-value">Phnom Penh, Cambodia</span>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">⏰</div>
              <div className="info-text">
                <span className="info-label">Business Hours</span>
                <span className="info-value">Monday – Saturday: 8:00 AM – 6:00 PM</span>
              </div>
            </div>

            {/* Social Channels with Founders */}
            <div className="leadership-connect">
              <h3>Connect with Leadership</h3>
              <div className="social-links-group">
                <a
                  href="https://www.facebook.com/share/1ExFCeLE93/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-social-pill"
                >
                  <span className="social-icon">🌿</span>
                  <span>Founder: Ms. Putheanita Prom</span>
                </a>
                <a
                  href="https://www.facebook.com/share/18cXkjfnwn/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-social-pill"
                >
                  <span className="social-icon">✨</span>
                  <span>General Manager: Ms. Sorrachna Prom</span>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form Card */}
          <div className="contact-form-card">
            <h2>Send Us a Message</h2>
            <p className="form-subtitle">Fill out the form below and we will respond within 24 hours.</p>

            {submitted && (
              <div className="contact-success-alert">
                <span className="alert-icon">✓</span>
                <div>
                  <strong>Thank you!</strong> Your message has been received. Our team will get back to you shortly.
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="contact-form-row">
                <div className="contact-form-group">
                  <label htmlFor="name">Your Name *</label>
                  <input
                    id="name"
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="contact-form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="yourname@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="contact-form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  id="subject"
                  type="text"
                  placeholder="E.g., Product Inquiry, Skin Barrier Advice"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div className="contact-form-group">
                <label htmlFor="message">Your Message *</label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  placeholder="How can we help your skincare journey?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
              </div>

              <button type="submit" className="contact-submit-btn">
                Send Inquiry Message
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Contact;
