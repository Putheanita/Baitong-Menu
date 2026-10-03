import { toKhmerDigits } from "../utils/khmerDate";
import "./Footer.css";

export default function Footer({ onNavigateShop, onNavigateAbout, onNavigateContact, onOpenCart, onOpenTableBooking, onOpenOrderTracking }) {
  return (
    <footer className="main-footer">
      <div className="footer-top-strip">
        <div className="footer-container footer-features">
          <div className="footer-feature-item">
            <span className="feature-icon">🍲</span>
            <div>
              <h4 style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}>រូបមន្តម្ហូបខ្មែរបុរាណពិតៗ</h4>
              <p style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}>គ្រឿងបុកត្បាល់ថ្មស្រស់ៗ មិនប្រើសារធាតុគីមី</p>
            </div>
          </div>
          <div className="footer-feature-item">
            <span className="feature-icon">🚀</span>
            <div>
              <h4 style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}>ដឹកជញ្ជូនរហ័សទាន់ចិត្ត</h4>
              <p style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}>ចម្អិនក្តៅៗលើខ្ទះ ដឹកជូនផ្ទាល់ក្នុងភ្នំពេញ</p>
            </div>
          </div>
          <div className="footer-feature-item">
            <span className="feature-icon">🏦</span>
            <div>
              <h4 style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}>ទូទាត់រហ័ស ABA KHQR</h4>
              <p style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}>ងាយស្រួល សុវត្ថិភាព និងទូទាត់ពេលដឹកមកដល់</p>
            </div>
          </div>
          <div className="footer-feature-item">
            <span className="feature-icon">🧾</span>
            <div>
              <h4 style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}>វិក្កយបត្រម្ហូបផ្លូវការ</h4>
              <p style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}>ទាញយកឯកសារ ឬរក្សាទុកជា PDF ភ្លាមៗ</p>
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
              <span className="footer-logo-text" style={{ fontFamily: "'Moul', 'Battambang', serif" }}>
                ផ្ទះបៃតង (Baitong House)
              </span>
            </div>
            <p className="footer-tagline" style={{ fontFamily: "'Dangrek', 'Battambang', cursive", lineHeight: "1.7" }}>
              នាំមកជូននូវរសជាតិម្ហូបខ្មែរប្រពៃណីពិតៗ ឈ្ងុយឆ្ងាញ់ ចម្អិនស្រស់ៗថ្មីៗរាល់ថ្ងៃ ជាមួយគ្រឿងផ្សំក្នុងស្រុកគុណភាពខ្ពស់ ពីខេត្តកំពត បាត់ដំបង និងទន្លេសាប។
            </p>
            <div className="footer-founder-tag" style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}>
              <div>ម្ចាស់ហាង: <strong style={{ color: "#ffd166" }}>CHUM BUNTHARY</strong> (ជុំ ប៊ុនថារី)</div>
              <div style={{ marginTop: "4px", fontSize: "0.85rem", opacity: 0.9 }}>
                អ្នកគ្រប់គ្រងគេហទំព័រ: Putheanita Prom (putheanitaprom@gmail.com)
              </div>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="footer-col">
            <h4 className="footer-col-title" style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}>
              រុករកទំព័រ
            </h4>
            <ul className="footer-links" style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}>
              <li><button type="button" onClick={onNavigateShop}>មុខម្ហូបខ្មែរទាំងអស់</button></li>
              {onOpenTableBooking ? (
                <li><button type="button" onClick={onOpenTableBooking} style={{ color: "#ffd166", fontWeight: 700 }}>🍽️ កក់តុអាហារអនឡាញ</button></li>
              ) : (
                <li><button type="button" onClick={onNavigateContact}>កក់តុ &amp; ទំនាក់ទំនង</button></li>
              )}
              {onOpenOrderTracking && (
                <li><button type="button" onClick={onOpenOrderTracking} style={{ color: "#a7f3d0" }}>🕒 តាមដានស្ថានភាពម្ហូប</button></li>
              )}
              <li><button type="button" onClick={onNavigateAbout}>អំពីម្ចាស់ហាង &amp; ថ្នាក់ដឹកនាំ</button></li>
              <li><button type="button" onClick={onNavigateContact}>ទំនាក់ទំនង &amp; ផែនទី</button></li>
              <li><button type="button" onClick={onOpenCart}>មើលកន្ត្រកម្ហូប</button></li>
            </ul>
          </div>

          {/* Col 3: Signature Specialties */}
          <div className="footer-col">
            <h4 className="footer-col-title" style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}>
              មុខម្ហូបពិសេសប្រចាំហាង
            </h4>
            <ul className="footer-links" style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}>
              <li><span>អាម៉ុកត្រីស្លឹកចេក</span></li>
              <li><span>ឡុកឡាក់សាច់គោខ្ទះក្តៅ</span></li>
              <li><span>នំបញ្ចុកសម្លខ្មែរ</span></li>
              <li><span>ឆាមឹកម្រេចខ្ចីកំពត</span></li>
              <li><span>សម្លកកូរត្រីឆ្លូញ</span></li>
              <li><span>បាយដំណើបស្វាយទុំ</span></li>
            </ul>
          </div>

          {/* Col 4: Store Contact & Hotline */}
          <div className="footer-col">
            <h4 className="footer-col-title" style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}>
              ផ្ទះបាយ &amp; ការកុម្ម៉ង់
            </h4>
            <div className="footer-contact-info" style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}>
              <p className="contact-line">
                📞 ខ្សែទូរស័ព្ទកុម្ម៉ង់: <a href="tel:015241471" className="phone-highlight">015 241471</a>
              </p>
              <p className="contact-line">
                📍 ទីតាំង: <span>រាជធានីភ្នំពេញ កម្ពុជា</span>
              </p>
              <p className="contact-line">
                ⏰ ម៉ោងបម្រើការ: <span>រៀងរាល់ថ្ងៃ: ៧:០០ ព្រឹក – ៩:៣០ យប់</span>
              </p>
              <p className="contact-line">
                ✉️ អ៊ីមែល: <span>putheanitaprom@gmail.com</span>
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-container footer-bottom-content" style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}>
          <p>© ឆ្នាំ{toKhmerDigits(new Date().getFullYear())} ផ្ទះបៃតង (Baitong House)។ ម្ចាស់ហាង: CHUM BUNTHARY (ជុំ ប៊ុនថារី) • អ្នកគ្រប់គ្រងគេហទំព័រ: Putheanita Prom។ រក្សាសិទ្ធិគ្រប់យ៉ាង។</p>
          <div className="footer-badges">
            <span className="badge-tag">🇰🇭 រាជធានីភ្នំពេញ កម្ពុជា</span>
            <span className="badge-tag">ភោជនីយដ្ឋានម្ហូបខ្មែរពិតៗ</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
