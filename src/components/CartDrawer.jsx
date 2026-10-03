import { useState, useEffect } from "react";
import InvoiceModal from "./InvoiceModal";
import { notifyNewOrderPlaced } from "../services/notificationService";
import { formatKhmerDateTime } from "../utils/khmerDate";
import "./CartDrawer.css";

const VALID_PROMO_CODES = ["PCHUMBEN20", "KHMERFOOD", "BAITONG"];
const PROMO_DISCOUNT    = 0.20; // 20%
const ABA_QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=8&data=${encodeURIComponent("https://pay.ababank.com/oRF8/8ffqaxig")}`;
const ABA_PAY_LINK = "https://pay.ababank.com/oRF8/8ffqaxig";

const PRESET_ADDRESSES = [
  {
    id: "preset_home",
    label: "🏠 ផ្ទះ (ទួលគោក)",
    subtitle: "រាជធានីភ្នំពេញ",
    name: "ពុធធានីតា ព្រំ",
    phone: "015 241471",
    province: "Phnom Penh",
    address: "ផ្លូវលេខ ២៧១ សង្កាត់បឹងសាឡាង ខណ្ឌទួលគោក"
  },
  {
    id: "preset_office",
    label: "🏢 កន្លែងធ្វើការ (បឹងកេងកង)",
    subtitle: "រាជធានីភ្នំពេញ",
    name: "ពុធធានីតា ព្រំ",
    phone: "015 241471",
    province: "Phnom Penh",
    address: "អគារលេខ ៤៥ ផ្លូវ ៥៧ សង្កាត់បឹងកេងកង១"
  },
  {
    id: "preset_siemreap",
    label: "🏡 សៀមរាប (សាលាកំរើក)",
    subtitle: "ខេត្តសៀមរាប",
    name: "ពុធធានីតា ព្រំ",
    phone: "015 241471",
    province: "Siem Reap",
    address: "ផ្លូវវត្តបូព៌ សង្កាត់សាលាកំរើក ក្រុងសៀមរាប"
  }
];

const CAMBODIA_PROVINCES = [
  { en: "Phnom Penh", km: "រាជធានីភ្នំពេញ" },
  { en: "Kandal", km: "ខេត្តកណ្តាល" },
  { en: "Siem Reap", km: "ខេត្តសៀមរាប" },
  { en: "Battambang", km: "ខេត្តបាត់ដំបង" },
  { en: "Sihanoukville", km: "ខេត្តព្រះសីហនុ" },
  { en: "Kampot", km: "ខេត្តកំពត" },
  { en: "Kampong Cham", km: "ខេត្តកំពង់ចាម" },
  { en: "Kampong Chhnang", km: "ខេត្តកំពង់ឆ្នាំង" },
  { en: "Kampong Speu", km: "ខេត្តកំពង់ស្ពឺ" },
  { en: "Kampong Thom", km: "ខេត្តកំពង់ធំ" },
  { en: "Banteay Meanchey", km: "ខេត្តបន្ទាយមានជ័យ" },
  { en: "Kep", km: "ខេត្តកែប" },
  { en: "Koh Kong", km: "ខេត្តកោះកុង" },
  { en: "Kratie", km: "ខេត្តក្រចេះ" },
  { en: "Mondulkiri", km: "ខេត្តមណ្ឌលគិរី" },
  { en: "Oddar Meanchey", km: "ខេត្តឧត្តរមានជ័យ" },
  { en: "Pailin", km: "ខេត្តប៉ៃលិន" },
  { en: "Preah Vihear", km: "ខេត្តព្រះវិហារ" },
  { en: "Prey Veng", km: "ខេត្តព្រៃវែង" },
  { en: "Pursat", km: "ខេត្តពោធិ៍សាត់" },
  { en: "Ratanakiri", km: "ខេត្តរតនគិរី" },
  { en: "Stung Treng", km: "ខេត្តស្ទឹងត្រែង" },
  { en: "Svay Rieng", km: "ខេត្តស្វាយរៀង" },
  { en: "Takeo", km: "ខេត្តតាកែវ" },
  { en: "Tboung Khmum", km: "ខេត្តត្បូងឃ្មុំ" }
];

function CartDrawer({
  isOpen,
  onClose,
  cartItems = [],
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}) {
  const [isCheckingOut, setIsCheckingOut]   = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [showHistory, setShowHistory]       = useState(false);
  const [pastInvoices, setPastInvoices]     = useState([]);

  // Customer & Delivery Information State
  const [selectedPresetId, setSelectedPresetId] = useState("preset_home");

  const [customerName, setCustomerName] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("skincare_customer_info") || "{}");
      return saved.name || "ពុធធានីតា ព្រំ";
    } catch {
      return "ពុធធានីតា ព្រំ";
    }
  });

  const [customerPhone, setCustomerPhone] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("skincare_customer_info") || "{}");
      return saved.phone || "015 241471";
    } catch {
      return "015 241471";
    }
  });

  const [customerAddress, setCustomerAddress] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("skincare_customer_info") || "{}");
      return saved.address || "ផ្លូវលេខ ២៧១ សង្កាត់បឹងសាឡាង ខណ្ឌទួលគោក";
    } catch {
      return "ផ្លូវលេខ ២៧១ សង្កាត់បឹងសាឡាង ខណ្ឌទួលគោក";
    }
  });

  const [deliveryProvince, setDeliveryProvince] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("skincare_customer_info") || "{}");
      return saved.province || "Phnom Penh";
    } catch {
      return "Phnom Penh";
    }
  });

  const [deliveryNotes, setDeliveryNotes] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("skincare_customer_info") || "{}");
      return saved.notes || "";
    } catch {
      return "";
    }
  });

  const handleSelectPreset = (presetId) => {
    setSelectedPresetId(presetId);
    if (presetId === "custom") return;
    const found = PRESET_ADDRESSES.find((p) => p.id === presetId);
    if (found) {
      setCustomerName(found.name);
      setCustomerPhone(found.phone);
      setDeliveryProvince(found.province);
      setCustomerAddress(found.address);
    }
  };

  // Promo code state
  const [promoInput, setPromoInput]   = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError]   = useState("");

  // Payment tab
  const [paymentTab, setPaymentTab] = useState("aba"); // "aba" | "cash"

  // Load past transaction invoices
  useEffect(() => {
    try {
      const saved = localStorage.getItem("skincare_invoices");
      if (saved) setPastInvoices(JSON.parse(saved));
    } catch {
      setPastInvoices([]);
    }
  }, [isOpen]);

  if (!isOpen && !isInvoiceModalOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = promoApplied ? subtotal * PROMO_DISCOUNT : 0;
  const shipping  = subtotal > 30 || subtotal === 0 ? 0 : 2.0;
  const total     = subtotal - discount + shipping;

  const handleApplyPromo = () => {
    const inputUpper = promoInput.trim().toUpperCase();
    if (VALID_PROMO_CODES.includes(inputUpper)) {
      setPromoApplied(true);
      setPromoError("");
    } else {
      setPromoError("❌ កូដមិនត្រឹមត្រូវ។ សូមសាកល្បង KHMERFOOD ឬ BAITONG");
      setPromoApplied(false);
    }
  };

  const handleRemovePromo = () => {
    setPromoApplied(false);
    setPromoInput("");
    setPromoError("");
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    setIsCheckingOut(true);

    const customerInfo = {
      name: customerName.trim() || "អតិថិជន ផ្ទះបៃតង",
      phone: customerPhone.trim() || "015 241471",
      address: customerAddress.trim() || "រាជធានីភ្នំពេញ កម្ពុជា",
      province: deliveryProvince,
      notes: deliveryNotes.trim()
    };

    try {
      localStorage.setItem("skincare_customer_info", JSON.stringify(customerInfo));
    } catch (e) {
      console.error(e);
    }

    setTimeout(() => {
      const now = new Date();
      const invoice = {
        id: `INV-BT-${Math.floor(100000 + Math.random() * 900000)}`,
        date: formatKhmerDateTime(now),
        timestamp: Date.now(),
        customer: customerInfo,
        items: cartItems.map((item) => ({ ...item })),
        subtotal,
        discount,
        promoCode: promoApplied ? (promoInput.trim().toUpperCase() || "BAITONG") : null,
        shipping,
        total,
        paymentMethod: paymentTab === "aba" ? "ABA Bank KHQR" : "ទូទាត់ប្រាក់ពេលដឹកមកដល់",
        status: "បានបញ្ជាក់ & កំពុងចម្អិនក្នុងផ្ទះបាយ",
        storeName: "ផ្ទះបៃតង (Baitong House)",
        storeOwner: "CHUM BUNTHARY (ជុំ ប៊ុនថារី)",
        storeManager: "Putheanita Prom (putheanitaprom@gmail.com)",
        storePhone: "015 241471",
        storeCity: "រាជធានីភ្នំពេញ កម្ពុជា"
      };

      try {
        const existing = JSON.parse(localStorage.getItem("skincare_invoices") || "[]");
        const updated = [invoice, ...existing];
        localStorage.setItem("skincare_invoices", JSON.stringify(updated));
        setPastInvoices(updated);

        try {
          notifyNewOrderPlaced(invoice);
        } catch (notifErr) {
          console.warn("Order notification dispatch error:", notifErr);
        }
      } catch (err) {
        console.error("Failed to save invoice record:", err);
      }

      setIsCheckingOut(false);
      setCurrentInvoice(invoice);
      setIsInvoiceModalOpen(true);
      if (onClearCart) onClearCart();
    }, 800);
  };

  const handleCloseAndReset = () => {
    setShowHistory(false);
    setPromoApplied(false);
    setPromoInput("");
    setPromoError("");
    onClose();
  };

  const handleOpenPastInvoice = (inv) => {
    setCurrentInvoice(inv);
    setIsInvoiceModalOpen(true);
  };

  return (
    <>
      {/* ── Slide-over Cart Drawer ── */}
      {isOpen && (
        <div className="cart-drawer-overlay" onClick={handleCloseAndReset}>
          <div className="cart-drawer-panel" onClick={(e) => e.stopPropagation()}>

            {/* ── Drawer Header ── */}
            <div className="cart-drawer-header">
              <div className="cart-header-title">
                <h3 style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}>
                  {showHistory ? "ប្រវត្តិកុម្ម៉ង់ម្ហូប" : "កន្ត្រកម្ហូបរបស់អ្នក"}
                </h3>
                {!showHistory && (
                  <span className="cart-count-pill" style={{ fontFamily: "'Battambang', sans-serif" }}>
                    {cartItems.reduce((acc, i) => acc + i.quantity, 0)} ចាន
                  </span>
                )}
              </div>

              <div className="cart-header-actions">
                {pastInvoices.length > 0 && (
                  <button
                    className="cart-history-btn"
                    onClick={() => setShowHistory(!showHistory)}
                    title="មើលវិក្កយបត្រកុម្ម៉ង់ពីមុន"
                    style={{ fontFamily: "'Battambang', sans-serif" }}
                  >
                    {showHistory ? "← ទៅកន្ត្រកម្ហូប" : "📜 ប្រវត្តិកុម្ម៉ង់"}
                  </button>
                )}
                <button className="cart-close-btn" onClick={handleCloseAndReset} aria-label="បិទ">
                  &times;
                </button>
              </div>
            </div>

            {/* ── Drawer Body ── */}
            <div className="cart-drawer-body">

              {/* ════ VIEW: PAST INVOICE HISTORY ════ */}
              {showHistory ? (
                <div className="invoice-history-list">
                  <div className="history-header">
                    <h4 style={{ fontFamily: "'Battambang', sans-serif" }}>
                      📜 ប្រវត្តិកុម្ម៉ង់ម្ហូបកន្លងមក ({pastInvoices.length})
                    </h4>
                    <p style={{ fontFamily: "'Battambang', sans-serif" }}>
                      ចុចលើការកុម្ម៉ង់ណាមួយដើម្បីមើល &amp; ទាញយកវិក្កយបត្រផ្លូវការ។
                    </p>
                  </div>

                  {pastInvoices.length === 0 ? (
                    <p className="history-empty" style={{ fontFamily: "'Battambang', sans-serif" }}>
                      មិនទាន់មានប្រវត្តិកុម្ម៉ង់នៅឡើយទេ។
                    </p>
                  ) : (
                    <div className="history-cards">
                      {pastInvoices.map((inv) => (
                        <div
                          key={inv.id}
                          className="history-card"
                          onClick={() => handleOpenPastInvoice(inv)}
                          title="ចុចដើម្បីបើកមើលវិក្កយបត្រ"
                        >
                          <div className="history-card-top">
                            <span className="history-inv-id">{inv.id}</span>
                            <span className="history-inv-date">{inv.date}</span>
                          </div>
                          <div className="history-card-mid" style={{ fontFamily: "'Battambang', sans-serif" }}>
                            <span>👤 {inv.customer?.name || "អតិថិជន"} ({inv.items.length} មុខ)</span>
                            <span className="history-inv-pay">{inv.paymentMethod}</span>
                          </div>
                          <div className="history-card-bot">
                            <span className="history-inv-total" style={{ fontFamily: "'Battambang', sans-serif" }}>
                              សរុប: ${inv.total.toFixed(2)}
                            </span>
                            <span className="history-view-link" style={{ fontFamily: "'Battambang', sans-serif" }}>
                              បើកវិក្កយបត្រ →
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              /* ════ VIEW: EMPTY BAG ════ */
              ) : cartItems.length === 0 ? (
                <div className="cart-empty-view">
                  <div className="empty-cart-icon">🍲</div>
                  <h4 style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}>
                    កន្ត្រកម្ហូបរបស់អ្នកនៅទទេ
                  </h4>
                  <p style={{ fontFamily: "'Battambang', sans-serif" }}>
                    សូមស្វែងរកមុខម្ហូបខ្មែរឈ្ងុយឆ្ងាញ់របស់យើង អាម៉ុកត្រី ឡុកឡាក់ នំបញ្ចុក សម្លកកូរ ដើម្បីចាប់ផ្តើមកុម្ម៉ង់។
                  </p>
                  <button
                    className="cart-shop-now-btn"
                    onClick={onClose}
                    style={{ fontFamily: "'Battambang', sans-serif" }}
                  >
                    មើលបញ្ជីមុខម្ហូប
                  </button>
                </div>

              /* ════ VIEW: ACTIVE SHOPPING BAG & CHECKOUT ════ */
              ) : (
                <>
                  {/* Product list */}
                  <div className="cart-items-list">
                    {cartItems.map((item) => {
                      const itemKey = item.cartItemId || item.productCode;
                      return (
                        <div key={itemKey} className="cart-item-row">
                          <img src={item.image} alt={item.productName} className="cart-item-img" />
                          <div className="cart-item-details">
                            <h4 className="cart-item-name" style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}>
                              {item.productName}
                            </h4>
                            {item.selectedToppings && item.selectedToppings.length > 0 && (
                              <div style={{ fontSize: "0.78rem", color: "#2d6a4f", fontFamily: "'Dangrek', 'Battambang', cursive", marginTop: "2px" }}>
                                + Topping: {item.selectedToppings.map((t) => t.name.split(" ")[0]).join(", ")}
                              </div>
                            )}
                            {item.spiciness && (
                              <div style={{ fontSize: "0.76rem", color: "#c2410c", fontFamily: "'Dangrek', 'Battambang', cursive" }}>
                                🌶️ {item.spiciness}
                              </div>
                            )}
                            <span className="cart-item-meta" style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}>
                              {item.volume} • ${item.price.toFixed(2)} ក្នុងមួយចាន
                            </span>
                            <div className="cart-qty-controls">
                              <button className="qty-btn" onClick={() => onUpdateQuantity(itemKey, item.quantity - 1)} aria-label="បន្ថយ">–</button>
                              <span className="qty-number">{item.quantity}</span>
                              <button className="qty-btn" onClick={() => onUpdateQuantity(itemKey, item.quantity + 1)} aria-label="បន្ថែម">+</button>
                              <button
                                className="remove-item-btn"
                                onClick={() => onRemoveItem(itemKey)}
                                style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}
                              >
                                លុបចេញ
                              </button>
                            </div>
                          </div>
                          <div className="cart-item-total">${(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                      );
                    })}
                  </div>

                  {/* ── Customer & Delivery Information ── */}
                  <div className="customer-info-section">
                    <div className="section-title-row">
                      <div className="section-title-left">
                        <span className="section-title-icon">📍</span>
                        <div>
                          <p className="customer-section-title" style={{ fontFamily: "'Battambang', sans-serif", fontWeight: 700 }}>
                            ព័ត៌មានអតិថិជន និងអាសយដ្ឋានដឹកជញ្ជូន
                          </p>
                          <span className="customer-section-subtitle" style={{ fontFamily: "'Battambang', sans-serif" }}>
                            អាសយដ្ឋាននឹងត្រូវបោះពុម្ពលើវិក្កយបត្រម្ហូប
                          </span>
                        </div>
                      </div>
                      <span className="customer-badge-tag" style={{ fontFamily: "'Battambang', sans-serif" }}>
                        បោះពុម្ពលើវិក្កយបត្រ
                      </span>
                    </div>

                    {/* Quick Preset Address Selector */}
                    <div className="preset-selector-box">
                      <div className="preset-selector-header">
                        <span className="preset-selector-label" style={{ fontFamily: "'Battambang', sans-serif" }}>
                          ⚡ ជ្រើសរើសអាសយដ្ឋានដឹកជញ្ជូន:
                        </span>
                        <select
                          className="preset-select-dropdown"
                          value={selectedPresetId}
                          onChange={(e) => handleSelectPreset(e.target.value)}
                          style={{ fontFamily: "'Battambang', sans-serif" }}
                        >
                          {PRESET_ADDRESSES.map((preset) => (
                            <option key={preset.id} value={preset.id}>
                              {preset.label} — {preset.subtitle}
                            </option>
                          ))}
                          <option value="custom">✏️ បញ្ចូលអាសយដ្ឋានថ្មីផ្ទាល់ខ្លួន</option>
                        </select>
                      </div>

                      {/* Quick Chips */}
                      <div className="preset-chips">
                        {PRESET_ADDRESSES.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            className={`preset-chip ${selectedPresetId === p.id ? "active" : ""}`}
                            onClick={() => handleSelectPreset(p.id)}
                            style={{ fontFamily: "'Battambang', sans-serif" }}
                          >
                            {p.label}
                          </button>
                        ))}
                        <button
                          type="button"
                          className={`preset-chip ${selectedPresetId === "custom" ? "active" : ""}`}
                          onClick={() => setSelectedPresetId("custom")}
                          style={{ fontFamily: "'Battambang', sans-serif" }}
                        >
                          ✏️ អាសយដ្ឋានថ្មី
                        </button>
                      </div>
                    </div>

                    <div className="customer-form-grid">
                      <div className="cust-form-group">
                        <label className="cust-label" style={{ fontFamily: "'Battambang', sans-serif" }}>
                          ឈ្មោះអតិថិជន <span className="req-star">*</span>
                        </label>
                        <input
                          type="text"
                          className="cust-input"
                          placeholder="ឧ. ពុធធានីតា ព្រំ"
                          value={customerName}
                          onChange={(e) => {
                            setCustomerName(e.target.value);
                            setSelectedPresetId("custom");
                          }}
                          style={{ fontFamily: "'Battambang', sans-serif" }}
                        />
                      </div>

                      <div className="cust-form-group">
                        <label className="cust-label" style={{ fontFamily: "'Battambang', sans-serif" }}>
                          លេខទូរស័ព្ទទទួលម្ហូប <span className="req-star">*</span>
                        </label>
                        <input
                          type="tel"
                          className="cust-input"
                          placeholder="ឧ. 015 241471"
                          value={customerPhone}
                          onChange={(e) => {
                            setCustomerPhone(e.target.value);
                            setSelectedPresetId("custom");
                          }}
                          style={{ fontFamily: "'Battambang', sans-serif" }}
                        />
                      </div>
                    </div>

                    <div className="cust-form-group">
                      <label className="cust-label" style={{ fontFamily: "'Battambang', sans-serif" }}>
                        រាជធានី / ខេត្ត <span className="req-star">*</span>
                      </label>
                      <select
                        className="cust-select"
                        value={deliveryProvince}
                        onChange={(e) => {
                          setDeliveryProvince(e.target.value);
                          setSelectedPresetId("custom");
                        }}
                        style={{ fontFamily: "'Battambang', sans-serif" }}
                      >
                        {CAMBODIA_PROVINCES.map((prov) => (
                          <option key={prov.en} value={prov.en}>
                            {prov.km} {prov.en === "Phnom Penh" ? "(ដឹកជញ្ជូនរហ័សក្នុងថ្ងៃ)" : ""}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="cust-form-group">
                      <label className="cust-label" style={{ fontFamily: "'Battambang', sans-serif" }}>
                        អាសយដ្ឋានលម្អិត (ផ្ទះលេខ, ផ្លូវ, សង្កាត់, ខណ្ឌ) <span className="req-star">*</span>
                      </label>
                      <input
                        type="text"
                        className="cust-input"
                        placeholder="ផ្ទះលេខ, ផ្លូវលេខ, សង្កាត់, ខណ្ឌ, ចំណុចសម្គាល់..."
                        value={customerAddress}
                        onChange={(e) => {
                          setCustomerAddress(e.target.value);
                          setSelectedPresetId("custom");
                        }}
                        style={{ fontFamily: "'Battambang', sans-serif" }}
                      />
                    </div>

                    <div className="cust-form-group">
                      <label className="cust-label" style={{ fontFamily: "'Battambang', sans-serif" }}>
                        ចំណាំបន្ថែមសម្រាប់អ្នកដឹកជញ្ជូន (ស្រេចចិត្ត)
                      </label>
                      <input
                        type="text"
                        className="cust-input"
                        placeholder="ឧ. សូមទូរស័ព្ទមុនមកដល់, ផ្ញើនៅតុសន្តិសុខ..."
                        value={deliveryNotes}
                        onChange={(e) => setDeliveryNotes(e.target.value)}
                        style={{ fontFamily: "'Battambang', sans-serif" }}
                      />
                    </div>
                  </div>

                  {/* ── Promo Code Section ── */}
                  <div className="promo-section">
                    <p className="promo-section-title" style={{ fontFamily: "'Battambang', sans-serif" }}>
                      🏷️ កូដបញ្ចុះតម្លៃពិធីបុណ្យ
                    </p>
                    {promoApplied ? (
                      <div className="promo-applied-row">
                        <span className="promo-applied-badge" style={{ fontFamily: "'Battambang', sans-serif" }}>
                          ✓ {promoInput.trim().toUpperCase() || "BAITONG"} — បញ្ចុះតម្លៃ 20% ដោយជោគជ័យ!
                        </span>
                        <button className="promo-remove-btn" onClick={handleRemovePromo} style={{ fontFamily: "'Battambang', sans-serif" }}>
                          លុបកូដ
                        </button>
                      </div>
                    ) : (
                      <div className="promo-input-row">
                        <input
                          type="text"
                          className="promo-input"
                          placeholder="បញ្ចូលកូដ e.g. BAITONG ឬ KHMERFOOD"
                          value={promoInput}
                          onChange={(e) => { setPromoInput(e.target.value); setPromoError(""); }}
                          onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                          style={{ fontFamily: "'Battambang', sans-serif" }}
                        />
                        <button className="promo-apply-btn" onClick={handleApplyPromo} style={{ fontFamily: "'Battambang', sans-serif" }}>
                          ប្រើកូដ
                        </button>
                      </div>
                    )}
                    {promoError && <p className="promo-error-msg" style={{ fontFamily: "'Battambang', sans-serif" }}>{promoError}</p>}
                  </div>

                  {/* ── Payment Section ── */}
                  <div className="payment-section">
                    <p className="payment-section-title" style={{ fontFamily: "'Battambang', sans-serif" }}>
                      💳 វិធីសាស្ត្រទូទាត់ប្រាក់
                    </p>
                    <div className="payment-tabs">
                      <button
                        className={`payment-tab ${paymentTab === "aba" ? "active" : ""}`}
                        onClick={() => setPaymentTab("aba")}
                        style={{ fontFamily: "'Battambang', sans-serif" }}
                      >
                        🏦 ស្កេន ABA Bank KHQR
                      </button>
                      <button
                        className={`payment-tab ${paymentTab === "cash" ? "active" : ""}`}
                        onClick={() => setPaymentTab("cash")}
                        style={{ fontFamily: "'Battambang', sans-serif" }}
                      >
                        💵 ទូទាត់ប្រាក់ពេលដឹកមកដល់
                      </button>
                    </div>

                    {paymentTab === "aba" && (
                      <div className="aba-qr-section">
                        <div className="aba-qr-header">
                          <span className="aba-logo">ABA</span>
                          <div>
                            <p className="aba-title" style={{ fontFamily: "'Battambang', sans-serif" }}>
                              ស្កេនទូទាត់ជាមួយ ABA Mobile KHQR
                            </p>
                            <p className="aba-subtitle" style={{ fontFamily: "'Battambang', sans-serif" }}>
                              ទឹកប្រាក់ត្រូវទូទាត់: ${total.toFixed(2)} · បើកកម្មវិធី ABA → Scan QR
                            </p>
                          </div>
                        </div>
                        <div className="aba-qr-wrap">
                          <img
                            src={ABA_QR_URL}
                            alt="ABA Bank Payment QR Code"
                            className="aba-qr-img"
                          />
                          <div className="aba-qr-info" style={{ fontFamily: "'Battambang', sans-serif" }}>
                            <p>📱 បើកកម្មវិធី <strong>ABA Mobile</strong></p>
                            <p>→ ចុចលើ <strong>Pay</strong></p>
                            <p>→ ចុចលើ <strong>Scan QR</strong></p>
                            <p>→ ស្កេនរូប QR នេះ</p>
                            <p>→ បញ្ជាក់ការទូទាត់ប្រាក់</p>
                            <a href={ABA_PAY_LINK} target="_blank" rel="noopener noreferrer" className="aba-direct-link">
                              ឬចុចទូទាត់ផ្ទាល់ →
                            </a>
                          </div>
                        </div>
                        <p className="aba-note" style={{ fontFamily: "'Battambang', sans-serif" }}>
                          ✅ រហ័ស សុវត្ថិភាព មិនបាច់ប្រើកាត · ទទួលការបញ្ជាក់ភ្លាមៗ
                        </p>
                      </div>
                    )}

                    {paymentTab === "cash" && (
                      <div className="cod-section">
                        <div className="cod-icon">🚗</div>
                        <p className="cod-title" style={{ fontFamily: "'Battambang', sans-serif" }}>
                          ទូទាត់ប្រាក់សុទ្ធពេលដឹកជញ្ជូនមកដល់
                        </p>
                        <p className="cod-desc" style={{ fontFamily: "'Battambang', sans-serif" }}>
                          ទូទាត់ជាប្រាក់សុទ្ធពេលបុគ្គលិកដឹកជញ្ជូនយកម្ហូបដល់ដៃ។ អ្នកដឹកជញ្ជូននឹងទូរស័ព្ទទៅលេខ <strong>{customerPhone}</strong> នៅអាសយដ្ឋាន <strong>{customerAddress}</strong>។
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* ── Drawer Footer ── */}
            {!showHistory && cartItems.length > 0 && (
              <div className="cart-drawer-footer">
                <div className="cart-summary-line" style={{ fontFamily: "'Battambang', sans-serif" }}>
                  <span>តម្លៃសរុបរង</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {promoApplied && (
                  <div className="cart-summary-line discount-line" style={{ fontFamily: "'Battambang', sans-serif" }}>
                    <span>🏷️ បញ្ចុះតម្លៃពិសេស 20%</span>
                    <span className="discount-amount">−${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="cart-summary-line" style={{ fontFamily: "'Battambang', sans-serif" }}>
                  <span>សេវាដឹកជញ្ជូន {subtotal > 30 && <em className="free-tag">(ឥតគិតថ្លៃលើសពី $30)</em>}</span>
                  <span>{shipping === 0 ? "ឥតគិតថ្លៃ" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="cart-summary-total" style={{ fontFamily: "'Battambang', sans-serif" }}>
                  <span>ទឹកប្រាក់សរុប</span>
                  <span className="total-number">${total.toFixed(2)}</span>
                </div>

                <button
                  className="cart-checkout-btn"
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  style={{ fontFamily: "'Battambang', sans-serif", fontSize: "1.05rem" }}
                >
                  {isCheckingOut ? "កំពុងដំណើរការ & បង្កើតវិក្កយបត្រ..." : `កុម្ម៉ង់ម្ហូប & មើលវិក្កយបត្រ • $${total.toFixed(2)}`}
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ════ CENTERED PAGE MODAL POPUP: OFFICIAL INVOICE ════ */}
      <InvoiceModal
        invoice={currentInvoice}
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
      />
    </>
  );
}

export default CartDrawer;
