import { useState, useEffect } from "react";
import {
  getTelegramConfig,
  saveTelegramConfig
} from "../config/notificationConfig.js";
import {
  sendTelegramAlert,
  notifyNewOrderPlaced,
  notifyNewUserRegistration
} from "../services/notificationService.js";
import {
  getRegisteredCustomers,
  deleteCustomerRecord,
  addCustomerRecord
} from "../services/customerService.js";
import "./NotificationSidebar.css";

export default function NotificationSidebar({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'orders' | 'customers' | 'telegram'

  // Customer Directory State
  const [customers, setCustomers] = useState(() => getRegisteredCustomers());
  const [customerSearch, setCustomerSearch] = useState("");

  // Telegram Config State
  const [telegramEnabled, setTelegramEnabled] = useState(false);
  const [botToken, setBotToken] = useState("");
  const [chatId, setChatId] = useState("");
  const [telegramStatus, setTelegramStatus] = useState(null); // { type: 'success' | 'error', message: '' }
  const [isTestingTelegram, setIsTestingTelegram] = useState(false);

  // Load notifications from localStorage
  const loadNotifications = () => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("skincare_admin_notifications") || "[]"
      );
      setNotifications(saved);
    } catch {
      setNotifications([]);
    }
  };

  // Load Telegram config
  const loadTelegramSettings = () => {
    const config = getTelegramConfig();
    setTelegramEnabled(config.enabled);
    setBotToken(config.token);
    setChatId(config.chatId);
  };

  useEffect(() => {
    loadNotifications();
    loadTelegramSettings();
    setCustomers(getRegisteredCustomers());

    const handleUpdate = () => loadNotifications();
    const handleTgUpdate = () => loadTelegramSettings();
    const handleCustUpdate = () => setCustomers(getRegisteredCustomers());

    window.addEventListener("admin_notifications_updated", handleUpdate);
    window.addEventListener("telegram_config_updated", handleTgUpdate);
    window.addEventListener("registered_customers_updated", handleCustUpdate);

    return () => {
      window.removeEventListener("admin_notifications_updated", handleUpdate);
      window.removeEventListener("telegram_config_updated", handleTgUpdate);
      window.removeEventListener("registered_customers_updated", handleCustUpdate);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Filtered notifications
  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab === "orders") return notif.type === "new_order";
    return true;
  });

  // Filtered customers
  const filteredCustomers = customers.filter((c) => {
    if (!customerSearch.trim()) return true;
    const query = customerSearch.toLowerCase();
    return (
      c.name?.toLowerCase().includes(query) ||
      c.email?.toLowerCase().includes(query) ||
      c.phone?.includes(query) ||
      c.province?.toLowerCase().includes(query)
    );
  });

  const unreadCount = notifications.filter((n) => !n.read).length;
  const ordersCount = notifications.filter((n) => n.type === "new_order").length;

  // Actions
  const handleMarkAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    localStorage.setItem("skincare_admin_notifications", JSON.stringify(updated));
    setNotifications(updated);
    window.dispatchEvent(new Event("admin_notifications_updated"));
  };

  const handleClearAll = () => {
    if (window.confirm("Clear all notification logs?")) {
      localStorage.removeItem("skincare_admin_notifications");
      setNotifications([]);
      window.dispatchEvent(new Event("admin_notifications_updated"));
    }
  };

  const handleDeleteItem = (id, e) => {
    e.stopPropagation();
    const updated = notifications.filter((n) => n.id !== id);
    localStorage.setItem("skincare_admin_notifications", JSON.stringify(updated));
    setNotifications(updated);
    window.dispatchEvent(new Event("admin_notifications_updated"));
  };

  // Save Telegram Settings
  const handleSaveTelegram = (e) => {
    e.preventDefault();
    saveTelegramConfig({
      enabled: telegramEnabled,
      token: botToken.trim(),
      chatId: chatId.trim()
    });
    setTelegramStatus({
      type: "success",
      message: "Telegram settings saved successfully!"
    });
    setTimeout(() => setTelegramStatus(null), 3500);
  };

  // Test Telegram Connection
  const handleTestTelegram = async () => {
    if (!botToken.trim() || !chatId.trim()) {
      setTelegramStatus({
        type: "error",
        message: "Please enter both Bot Token and Chat ID first."
      });
      return;
    }

    setIsTestingTelegram(true);
    setTelegramStatus(null);

    // Save current inputs first
    saveTelegramConfig({
      enabled: true,
      token: botToken.trim(),
      chatId: chatId.trim()
    });
    setTelegramEnabled(true);

    const testMsg = `
🔔 <b>TEST ALERT: SkinCare Co. Notification System</b>
━━━━━━━━━━━━━━━━━━
✅ <b>Connection:</b> <b>SUCCESSFUL!</b>
🏪 <b>Store:</b> SkinCare Co. Phnom Penh
⏰ <b>Time:</b> ${new Date().toLocaleTimeString()}
━━━━━━━━━━━━━━━━━━
<i>Your Telegram bot is now active and ready to alert you on every new user registration and order!</i>
`.trim();

    const result = await sendTelegramAlert(testMsg);
    setIsTestingTelegram(false);

    if (result?.ok) {
      setTelegramStatus({
        type: "success",
        message: "✓ Test alert sent! Please check your Telegram app now."
      });
    } else {
      setTelegramStatus({
        type: "error",
        message: `Failed: ${result?.error || "Check your Bot Token & Chat ID."}`
      });
    }
  };

  // Simulate Quick Test Actions
  const handleSimulateOrder = () => {
    const randomInv = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const sampleInvoice = {
      invoiceNumber: randomInv,
      date: new Date().toLocaleString(),
      customerName: "Sophea Meng",
      customerPhone: "012 998 776",
      customerAddress: "Street 271, Sangkat Boeung Salang",
      customerProvince: "Phnom Penh",
      items: [
        { productName: "Madagascar Centella Ampoule", quantity: 1, price: 21.99 },
        { productName: "Skin Reset Serum", quantity: 1, price: 18.0 }
      ],
      total: 39.99,
      paymentMethod: "ABA Bank QR"
    };

    notifyNewOrderPlaced(sampleInvoice);
  };

  const handleSimulateSignup = () => {
    const randomId = Math.floor(100 + Math.random() * 900);
    const sampleNames = ["Dara Rathana", "Sophea Chea", "Vannak Meas", "Kalyan Lim", "Channary Keo", "Pisey Heng"];
    const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    const sampleProvinces = ["Phnom Penh", "Siem Reap", "Battambang", "Kampot", "Sihanoukville"];
    const randomProv = sampleProvinces[Math.floor(Math.random() * sampleProvinces.length)];

    const sampleUser = {
      id: `USR-${Date.now()}`,
      name: randomName,
      email: `${randomName.toLowerCase().replace(/\s+/g, ".")}${randomId}@gmail.com`,
      phone: `0${Math.floor(10 + Math.random() * 89)} ${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)}`,
      province: randomProv,
      address: `Street ${Math.floor(100 + Math.random() * 400)}, ${randomProv}`,
      role: "Registered Customer",
      createdAt: new Date().toISOString()
    };

    addCustomerRecord(sampleUser);
    notifyNewUserRegistration(sampleUser);
  };

  return (
    <div className="notif-sidebar-overlay" onClick={onClose}>
      <div className="notif-sidebar-panel" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="notif-sidebar-header">
          <div className="notif-header-title">
            <span className="notif-header-icon">🔔</span>
            <div>
              <h3>Store Alerts</h3>
              <p className="notif-header-sub">
                Real-time alerts for registrations &amp; orders
              </p>
            </div>
            {unreadCount > 0 && (
              <span className="notif-unread-pill">{unreadCount} New</span>
            )}
          </div>
          <button className="notif-close-btn" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="notif-tabs-bar">
          <button
            className={`notif-tab ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All Alerts ({notifications.length})
          </button>
          <button
            className={`notif-tab ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            🛍️ Orders ({ordersCount})
          </button>
          <button
            className={`notif-tab ${activeTab === "customers" ? "active" : ""}`}
            onClick={() => setActiveTab("customers")}
          >
            👥 Customers ({customers.length})
          </button>
          <button
            className={`notif-tab ${activeTab === "telegram" ? "active" : ""}`}
            onClick={() => setActiveTab("telegram")}
          >
            ✈️ Telegram {telegramEnabled && <span className="tg-active-dot"></span>}
          </button>
        </div>

        {/* Action Toolbar */}
        {activeTab !== "telegram" && (
          <div className="notif-toolbar">
            <div className="toolbar-left">
              {activeTab !== "customers" && unreadCount > 0 && (
                <button className="tb-btn" onClick={handleMarkAllRead}>
                  ✓ Mark read
                </button>
              )}
              {activeTab !== "customers" && notifications.length > 0 && (
                <button className="tb-btn text-danger" onClick={handleClearAll}>
                  🗑️ Clear
                </button>
              )}
              {activeTab === "customers" && (
                <span style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 600 }}>
                  Showing {filteredCustomers.length} registered accounts
                </span>
              )}
            </div>
            <div className="toolbar-right">
              {activeTab !== "customers" && (
                <button
                  className="tb-btn test-btn"
                  onClick={handleSimulateOrder}
                  title="Create a sample order to test the alert system"
                >
                  + Test Order
                </button>
              )}
              <button
                className="tb-btn test-btn"
                onClick={handleSimulateSignup}
                title="Register a sample customer account and trigger alert"
              >
                + Add Customer
              </button>
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="notif-body">
          {/* TAB 1 & 2: Alerts List (All / Orders) */}
          {(activeTab === "all" || activeTab === "orders") && (
            <>
              {filteredNotifications.length > 0 ? (
                <div className="notif-list">
                  {filteredNotifications.map((item) => (
                    <div
                      key={item.id}
                      className={`notif-card ${item.type} ${item.read ? "read" : "unread"}`}
                    >
                      <div className="notif-card-header">
                        <div className="notif-type-tag">
                          {item.type === "new_order" ? "🛍️ New Order" : "👤 New Customer"}
                        </div>
                        <div className="notif-time">
                          {item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
                          <button
                            className="notif-del-item-btn"
                            onClick={(e) => handleDeleteItem(item.id, e)}
                            title="Delete"
                          >
                            &times;
                          </button>
                        </div>
                      </div>

                      <h4 className="notif-card-title">{item.title}</h4>
                      <p className="notif-card-desc">{item.message}</p>

                      {/* Extra details for Orders */}
                      {item.type === "new_order" && item.invoice && (
                        <div className="notif-detail-box order-box">
                          <div className="detail-row">
                            <span>Amount:</span>
                            <strong className="amount-highlight">
                              ${item.invoice.total?.toFixed(2)}
                            </strong>
                          </div>
                          <div className="detail-row">
                            <span>Payment:</span>
                            <span className="badge-pay">{item.invoice.paymentMethod}</span>
                          </div>
                          {item.invoice.customerPhone && (
                            <div className="detail-row">
                              <span>Phone:</span>
                              <strong>{item.invoice.customerPhone}</strong>
                            </div>
                          )}
                          {item.invoice.customerProvince && (
                            <div className="detail-row">
                              <span>Province:</span>
                              <span>{item.invoice.customerProvince}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Extra details for Signups */}
                      {item.type === "new_user" && item.user && (
                        <div className="notif-detail-box user-box">
                          <div className="detail-row">
                            <span>Customer:</span>
                            <strong>{item.user.name}</strong>
                          </div>
                          <div className="detail-row">
                            <span>Email:</span>
                            <span>{item.user.email}</span>
                          </div>
                          <div className="detail-row">
                            <span>Phone:</span>
                            <strong>{item.user.phone}</strong>
                          </div>
                          <div className="detail-row">
                            <span>Province:</span>
                            <span>{item.user.province || "Phnom Penh"}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="notif-empty-state">
                  <span className="empty-icon">🔕</span>
                  <h4>No Alerts Yet</h4>
                  <p>
                    When customers register or place orders, real-time alerts will
                    appear here and ping your Telegram bot.
                  </p>
                  <div className="empty-actions">
                    <button className="tb-btn test-btn" onClick={handleSimulateOrder}>
                      + Send Sample Order Alert
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* TAB 3: Registered Customers Directory */}
          {activeTab === "customers" && (
            <div className="customers-container">
              {/* Search Bar */}
              <div className="customer-search-bar">
                <span className="customer-search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search customer by name, email, phone, city..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="customer-search-input"
                />
                {customerSearch && (
                  <button
                    type="button"
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}
                    onClick={() => setCustomerSearch("")}
                  >
                    &times;
                  </button>
                )}
              </div>

              <div className="customer-list-summary">
                <span>Total Customers: <strong>{customers.length}</strong></span>
                <span>Filtered: <strong>{filteredCustomers.length}</strong></span>
              </div>

              {filteredCustomers.length > 0 ? (
                <div className="customer-cards-list">
                  {filteredCustomers.map((cust) => {
                    const isAdmin = cust.role?.includes("Admin") || cust.email === "admin@gmail.com";
                    const initials = cust.name
                      ? cust.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .substring(0, 2)
                          .toUpperCase()
                      : "U";

                    return (
                      <div key={cust.id || cust.email} className="customer-card-item">
                        <div className="customer-card-header">
                          <div className="customer-identity">
                            <div className="customer-avatar-circle">
                              {initials}
                            </div>
                            <div className="customer-names-group">
                              <h4>{cust.name}</h4>
                              <span className={`customer-role-tag ${isAdmin ? "admin" : "customer"}`}>
                                {isAdmin ? "👑 Store Owner" : "👤 Customer"}
                              </span>
                            </div>
                          </div>
                          {!isAdmin && (
                            <button
                              type="button"
                              className="customer-delete-btn"
                              title="Delete customer account"
                              onClick={() => {
                                if (window.confirm(`Delete customer "${cust.name}"?`)) {
                                  deleteCustomerRecord(cust.id);
                                }
                              }}
                            >
                              🗑️
                            </button>
                          )}
                        </div>

                        <div className="customer-details-grid">
                          <div className="cust-detail-cell">
                            <span>📞</span>
                            <strong>{cust.phone || "No phone"}</strong>
                          </div>
                          <div className="cust-detail-cell">
                            <span>📍</span>
                            <span>{cust.province || "Phnom Penh"}</span>
                          </div>
                          <div className="cust-detail-cell full-width">
                            <span>📧</span>
                            <span>{cust.email}</span>
                          </div>
                          {cust.address && (
                            <div className="cust-detail-cell full-width">
                              <span>🏠</span>
                              <span>{cust.address}</span>
                            </div>
                          )}
                          <div className="cust-join-date full-width">
                            Joined: {cust.createdAt ? new Date(cust.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Active Customer"}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="notif-empty-state">
                  <span className="empty-icon">🔍</span>
                  <h4>No Customers Found</h4>
                  <p>No customer matching "{customerSearch}".</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Telegram Bot Integration Settings */}
          {activeTab === "telegram" && (
            <div className="telegram-settings-panel">
              <div className="tg-banner-card">
                <div className="tg-banner-icon">✈️</div>
                <div className="tg-banner-text">
                  <h4>Instant Telegram Phone Alerts</h4>
                  <p>
                    Receive instant push notifications with sound on your phone
                    whenever someone registers or makes a purchase!
                  </p>
                </div>
              </div>

              {telegramStatus && (
                <div className={`tg-status-alert ${telegramStatus.type}`}>
                  <span>{telegramStatus.type === "success" ? "✓" : "⚠️"}</span>
                  <span>{telegramStatus.message}</span>
                </div>
              )}

              <form onSubmit={handleSaveTelegram} className="tg-config-form">
                <div className="tg-switch-row">
                  <label htmlFor="tg-enable-toggle" className="tg-switch-label">
                    <strong>Enable Telegram Alerts</strong>
                    <small>Send alerts to your Telegram chat</small>
                  </label>
                  <input
                    id="tg-enable-toggle"
                    type="checkbox"
                    checked={telegramEnabled}
                    onChange={(e) => setTelegramEnabled(e.target.checked)}
                    className="tg-checkbox"
                  />
                </div>

                <div className="tg-input-group">
                  <label>
                    Telegram Bot Token
                    <span className="tg-tip">From @BotFather</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 7123456789:AAHq_xyz123..."
                    value={botToken}
                    onChange={(e) => setBotToken(e.target.value)}
                    className="tg-text-input"
                  />
                </div>

                <div className="tg-input-group">
                  <label>
                    Telegram Chat ID
                    <span className="tg-tip">From @userinfobot</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 123456789"
                    value={chatId}
                    onChange={(e) => setChatId(e.target.value)}
                    className="tg-text-input"
                  />
                </div>

                <div className="tg-button-group">
                  <button type="submit" className="tg-save-btn">
                    💾 Save Settings
                  </button>
                  <button
                    type="button"
                    className="tg-test-btn"
                    onClick={handleTestTelegram}
                    disabled={isTestingTelegram}
                  >
                    {isTestingTelegram ? "Pinging Telegram..." : "⚡ Test & Send Alert"}
                  </button>
                </div>
              </form>

              {/* 3-Step Setup Guide */}
              <div className="tg-guide-card">
                <h5>How to set up in 2 minutes:</h5>
                <ol className="tg-guide-steps">
                  <li>
                    Open <strong>Telegram</strong> on your phone or PC and search for{" "}
                    <code>@BotFather</code>.
                  </li>
                  <li>
                    Send <code>/newbot</code>, give it a name (e.g. <em>SkinCare Co Alerts</em>),
                    and copy the <strong>HTTP API Token</strong> into the field above.
                  </li>
                  <li>
                    Search for <code>@userinfobot</code> in Telegram, send <code>/start</code>,
                    copy your <strong>Id</strong> into the Chat ID field above, and click{" "}
                    <strong>Test &amp; Send Alert</strong>!
                  </li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
