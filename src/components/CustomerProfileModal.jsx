import { useState, useRef, useEffect } from "react";
import "./CustomerProfileModal.css";

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

/**
 * Customer Profile & Data Upload Modal
 * Allows customers to:
 * 1. View full registered account & customer data
 * 2. Upload and change profile photo (avatar) with live preview
 * 3. Edit and update delivery address, phone, and province
 * 4. Upload/Import customer data file (JSON)
 * 5. Export customer backup data (JSON)
 * 6. View recent purchase invoices
 */
export default function CustomerProfileModal({
  isOpen,
  onClose,
  currentUser,
  onUpdateCurrentUser,
  onLogout
}) {
  const fileInputRef = useRef(null);
  const dataImportInputRef = useRef(null);

  // Active view tab: 'profile' | 'data' | 'orders'
  const [activeTab, setActiveTab] = useState("profile");

  // Form Fields State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [province, setProvince] = useState("Phnom Penh");
  const [avatar, setAvatar] = useState("");
  const [customerInvoices, setCustomerInvoices] = useState([]);

  // Toast / Alert Feedback
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', text: '' }
  const [isSaving, setIsSaving] = useState(false);

  // Sync state whenever modal opens or currentUser changes
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setEmail(currentUser.email || "");
      setPhone(currentUser.phone || "015 241471");
      setAvatar(currentUser.avatar || "");

      // Read delivery address from saved customer info
      try {
        const savedInfo = JSON.parse(
          localStorage.getItem("skincare_customer_info") || "{}"
        );
        setAddress(savedInfo.address || currentUser.address || "Street 271, Phnom Penh, Cambodia");
        setProvince(savedInfo.province || currentUser.province || "Phnom Penh");
      } catch {
        setAddress(currentUser.address || "Phnom Penh, Cambodia");
        setProvince(currentUser.province || "Phnom Penh");
      }

      // Load past invoices
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

  // ── 1. Upload Profile Photo / Avatar ──
  const handleAvatarFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image type
    if (!file.type.startsWith("image/")) {
      showToast("error", "Please select a valid image file (JPG, PNG, WebP).");
      return;
    }

    // Limit to 3MB
    if (file.size > 3 * 1024 * 1024) {
      showToast("error", "Image file size must be less than 3MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = event.target?.result;
      if (base64Data) {
        setAvatar(base64Data);
        showToast("success", "Photo uploaded! Click 'Save Changes' to update your account.");
      }
    };
    reader.onerror = () => {
      showToast("error", "Failed to read image file.");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatar("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    showToast("success", "Photo removed. Click 'Save Changes' to apply.");
  };

  // ── 2. Save Updated Customer Data ──
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

      showToast("success", "Customer data updated and saved successfully! ✨");
    } catch (err) {
      console.error("Failed to save profile:", err);
      showToast("error", "Could not save customer data. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // ── 3. Upload / Import Customer Data (JSON file) ──
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
        if (data.province && CAMBODIA_PROVINCES.includes(data.province)) {
          setProvince(data.province);
        }
        if (data.avatar) setAvatar(data.avatar);

        showToast("success", "Customer data imported successfully! Review & click Save.");
      } catch (err) {
        console.error("JSON parse error:", err);
        showToast("error", "Invalid JSON format. Please upload a valid customer data file.");
      }
    };
    reader.readAsText(file);
  };

  // ── 4. Export Customer Data File ──
  const handleExportData = () => {
    const exportPayload = {
      customerId: currentUser.id || "USR-DEMO",
      name,
      email,
      phone,
      address,
      province,
      avatar: avatar ? "Embedded Base64" : "None",
      exportDate: new Date().toISOString(),
      ordersCount: customerInvoices.length,
      store: "SkinCare Co. Phnom Penh"
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `customer_data_${name.replace(/\s+/g, "_").toLowerCase() || "profile"}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("success", "Customer data downloaded as JSON backup!");
  };

  return (
    <div className="customer-modal-backdrop" onClick={onClose}>
      <div
        className="customer-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="customer-profile-title"
      >
        {/* Header */}
        <div className="customer-modal-header">
          <div className="customer-header-title">
            <span className="customer-header-icon">🌿</span>
            <div>
              <h2 id="customer-profile-title">Customer Account</h2>
              <span className="customer-badge-status">
                ✨ Verified Customer • Member ID: {currentUser.id || "USR-2026"}
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
                title="Log out of this account"
              >
                🚪 Log Out
              </button>
            )}
            <button
              type="button"
              className="customer-modal-close"
              onClick={onClose}
              aria-label="Close modal"
            >
              &times;
            </button>
          </div>
        </div>

        {/* Toast Alert */}
        {toast && (
          <div className={`customer-toast toast-${toast.type}`} role="alert">
            <span>{toast.type === "success" ? "✓" : "⚠️"}</span>
            <span>{toast.text}</span>
          </div>
        )}

        {/* Modal Tab Navigation */}
        <div className="customer-tabs-bar">
          <button
            type="button"
            className={`customer-tab-btn ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            👤 Profile &amp; Photo
          </button>
          <button
            type="button"
            className={`customer-tab-btn ${activeTab === "data" ? "active" : ""}`}
            onClick={() => setActiveTab("data")}
          >
            📤 Upload / Backup Data
          </button>
          <button
            type="button"
            className={`customer-tab-btn ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            🧾 Purchases ({customerInvoices.length})
          </button>
        </div>

        {/* ════════════════════════════════════════════
            TAB 1: Profile & Photo Upload
           ════════════════════════════════════════════ */}
        {activeTab === "profile" && (
          <form onSubmit={handleSaveProfile} className="customer-modal-body">
            {/* Avatar Upload Banner */}
            <div className="customer-avatar-section">
              <div className="avatar-preview-wrap">
                {avatar ? (
                  <img src={avatar} alt={name} className="avatar-img-circle" />
                ) : (
                  <div className="avatar-initials-circle">
                    {name ? name.slice(0, 2).toUpperCase() : "CU"}
                  </div>
                )}
                <div
                  className="avatar-camera-badge"
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload profile photo"
                >
                  📷
                </div>
              </div>

              <div className="avatar-actions">
                <h4>Customer Profile Photo</h4>
                <p>Upload a clean headshot or avatar image (PNG, JPG, max 3MB).</p>
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
                  >
                    ⬆️ Upload New Photo
                  </button>
                  {avatar && (
                    <button
                      type="button"
                      className="avatar-remove-btn"
                      onClick={handleRemoveAvatar}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Editable Fields Grid */}
            <div className="customer-fields-grid">
              <div className="form-group">
                <label>Full Name (ឈ្មោះ)</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="customer-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address (អ៊ីមែល)</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="customer-input customer-input-disabled"
                  title="Account email address cannot be changed"
                />
                <span className="field-hint">🔒 Primary Account Identifier</span>
              </div>

              <div className="form-group">
                <label>Phone Number (លេខទូរស័ព្ទ)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="customer-input"
                  placeholder="e.g. 015 241471"
                  required
                />
              </div>

              <div className="form-group">
                <label>Province / City (ខេត្ត / រាជធានី)</label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="customer-input customer-select"
                >
                  {CAMBODIA_PROVINCES.map((prov) => (
                    <option key={prov} value={prov}>
                      {prov}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group full-width">
                <label>Delivery Address (អាសយដ្ឋានដឹកជញ្ជូន)</label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="customer-input customer-textarea"
                  placeholder="Street, Sangkat, Khan..."
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
              >
                {isSaving ? "Saving Changes..." : "💾 Save Customer Data"}
              </button>
            </div>
          </form>
        )}

        {/* ════════════════════════════════════════════
            TAB 2: Upload / Backup Data (JSON)
           ════════════════════════════════════════════ */}
        {activeTab === "data" && (
          <div className="customer-modal-body data-tools-body">
            {/* Upload Section */}
            <div className="data-tool-card">
              <div className="tool-icon">📥</div>
              <div className="tool-info">
                <h4>Upload Customer Data File</h4>
                <p>
                  Import customer contact details, preferences, or delivery address
                  from a previously exported JSON backup file.
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
                  📁 Select JSON File to Upload
                </button>
              </div>
            </div>

            {/* Export Section */}
            <div className="data-tool-card">
              <div className="tool-icon">📤</div>
              <div className="tool-info">
                <h4>Export Customer Data Backup</h4>
                <p>
                  Download a complete backup of your profile details, shipping
                  addresses, and order count in JSON format.
                </p>
                <button
                  type="button"
                  className="tool-action-btn secondary"
                  onClick={handleExportData}
                >
                  💾 Download Customer Data (.json)
                </button>
              </div>
            </div>

            {/* Account Metadata Card */}
            <div className="metadata-box">
              <h5>Account Details</h5>
              <div className="metadata-row">
                <span>Account Created:</span>
                <strong>
                  {currentUser.createdAt
                    ? new Date(currentUser.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })
                    : "Active Account"}
                </strong>
              </div>
              <div className="metadata-row">
                <span>Primary Location:</span>
                <strong>{province}, Cambodia</strong>
              </div>
              <div className="metadata-row">
                <span>Total Orders Placed:</span>
                <strong>{customerInvoices.length} Invoices</strong>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════
            TAB 3: Past Purchases & Invoices
           ════════════════════════════════════════════ */}
        {activeTab === "orders" && (
          <div className="customer-modal-body orders-body">
            {customerInvoices.length > 0 ? (
              <div className="invoices-list">
                {customerInvoices.map((inv) => (
                  <div key={inv.invoiceNumber} className="invoice-history-item">
                    <div className="inv-left">
                      <span className="inv-badge">🧾 {inv.invoiceNumber}</span>
                      <span className="inv-date">{inv.date}</span>
                      <span className="inv-items">
                        {inv.items?.length || 0} items • {inv.customerProvince || "Phnom Penh"}
                      </span>
                    </div>
                    <div className="inv-right">
                      <span className="inv-amount">${inv.total?.toFixed(2)}</span>
                      <span className="inv-paid">✓ Paid with ABA QR</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-orders-view">
                <span className="empty-icon">🛍️</span>
                <h4>No Orders Placed Yet</h4>
                <p>
                  When you complete purchases, your official tax invoices will be
                  automatically saved and available here.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
