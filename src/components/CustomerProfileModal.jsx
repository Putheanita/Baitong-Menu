import { useState, useRef, useEffect } from "react";
import { formatKhmerDateOnly } from "../utils/khmerDate";
import "./CustomerProfileModal.css";

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

export default function CustomerProfileModal({
  isOpen,
  onClose,
  currentUser,
  onUpdateCurrentUser,
  onLogout
}) {
  const fileInputRef = useRef(null);
  const dataImportInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState("profile");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [province, setProvince] = useState("Phnom Penh");
  const [avatar, setAvatar] = useState("");
  const [customerInvoices, setCustomerInvoices] = useState([]);

  const [toast, setToast] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setEmail(currentUser.email || "");
      setPhone(currentUser.phone || "015 241471");
      setAvatar(currentUser.avatar || "");

      try {
        const savedInfo = JSON.parse(
          localStorage.getItem("skincare_customer_info") || "{}"
        );
        setAddress(savedInfo.address || currentUser.address || "ផ្លូវ ២៧១ សង្កាត់បឹងសាឡាង ខណ្ឌទួលគោក");
        setProvince(savedInfo.province || currentUser.province || "Phnom Penh");
      } catch {
        setAddress(currentUser.address || "ផ្លូវ ២៧១ សង្កាត់បឹងសាឡាង ខណ្ឌទួលគោក");
        setProvince(currentUser.province || "Phnom Penh");
      }

      try {
        const invoices = JSON.parse(localStorage.getItem("skincare_invoices") || "[]");
        setCustomerInvoices(invoices);
      } catch {
        setCustomerInvoices([]);
      }
    }
  }, [currentUser, isOpen]);

  if (!isOpen || !currentUser) return null;

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  const handleAvatarFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("error", "សូមជ្រើសរើសឯកសាររូបភាពត្រឹមត្រូវ (JPG, PNG, WebP)។");
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      showToast("error", "ទំហំរូបភាពត្រូវតែតូចជាង 3MB។");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = event.target?.result;
      if (base64Data) {
        setAvatar(base64Data);
        showToast("success", "បានបង្ហោះរូបថត! សូមចុច 'រក្សាទុក' ដើម្បីអនុវត្ត។");
      }
    };
    reader.onerror = () => {
      showToast("error", "មិនអាចអានឯកសាររូបភាពបានទេ។");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatar("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    showToast("success", "បានលុបរូបថតចេញ។");
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const updatedUser = {
        ...currentUser,
        name: name.trim(),
        phone: phone.trim(),
        avatar: avatar || "",
        address: address.trim(),
        province
      };

      if (onUpdateCurrentUser) {
        onUpdateCurrentUser(updatedUser);
      }

      showToast("success", "ព័ត៌មានអតិថិជនត្រូវបានរក្សាទុកដោយជោគជ័យ! ✨");
    } catch (err) {
      console.error("Failed to save profile:", err);
      showToast("error", "មិនអាចរក្សាទុកទិន្នន័យបានទេ។ សូមសាកល្បងម្តងទៀត។");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDataImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result);
        if (data.name) setName(data.name);
        if (data.phone) setPhone(data.phone);
        if (data.address) setAddress(data.address);
        if (data.province) setProvince(data.province);
        if (data.avatar) setAvatar(data.avatar);

        showToast("success", "បាននាំចូលទិន្នន័យអតិថិជនដោយជោគជ័យ! សូមពិនិត្យ & ចុច រក្សាទុក។");
      } catch (err) {
        console.error("JSON parse error:", err);
        showToast("error", "ទម្រង់ឯកសារ JSON មិនត្រឹមត្រូវ។");
      }
    };
    reader.readAsText(file);
  };

  const handleExportData = () => {
    const exportPayload = {
      customerId: currentUser.id || "USR-DEMO",
      name,
      email,
      phone,
      address,
      province,
      exportDate: new Date().toISOString(),
      ordersCount: customerInvoices.length,
      store: "ផ្ទះបៃតង (Baitong House)"
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ទិន្នន័យអតិថិជន_${name.replace(/\s+/g, "_") || "profile"}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("success", "បានទាញយកទិន្នន័យបម្រុងទុក (.json) ដោយជោគជ័យ!");
  };

  return (
    <div className="customer-modal-backdrop" onClick={onClose}>
      <div
        className="customer-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="customer-modal-header">
          <div className="customer-header-title">
            <span className="customer-header-icon">🌿</span>
            <div>
              <h2 id="customer-profile-title" style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}>
                គណនីអតិថិជន ផ្ទះបៃតង
              </h2>
              <span className="customer-badge-status" style={{ fontFamily: "'Battambang', sans-serif" }}>
                ✨ អតិថិជនផ្លូវការ • លេខកូដ: {currentUser.id || "USR-2026"}
              </span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {onLogout && (
              <button
                type="button"
                className="customer-modal-logout-btn"
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                title="ចាកចេញពីគណនី"
                style={{ fontFamily: "'Battambang', sans-serif" }}
              >
                🚪 ចាកចេញ
              </button>
            )}
            <button
              type="button"
              className="customer-modal-close"
              onClick={onClose}
              aria-label="បិទ"
            >
              &times;
            </button>
          </div>
        </div>

        {/* Toast Alert */}
        {toast && (
          <div className={`customer-toast toast-${toast.type}`} role="alert" style={{ fontFamily: "'Battambang', sans-serif" }}>
            <span>{toast.type === "success" ? "✓" : "⚠️"}</span>
            <span>{toast.text}</span>
          </div>
        )}

        {/* Modal Tab Navigation */}
        <div className="customer-tabs-bar" style={{ fontFamily: "'Battambang', sans-serif" }}>
          <button
            type="button"
            className={`customer-tab-btn ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            👤 ព័ត៌មានផ្ទាល់ខ្លួន &amp; រូបថត
          </button>
          <button
            type="button"
            className={`customer-tab-btn ${activeTab === "data" ? "active" : ""}`}
            onClick={() => setActiveTab("data")}
          >
            📤 នាំចេញ / បម្រុងទុកទិន្នន័យ
          </button>
          <button
            type="button"
            className={`customer-tab-btn ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            🧾 ប្រវត្តិកុម្ម៉ង់ ({customerInvoices.length})
          </button>
        </div>

        {/* TAB 1: Profile & Photo */}
        {activeTab === "profile" && (
          <form onSubmit={handleSaveProfile} className="customer-modal-body">
            {/* Avatar Upload */}
            <div className="customer-avatar-section">
              <div className="avatar-preview-wrap">
                {avatar ? (
                  <img src={avatar} alt={name} className="avatar-img-circle" />
                ) : (
                  <div className="avatar-initials-circle">
                    {name ? name.slice(0, 2) : "បត"}
                  </div>
                )}
                <div
                  className="avatar-camera-badge"
                  onClick={() => fileInputRef.current?.click()}
                  title="បង្ហោះរូបថតគណនី"
                >
                  📷
                </div>
              </div>

              <div className="avatar-actions">
                <h4 style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}>រូបថតគណនីអតិថិជន</h4>
                <p style={{ fontFamily: "'Battambang', sans-serif" }}>បង្ហោះរូបភាពច្បាស់ (PNG, JPG, ទំហំមិនលើសពី 3MB)។</p>
                <div className="avatar-btn-row">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleAvatarFileSelect}
                  />
                  <button
                    type="button"
                    className="avatar-upload-btn"
                    onClick={() => fileInputRef.current?.click()}
                    style={{ fontFamily: "'Battambang', sans-serif" }}
                  >
                    ⬆️ បង្ហោះរូបថតថ្មី
                  </button>
                  {avatar && (
                    <button
                      type="button"
                      className="avatar-remove-btn"
                      onClick={handleRemoveAvatar}
                      style={{ fontFamily: "'Battambang', sans-serif" }}
                    >
                      លុបរូបថត
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Editable Fields */}
            <div className="customer-fields-grid" style={{ fontFamily: "'Battambang', sans-serif" }}>
              <div className="form-group">
                <label>ឈ្មោះពេញ *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="customer-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>អាសយដ្ឋានអ៊ីមែល *</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="customer-input customer-input-disabled"
                  title="អ៊ីមែលមិនអាចកែប្រែបានទេ"
                />
                <span className="field-hint">🔒 អត្តសញ្ញាណគណនីចម្បង</span>
              </div>

              <div className="form-group">
                <label>លេខទូរស័ព្ទ *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="customer-input"
                  placeholder="ឧ. 015 241471"
                  required
                />
              </div>

              <div className="form-group">
                <label>រាជធានី / ខេត្ត *</label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="customer-input customer-select"
                >
                  {CAMBODIA_PROVINCES.map((prov) => (
                    <option key={prov.en} value={prov.en}>
                      {prov.km}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group full-width">
                <label>អាសយដ្ឋានដឹកជញ្ជូនលម្អិត *</label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="customer-input customer-textarea"
                  placeholder="ផ្ទះលេខ, ផ្លូវ, សង្កាត់, ខណ្ឌ..."
                  required
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="customer-modal-footer">
              <button
                type="submit"
                className="save-customer-btn"
                disabled={isSaving}
                style={{ fontFamily: "'Battambang', sans-serif" }}
              >
                {isSaving ? "កំពុងរក្សាទុក..." : "💾 រក្សាទុកព័ត៌មានអតិថិជន"}
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: Upload / Backup Data */}
        {activeTab === "data" && (
          <div className="customer-modal-body data-tools-body" style={{ fontFamily: "'Battambang', sans-serif" }}>
            <div className="data-tool-card">
              <div className="tool-icon">📥</div>
              <div className="tool-info">
                <h4 style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}>បញ្ចូលឯកសារទិន្នន័យអតិថិជន</h4>
                <p>
                  នាំចូលព័ត៌មានទំនាក់ទំនង ឬអាសយដ្ឋានដឹកជញ្ជូនពីឯកសារ JSON បម្រុងទុកកន្លងមក។
                </p>
                <input
                  type="file"
                  ref={dataImportInputRef}
                  accept=".json,application/json"
                  style={{ display: "none" }}
                  onChange={handleDataImport}
                />
                <button
                  type="button"
                  className="tool-action-btn primary"
                  onClick={() => dataImportInputRef.current?.click()}
                >
                  📁 ជ្រើសរើសឯកសារ JSON
                </button>
              </div>
            </div>

            <div className="data-tool-card">
              <div className="tool-icon">📤</div>
              <div className="tool-info">
                <h4 style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}>ទាញយកឯកសារបម្រុងទុក</h4>
                <p>
                  ទាញយកឯកសារបម្រុងទុកព័ត៌មានគណនី អាសយដ្ឋានដឹកជញ្ជូន និងចំនួនកុម្ម៉ង់ក្នុងទម្រង់ JSON។
                </p>
                <button
                  type="button"
                  className="tool-action-btn secondary"
                  onClick={handleExportData}
                >
                  💾 ទាញយកទិន្នន័យ (.json)
                </button>
              </div>
            </div>

            <div className="metadata-box">
              <h5 style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}>ព័ត៌មានគណនី</h5>
              <div className="metadata-row">
                <span>កាលបរិច្ឆេទបង្កើត:</span>
                <strong>
                  {currentUser.createdAt
                    ? formatKhmerDateOnly(currentUser.createdAt)
                    : "គណនីសកម្ម"}
                </strong>
              </div>
              <div className="metadata-row">
                <span>ទីតាំងចម្បង:</span>
                <strong>{province}, កម្ពុជា</strong>
              </div>
              <div className="metadata-row">
                <span>ចំនួនកុម្ម៉ង់សរុប:</span>
                <strong>{customerInvoices.length} វិក្កយបត្រ</strong>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Past Purchases */}
        {activeTab === "orders" && (
          <div className="customer-modal-body orders-body" style={{ fontFamily: "'Battambang', sans-serif" }}>
            {customerInvoices.length > 0 ? (
              <div className="invoices-list">
                {customerInvoices.map((inv) => (
                  <div key={inv.id || inv.invoiceNumber} className="invoice-history-item">
                    <div className="inv-left">
                      <span className="inv-badge">🧾 {inv.id || inv.invoiceNumber}</span>
                      <span className="inv-date">{inv.date}</span>
                      <span className="inv-items">
                        {inv.items?.length || 0} មុខ • {inv.customer?.province || "រាជធានីភ្នំពេញ"}
                      </span>
                    </div>
                    <div className="inv-right">
                      <span className="inv-amount">${inv.total?.toFixed(2)}</span>
                      <span className="inv-paid">✓ {inv.paymentMethod}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-orders-view">
                <span className="empty-icon">🛍️</span>
                <h4 style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}>មិនទាន់មានការកុម្ម៉ង់នៅឡើយទេ</h4>
                <p>
                  នៅពេលអ្នកកុម្ម៉ង់ម្ហូប វិក្កយបត្រផ្លូវការនឹងត្រូវរក្សាទុកនៅទីនេះដោយស្វ័យប្រវត្តិ។
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
