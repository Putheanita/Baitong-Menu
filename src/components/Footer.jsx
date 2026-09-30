import "./Footer.css";

export default function Footer({ onNavigateShop, onNavigateAbout, onNavigateContact, onOpenCart }) {
  return (
    <footer className="main-footer">
      <div className="footer-top-strip">
        <div className="footer-container footer-features">
          <div className="footer-feature-item">
            <span className="feature-icon">✨</span>
            <div>
              <h4>100% Authentic Products</h4>
              <p>Direct from top Korean &amp; Asian beauty brands</p>
            </div>
          </div>
          <div className="footer-feature-item">
            <span className="feature-icon">🚚</span>
            <div>
              <h4>Fast Delivery in Cambodia</h4>
              <p>Phnom Penh same-day &amp; all 25 provinces</p>
            </div>
          </div>
          <div className="footer-feature-item">
            <span className="feature-icon">🏦</span>
            <div>
              <h4>Instant ABA Bank QR Pay</h4>
              <p>Fast, secure, and cash on delivery available</p>
            </div>
          </div>
          <div className="footer-feature-item">
            <span className="feature-icon">🧾</span>
            <div>
              <h4>Official Tax Invoices</h4>
              <p>Instant PDF &amp; downloadable transaction receipts</p>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-main">
        <div className="footer-container footer-grid">
          
          {/* Col 1: Brand Info */}
          <div className="footer-col brand-col">
            <div className="footer-logo">
              <span className="footer-logo-icon">🌿</span>
              <span className="footer-logo-text">SkinCare Co.</span>
            </div>
            <p className="footer-tagline">
              Your destination for clean, soothing botanical skincare and authentic makeup from Madagascar Centella, 3CE, Wakemake, Joocyee, and Rom&amp;nd.
            </p>
            <div className="footer-founder-tag">
              Founder: <strong>Ms Putheanita Prom</strong>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="footer-col">
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-links">
              <li><button type="button" onClick={onNavigateShop}>Shop All Products</button></li>
              <li><button type="button" onClick={onNavigateAbout}>About the Founder</button></li>
              <li><button type="button" onClick={onNavigateContact}>Contact &amp; Support</button></li>
              <li><button type="button" onClick={onOpenCart}>View Shopping Bag</button></li>
            </ul>
          </div>

          {/* Col 3: Popular Brands */}
          <div className="footer-col">
            <h4 className="footer-col-title">Featured Brands</h4>
            <ul className="footer-links">
              <li><span>Madagascar Centella</span></li>
              <li><span>Face Republic</span></li>
              <li><span>3CE Stylenanda</span></li>
              <li><span>WAKEMAKE Korea</span></li>
              <li><span>JOOCYEE Beauty</span></li>
              <li><span>ROM&amp;ND &amp; CLIO</span></li>
            </ul>
          </div>

          {/* Col 4: Store Contact & Hotline */}
          <div className="footer-col">
            <h4 className="footer-col-title">Store &amp; Hotline</h4>
            <div className="footer-contact-info">
              <p className="contact-line">
                📞 Hotline: <a href="tel:015241471" className="phone-highlight">015 241471</a>
              </p>
              <p className="contact-line">
                📍 Location: <span>Phnom Penh, Cambodia</span>
              </p>
              <p className="contact-line">
                ⏰ Hours: <span>Mon – Sat: 8:00 AM – 6:00 PM</span>
              </p>
              <p className="contact-line">
                ✉️ Support: <span>putheanitaprom@gmail.com</span>
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-container footer-bottom-content">
          <p>© {new Date().getFullYear()} SkinCare Co. Founded by Ms Putheanita Prom. All rights reserved.</p>
          <div className="footer-badges">
            <span className="badge-tag">🇰🇭 Phnom Penh, Cambodia</span>
            <span className="badge-tag">Official Store</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
