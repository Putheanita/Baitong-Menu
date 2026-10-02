import { useState, useEffect } from "react";
import InvoiceModal from "./InvoiceModal";
import { notifyNewOrderPlaced } from "../services/notificationService";
import "./CartDrawer.css";

const VALID_PROMO_CODE  = "PCHUMBEN20";
const PROMO_DISCOUNT    = 0.20; // 20%
const ABA_QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=8&data=${encodeURIComponent("https://pay.ababank.com/oRF8/8ffqaxig")}`;
const ABA_PAY_LINK = "https://pay.ababank.com/oRF8/8ffqaxig";

const PRESET_ADDRESSES = [
  {
    id: "preset_home",
    label: "🏠 Home (ផ្ទះ)",
    subtitle: "Toul Kork, Phnom Penh",
    name: "Puthea Nita",
    phone: "015 241471",
    province: "Phnom Penh",
    address: "Street 271, Sangkat Boeung Salang, Khan Toul Kork"
  },
  {
    id: "preset_office",
    label: "🏢 Office (កន្លែងធ្វើការ)",
    subtitle: "BKK1, Phnom Penh",
    name: "Puthea Nita",
    phone: "015 241471",
    province: "Phnom Penh",
    address: "Building #45, St. 57, Sangkat Boeung Keng Kang 1"
  },
  {
    id: "preset_siemreap",
    label: "🏡 Siem Reap (សៀមរាប)",
    subtitle: "Sala Kamreuk",
    name: "Puthea Nita",
    phone: "015 241471",
    province: "Siem Reap",
    address: "Wat Bo Road, Sangkat Sala Kamreuk, Krong Siem Reap"
  }
];

const CAMBODIA_PROVINCES = [
  "Phnom Penh",
  "Kandal",
  "Siem Reap",
  "Battambang",
  "Sihanoukville",
  "Kampot",
  "Kampong Cham",
  "Kampong Chhnang",
  "Kampong Speu",
  "Kampong Thom",
  "Banteay Meanchey",
  "Kep",
  "Koh Kong",
  "Kratie",
  "Mondulkiri",
  "Oddar Meanchey",
  "Pailin",
  "Preah Vihear",
  "Prey Veng",
  "Pursat",
  "Ratanakiri",
  "Stung Treng",
  "Svay Rieng",
  "Takeo",
  "Tboung Khmum"
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

  // Customer & Delivery Information State (persisted to localStorage)
  const [selectedPresetId, setSelectedPresetId] = useState("preset_home");

  const [customerName, setCustomerName] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("skincare_customer_info") || "{}");
      return saved.name || "Puthea Nita";
    } catch {
      return "Puthea Nita";
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
      return saved.address || "Street 271, Sangkat Boeung Salang, Khan Toul Kork";
    } catch {
      return "Street 271, Sangkat Boeung Salang, Khan Toul Kork";
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

  // Load past transaction invoices from localStorage
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
  const shipping  = subtotal > 50 || subtotal === 0 ? 0 : 2.5;
  const total     = subtotal - discount + shipping;

  const handleApplyPromo = () => {
    if (promoInput.trim().toUpperCase() === VALID_PROMO_CODE) {
      setPromoApplied(true);
      setPromoError("");
    } else {
      setPromoError("❌ Invalid code. Try PCHUMBEN20");
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
      name: customerName.trim() || "Puthea Nita",
      phone: customerPhone.trim() || "015 241471",
      address: customerAddress.trim() || "Phnom Penh, Cambodia",
      province: deliveryProvince,
      notes: deliveryNotes.trim()
    };

    // Save customer info for future purchases
    try {
      localStorage.setItem("skincare_customer_info", JSON.stringify(customerInfo));
    } catch (e) {
      console.error(e);
    }

    setTimeout(() => {
      // Create new official invoice record with full customer info
      const invoice = {
        id: `INV-2026-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        }),
        timestamp: Date.now(),
        customer: customerInfo,
        items: cartItems.map((item) => ({ ...item })),
        subtotal,
        discount,
        promoCode: promoApplied ? VALID_PROMO_CODE : null,
        shipping,
        total,
        paymentMethod: paymentTab === "aba" ? "ABA Bank QR" : "Cash on Delivery",
        status: "Confirmed & Recorded",
        storeName: "SkinCare Co.",
        storePhone: "015 241471",
        storeCity: "Phnom Penh, Cambodia"
      };

      // Record transaction to localStorage history
      try {
        const existing = JSON.parse(localStorage.getItem("skincare_invoices") || "[]");
        const updated = [invoice, ...existing];
        localStorage.setItem("skincare_invoices", JSON.stringify(updated));
        setPastInvoices(updated);

        // Real-time alert to store owner (Telegram, Desktop, Admin Log)
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
    }, 850);
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
      {/* ── Slide-over Cart Drawer (Expanded Width) ── */}
      {isOpen && (
        <div className="cart-drawer-overlay" onClick={handleCloseAndReset}>
          <div className="cart-drawer-panel" onClick={(e) => e.stopPropagation()}>

            {/* ── Drawer Header ── */}
            <div className="cart-drawer-header">
              <div className="cart-header-title">
                <h3>{showHistory ? "Transaction History" : "Your Shopping Bag"}</h3>
                {!showHistory && (
                  <span className="cart-count-pill">
                    {cartItems.reduce((acc, i) => acc + i.quantity, 0)} items
                  </span>
                )}
              </div>

              <div className="cart-header-actions">
                {pastInvoices.length > 0 && (
                  <button
                    className="cart-history-btn"
                    onClick={() => setShowHistory(!showHistory)}
                    title="View previous buying transaction invoices"
                  >
                    {showHistory ? "← Back to Bag" : "📜 History"}
                  </button>
                )}
                <button className="cart-close-btn" onClick={handleCloseAndReset} aria-label="Close">
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
                    <h4>📜 Previous Transactions ({pastInvoices.length})</h4>
                    <p>Click any transaction to open &amp; save its official invoice.</p>
                  </div>

                  {pastInvoices.length === 0 ? (
                    <p className="history-empty">No past transactions recorded yet.</p>
                  ) : (
                    <div className="history-cards">
                      {pastInvoices.map((inv) => (
                        <div
                          key={inv.id}
                          className="history-card"
                          onClick={() => handleOpenPastInvoice(inv)}
                          title="Click to view & save official invoice"
                        >
                          <div className="history-card-top">
                            <span className="history-inv-id">{inv.id}</span>
                            <span className="history-inv-date">{inv.date}</span>
                          </div>
                          <div className="history-card-mid">
                            <span>👤 {inv.customer?.name || "Customer"} ({inv.items.length} items)</span>
                            <span className="history-inv-pay">{inv.paymentMethod}</span>
                          </div>
                          <div className="history-card-bot">
                            <span className="history-inv-total">Total: ${inv.total.toFixed(2)}</span>
                            <span className="history-view-link">Open Invoice Modal →</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              /* ════ VIEW: EMPTY BAG ════ */
              ) : cartItems.length === 0 ? (
                <div className="cart-empty-view">
                  <div className="empty-cart-icon">🛍️</div>
                  <h4>Your bag is currently empty</h4>
                  <p>Explore our clean Centella &amp; Face Republic collection to find your skincare routine.</p>
                  <button className="cart-shop-now-btn" onClick={onClose}>Explore Products</button>
                </div>

              /* ════ VIEW: ACTIVE SHOPPING BAG & CHECKOUT ════ */
              ) : (
                <>
                  {/* Product list */}
                  <div className="cart-items-list">
                    {cartItems.map((item) => (
                      <div key={item.productCode} className="cart-item-row">
                        <img src={item.image} alt={item.productName} className="cart-item-img" />
                        <div className="cart-item-details">
                          <h4 className="cart-item-name">{item.productName}</h4>
                          <span className="cart-item-meta">{item.volume} • ${item.price.toFixed(2)} each</span>
                          <div className="cart-qty-controls">
                            <button className="qty-btn" onClick={() => onUpdateQuantity(item.productCode, item.quantity - 1)} aria-label="Decrease">–</button>
                            <span className="qty-number">{item.quantity}</span>
                            <button className="qty-btn" onClick={() => onUpdateQuantity(item.productCode, item.quantity + 1)} aria-label="Increase">+</button>
                            <button className="remove-item-btn" onClick={() => onRemoveItem(item.productCode)}>Remove</button>
                          </div>
                        </div>
                        <div className="cart-item-total">${(item.price * item.quantity).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>

                  {/* ── Customer & Delivery Information ── */}
                  <div className="customer-info-section">
                    <div className="section-title-row">
                      <div className="section-title-left">
                        <span className="section-title-icon">📍</span>
                        <div>
                          <p className="customer-section-title">Customer &amp; Delivery Details</p>
                          <span className="customer-section-subtitle">ព័ត៌មានអតិថិជន និងអាសយដ្ឋានដឹកជញ្ជូន</span>
                        </div>
                      </div>
                      <span className="customer-badge-tag">Printed on Invoice</span>
                    </div>

                    {/* Quick Preset Address Selector */}
                    <div className="preset-selector-box">
                      <div className="preset-selector-header">
                        <span className="preset-selector-label">⚡ Choose / Select Saved Address:</span>
                        <select
                          className="preset-select-dropdown"
                          value={selectedPresetId}
                          onChange={(e) => handleSelectPreset(e.target.value)}
                        >
                          {PRESET_ADDRESSES.map((preset) => (
                            <option key={preset.id} value={preset.id}>
                              {preset.label} — {preset.subtitle}
                            </option>
                          ))}
                          <option value="custom">✏️ Enter Custom Address (អាសយដ្ឋានថ្មី)</option>
                        </select>
                      </div>

                      {/* Quick Chips for fast 1-tap choosing */}
                      <div className="preset-chips">
                        {PRESET_ADDRESSES.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            className={`preset-chip ${selectedPresetId === p.id ? "active" : ""}`}
                            onClick={() => handleSelectPreset(p.id)}
                          >
                            {p.label}
                          </button>
                        ))}
                        <button
                          type="button"
                          className={`preset-chip ${selectedPresetId === "custom" ? "active" : ""}`}
                          onClick={() => setSelectedPresetId("custom")}
                        >
                          ✏️ Custom
                        </button>
                      </div>
                    </div>

                    <div className="customer-form-grid">
                      <div className="cust-form-group">
                        <label className="cust-label">
                          Customer Name (ឈ្មោះ) <span className="req-star">*</span>
                        </label>
                        <input
                          type="text"
                          className="cust-input"
                          placeholder="e.g. Puthea Nita"
                          value={customerName}
                          onChange={(e) => {
                            setCustomerName(e.target.value);
                            setSelectedPresetId("custom");
                          }}
                        />
                      </div>

                      <div className="cust-form-group">
                        <label className="cust-label">
                          Phone Number (លេខទូរស័ព្ទ) <span className="req-star">*</span>
                        </label>
                        <input
                          type="tel"
                          className="cust-input"
                          placeholder="e.g. 015 241471"
                          value={customerPhone}
                          onChange={(e) => {
                            setCustomerPhone(e.target.value);
                            setSelectedPresetId("custom");
                          }}
                        />
                      </div>
                    </div>

                    <div className="cust-form-group">
                      <label className="cust-label">
                        Delivery City / Province (រាជធានី / ខេត្ត) <span className="req-star">*</span>
                      </label>
                      <select
                        className="cust-select"
                        value={deliveryProvince}
                        onChange={(e) => {
                          setDeliveryProvince(e.target.value);
                          setSelectedPresetId("custom");
                        }}
                      >
                        {CAMBODIA_PROVINCES.map((prov) => (
                          <option key={prov} value={prov}>
                            {prov} {prov === "Phnom Penh" ? "(រាជធានីភ្នំពេញ) - Standard Delivery" : `(ខេត្ត${prov})`}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="cust-form-group">
                      <label className="cust-label">
                        Delivery Street Address (អាសយដ្ឋានលម្អិត) <span className="req-star">*</span>
                      </label>
                      <input
                        type="text"
                        className="cust-input"
                        placeholder="House #, Street, Sangkat, Khan, Landmark..."
                        value={customerAddress}
                        onChange={(e) => {
                          setCustomerAddress(e.target.value);
                          setSelectedPresetId("custom");
                        }}
                      />
                    </div>

                    <div className="cust-form-group">
                      <label className="cust-label">
                        Delivery Notes (សម្គាល់បន្ថែម / Optional)
                      </label>
                      <input
                        type="text"
                        className="cust-input"
                        placeholder="e.g. Call before arrival, leave at security desk..."
                        value={deliveryNotes}
                        onChange={(e) => setDeliveryNotes(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* ── Promo Code Section ── */}
                  <div className="promo-section">
                    <p className="promo-section-title">🏷️ Pchum Ben Promo Code</p>
                    {promoApplied ? (
                      <div className="promo-applied-row">
                        <span className="promo-applied-badge">✓ {VALID_PROMO_CODE} — 20% OFF applied!</span>
                        <button className="promo-remove-btn" onClick={handleRemovePromo}>Remove</button>
                      </div>
                    ) : (
                      <div className="promo-input-row">
                        <input
                          type="text"
                          className="promo-input"
                          placeholder="Enter code e.g. PCHUMBEN20"
                          value={promoInput}
                          onChange={(e) => { setPromoInput(e.target.value); setPromoError(""); }}
                          onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                        />
                        <button className="promo-apply-btn" onClick={handleApplyPromo}>Apply</button>
                      </div>
                    )}
                    {promoError && <p className="promo-error-msg">{promoError}</p>}
                  </div>

                  {/* ── Payment Section ── */}
                  <div className="payment-section">
                    <p className="payment-section-title">💳 Payment Method</p>
                    <div className="payment-tabs">
                      <button
                        className={`payment-tab ${paymentTab === "aba" ? "active" : ""}`}
                        onClick={() => setPaymentTab("aba")}
                      >
                        🏦 ABA Bank QR
                      </button>
                      <button
                        className={`payment-tab ${paymentTab === "cash" ? "active" : ""}`}
                        onClick={() => setPaymentTab("cash")}
                      >
                        💵 Cash on Delivery
                      </button>
                    </div>

                    {paymentTab === "aba" && (
                      <div className="aba-qr-section">
                        <div className="aba-qr-header">
                          <span className="aba-logo">ABA</span>
                          <div>
                            <p className="aba-title">Scan to Pay with ABA Bank</p>
                            <p className="aba-subtitle">តម្លៃ: ${total.toFixed(2)} · Open ABA Mobile App → Scan QR</p>
                          </div>
                        </div>
                        <div className="aba-qr-wrap">
                          <img
                            src={ABA_QR_URL}
                            alt="ABA Bank Payment QR Code"
                            className="aba-qr-img"
                          />
                          <div className="aba-qr-info">
                            <p>📱 Open <strong>ABA Mobile</strong></p>
                            <p>→ Tap <strong>Pay</strong></p>
                            <p>→ Tap <strong>Scan QR</strong></p>
                            <p>→ Scan the code</p>
                            <p>→ Confirm payment</p>
                            <a href={ABA_PAY_LINK} target="_blank" rel="noopener noreferrer" className="aba-direct-link">
                              Or tap to pay directly →
                            </a>
                          </div>
                        </div>
                        <p className="aba-note">✅ Fast &amp; secure · No card needed · Instant confirmation</p>
                      </div>
                    )}

                    {paymentTab === "cash" && (
                      <div className="cod-section">
                        <div className="cod-icon">🚗</div>
                        <p className="cod-title">Cash on Delivery</p>
                        <p className="cod-desc">
                          Pay in cash when courier arrives. Courier will contact <strong>{customerPhone}</strong> at <strong>{customerAddress}</strong>.
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
                <div className="cart-summary-line">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {promoApplied && (
                  <div className="cart-summary-line discount-line">
                    <span>🏷️ Pchum Ben 20% OFF</span>
                    <span className="discount-amount">−${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="cart-summary-line">
                  <span>Shipping {subtotal > 50 && <em className="free-tag">(Free over $50)</em>}</span>
                  <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="cart-summary-total">
                  <span>Total</span>
                  <span className="total-number">${total.toFixed(2)}</span>
                </div>

                <button
                  className="cart-checkout-btn"
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? "Processing & Generating Invoice..." : `Place Order & View Invoice • $${total.toFixed(2)}`}
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
