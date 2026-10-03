import { useState, useEffect } from "react";
import {
  getTelegramConfig,
  saveTelegramConfig,
  clearTelegramConfig
} from "../config/notificationConfig.js";
import {
  sendTelegramAlert,
  notifyNewOrderPlaced,
  notifyNewUserRegistration
} from "../services/notificationService.js";
import {
  getRegisteredCustomers,
  deleteCustomerRecord,
  saveRegisteredCustomers
} from "../services/customerService.js";
import { formatKhmerDateTime, formatKhmerDateOnly, formatKhmerTime } from "../utils/khmerDate.js";
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
  const [telegramStatus, setTelegramStatus] = useState(null);
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
    if (window.confirm("តើអ្នកប្រាកដជាចង់សម្អាតដំណឹងទាំងអស់មែនទេ?")) {
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
      message: "បានរក្សាទុកការកំណត់ Telegram ដោយជោគជ័យ!"
    });
    setTimeout(() => setTelegramStatus(null), 3500);
  };

  // Remove / Clear Telegram Credentials
  const handleRemoveTelegram = () => {
    if (window.confirm("តើអ្នកចង់លុប Bot Token និង Chat ID ចេញមែនទេ?")) {
      clearTelegramConfig();
      setTelegramEnabled(false);
      setBotToken("");
      setChatId("");
      setTelegramStatus({
        type: "success",
        message: "✓ បានលុប Telegram Token & Chat ID រួចរាល់។"
      });
      setTimeout(() => setTelegramStatus(null), 3500);
    }
  };

  // Test Telegram Alert
  const handleTestTelegram = async () => {
    if (!botToken.trim() || !chatId.trim()) {
      setTelegramStatus({
        type: "error",
        message: "សូមបញ្ចូល Telegram Bot Token និង Chat ID ជាមុនសិន។"
      });
      return;
    }

    setIsTestingTelegram(true);
    setTelegramStatus(null);

    const testMsg = `
🔔 *ដំណឹងសាកល្បងពី ផ្ទះបៃតង (Baitong House)*
⏰ កាលបរិច្ឆេទ & ម៉ោង: ${formatKhmerDateTime(new Date())}
ម្ចាស់ហាង: CHUM BUNTHARY (ជុំ ប៊ុនថារី)
អ្នកគ្រប់គ្រង: Putheanita Prom
✅ ប្រព័ន្ធជូនដំណឹងដំណើរការល្អឥតខ្ចោះ!
    `.trim();

    const result = await sendTelegramAlert(testMsg);
    setIsTestingTelegram(false);

    if (result?.ok) {
      setTelegramStatus({
        type: "success",
        message: "✓ បានផ្ញើសារដំណឹងសាកល្បង! សូមពិនិត្យកម្មវិធី Telegram របស់អ្នក។"
      });
    } else {
      setTelegramStatus({
        type: "error",
        message: `បរាជ័យ: ${result?.error || "សូមពិនិត្យមើល Bot Token & Chat ID ម្តងទៀត។"}`
      });
    }
  };

  // Simulate Quick Test Actions
  const handleSimulateOrder = () => {
    const randomInv = `INV-BT-${Math.floor(1000 + Math.random() * 9000)}`;
    const sampleInvoice = {
      invoiceNumber: randomInv,
      date: formatKhmerDateTime(new Date()),
      customerName: "សុខា ម៉េង",
      customerPhone: "012 998 776",
      customerAddress: "ផ្លូវ ២៧១ សង្កាត់បឹងសាឡាង",
      customerProvince: "រាជធានីភ្នំពេញ",
      items: [
        { productName: "អាម៉ុកត្រីស្លឹកចេក", quantity: 1, price: 5.50 },
        { productName: "ឡុកឡាក់សាច់គោខ្ទះក្តៅ", quantity: 1, price: 6.00 }
      ],
      total: 11.50,
      paymentMethod: "ABA Bank KHQR"
    };

    notifyNewOrderPlaced(sampleInvoice);
  };

  return (
    <div className="notif-sidebar-overlay" onClick={onClose}>
      <div className="notif-sidebar-panel" onClick={(e) => e.stopPropagation()} style={{ fontFamily: "'Battambang', sans-serif" }}>
        
        {/* Header */}
        <div className="notif-sidebar-header">
          <div className="notif-header-title">
            <span className="notif-header-icon">🔔</span>
            <div>
              <h3 style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}>ការជូនដំណឹងហាង</h3>
              <p className="notif-header-sub">
                ដំណឹងជាក់ស្តែងសម្រាប់ការចុះឈ្មោះ &amp; ការកុម្ម៉ង់ម្ហូប
              </p>
            </div>
            {unreadCount > 0 && (
              <span className="notif-unread-pill">{unreadCount} ថ្មី</span>
            )}
          </div>
          <button className="notif-close-btn" onClick={onClose} aria-label="បិទ">
            &times;
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="notif-tabs-bar">
          <button
            className={`notif-tab ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            ដំណឹងទាំងអស់ ({notifications.length})
          </button>
          <button
            className={`notif-tab ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            🛍️ ការកុម្ម៉ង់ ({ordersCount})
          </button>
          <button
            className={`notif-tab ${activeTab === "customers" ? "active" : ""}`}
            onClick={() => setActiveTab("customers")}
          >
            👥 អតិថិជន ({customers.length})
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
                  ✓ អានទាំងអស់
                </button>
              )}
              {activeTab !== "customers" && notifications.length > 0 && (
                <button className="tb-btn text-danger" onClick={handleClearAll}>
                  🗑️ សម្អាត
                </button>
              )}
              {activeTab === "customers" && (
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 600 }}>
                    បង្ហាញ {filteredCustomers.length} គណនី
                  </span>
                  {customers.length > 0 && (
                    <button
                      className="tb-btn text-danger"
                      onClick={() => {
                        if (window.confirm("តើចង់សម្អាតបញ្ជីអតិថិជនទាំងអស់មែនទេ?")) {
                          saveRegisteredCustomers([]);
                          setCustomers([]);
                        }
                      }}
                    >
                      🗑️ សម្អាតទាំងអស់
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="toolbar-right">
              {activeTab !== "customers" && (
                <button
                  className="tb-btn test-btn"
                  onClick={handleSimulateOrder}
                  title="បង្កើតការកុម្ម៉ង់សាកល្បង"
                >
                  + សាកល្បងកុម្ម៉ង់
                </button>
              )}
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="notif-body">
          {/* TAB 1 & 2: Alerts List */}
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
                          {item.type === "new_order" ? "🛍️ ការកុម្ម៉ង់ថ្មី" : "👤 អតិថិជនថ្មី"}
                        </div>
                        <div className="notif-time">
                          {item.timestamp ? formatKhmerTime(item.timestamp, false) : "អម្បាញ់មិញ"}
                          <button
                            className="notif-del-item-btn"
                            onClick={(e) => handleDeleteItem(item.id, e)}
                            title="លុប"
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
                            <span>ទឹកប្រាក់:</span>
                            <strong className="amount-highlight">
                              ${item.invoice.total?.toFixed(2)}
                            </strong>
                          </div>
                          <div className="detail-row">
                            <span>ការទូទាត់:</span>
                            <span className="badge-pay">{item.invoice.paymentMethod}</span>
                          </div>
                          {item.invoice.customerPhone && (
                            <div className="detail-row">
                              <span>ទូរស័ព្ទ:</span>
                              <strong>{item.invoice.customerPhone}</strong>
                            </div>
                          )}
                          {item.invoice.customerProvince && (
                            <div className="detail-row">
                              <span>រាជធានី/ខេត្ត:</span>
                              <span>{item.invoice.customerProvince}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Extra details for Signups */}
                      {item.type === "new_user" && item.user && (
                        <div className="notif-detail-box user-box">
                          <div className="detail-row">
                            <span>អតិថិជន:</span>
                            <strong>{item.user.name}</strong>
                          </div>
                          <div className="detail-row">
                            <span>អ៊ីមែល:</span>
                            <span>{item.user.email}</span>
                          </div>
                          <div className="detail-row">
                            <span>ទូរស័ព្ទ:</span>
                            <strong>{item.user.phone}</strong>
                          </div>
                          <div className="detail-row">
                            <span>រាជធានី/ខេត្ត:</span>
                            <span>{item.user.province || "រាជធានីភ្នំពេញ"}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="notif-empty-state">
                  <span className="empty-icon">🔕</span>
                  <h4 style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}>មិនទាន់មានការជូនដំណឹងនៅឡើយទេ</h4>
                  <p>
                    នៅពេលមានអតិថិជនចុះឈ្មោះ ឬកុម្ម៉ង់ម្ហូប ដំណឹងជាក់ស្តែងនឹងបង្ហាញនៅទីនេះ និងផ្ញើទៅកាន់ Telegram របស់អ្នក។
                  </p>
                  <div className="empty-actions">
                    <button className="tb-btn test-btn" onClick={handleSimulateOrder}>
                      + ផ្ញើដំណឹងកុម្ម៉ង់សាកល្បង
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* TAB 3: Registered Customers */}
          {activeTab === "customers" && (
            <div className="customers-container">
              <div className="customer-search-bar">
                <span className="customer-search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="ស្វែងរកតាមឈ្មោះ អ៊ីមែល លេខទូរស័ព្ទ..."
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
                <span>អតិថិជនសរុប: <strong>{customers.length}</strong></span>
                <span>លទ្ធផល: <strong>{filteredCustomers.length}</strong></span>
              </div>

              {filteredCustomers.length > 0 ? (
                <div className="customer-cards-list">
                  {filteredCustomers.map((cust) => {
                    const isAdmin = cust.role?.includes("Admin") || cust.email === "admin@gmail.com";
                    const initials = cust.name ? cust.name.slice(0, 2) : "បត";

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
                                {isAdmin ? "👑 ម្ចាស់ហាង" : "👤 អតិថិជន"}
                              </span>
                            </div>
                          </div>
                          {!isAdmin && (
                            <button
                              type="button"
                              className="customer-delete-btn"
                              title="លុបគណនីអតិថិជន"
                              onClick={() => {
                                if (window.confirm(`តើអ្នកចង់លុបគណនី "${cust.name}" មែនទេ?`)) {
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
                            <strong>{cust.phone || "គ្មានលេខ"}</strong>
                          </div>
                          <div className="cust-detail-cell">
                            <span>📍</span>
                            <span>{cust.province || "រាជធានីភ្នំពេញ"}</span>
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
                            ចុះឈ្មោះ: {cust.createdAt ? formatKhmerDateOnly(cust.createdAt) : "គណនីសកម្ម"}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="notif-empty-state">
                  <span className="empty-icon">🔍</span>
                  <h4 style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}>រកមិនឃើញអតិថិជនទេ</h4>
                  <p>គ្មានអតិថិជនណាត្រូវនឹងពាក្យ "{customerSearch}" ឡើយ។</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Telegram Bot Integration */}
          {activeTab === "telegram" && (
            <div className="telegram-settings-panel">
              <div className="tg-banner-card">
                <div className="tg-banner-icon">✈️</div>
                <div className="tg-banner-text">
                  <h4 style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}>ការជូនដំណឹងតាម Telegram លើទូរស័ព្ទ</h4>
                  <p>
                    ទទួលបានសារជូនដំណឹងភ្លាមៗលើទូរស័ព្ទរបស់អ្នករាល់ពេលមានអ្នកចុះឈ្មោះ ឬកុម្ម៉ង់ម្ហូបពី ផ្ទះបៃតង!
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
                    <strong>បើកដំណើរការការជូនដំណឹងតាម Telegram</strong>
                    <small>ផ្ញើសារជូនដំណឹងទៅកាន់ Telegram របស់អ្នក</small>
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
                    <span className="tg-tip">ពី @BotFather</span>
                  </label>
                  <input
                    type="text"
                    placeholder="ឧ. 7123456789:AAHq_xyz123..."
                    value={botToken}
                    onChange={(e) => setBotToken(e.target.value)}
                    className="tg-text-input"
                  />
                </div>

                <div className="tg-input-group">
                  <label>
                    Telegram Chat ID
                    <span className="tg-tip">ពី @userinfobot</span>
                  </label>
                  <input
                    type="text"
                    placeholder="ឧ. 123456789"
                    value={chatId}
                    onChange={(e) => setChatId(e.target.value)}
                    className="tg-text-input"
                  />
                </div>

                <div className="tg-button-group">
                  <button type="submit" className="tg-save-btn">
                    💾 រក្សាទុកការកំណត់
                  </button>
                  <button
                    type="button"
                    className="tg-test-btn"
                    onClick={handleTestTelegram}
                    disabled={isTestingTelegram}
                  >
                    {isTestingTelegram ? "កំពុងទាក់ទង Telegram..." : "⚡ សាកល្បងផ្ញើសារដំណឹង"}
                  </button>
                  {(botToken || chatId) && (
                    <button
                      type="button"
                      className="tb-btn text-danger"
                      onClick={handleRemoveTelegram}
                      style={{ padding: "8px 12px", borderRadius: "8px", fontWeight: 700 }}
                      title="លុប Token និង Chat ID"
                    >
                      🗑️ លុប Token ចេញ
                    </button>
                  )}
                </div>
              </form>

              {/* 3-Step Setup Guide */}
              <div className="tg-guide-card">
                <h5 style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}>របៀបដំឡើងងាយៗក្នុងរយៈពេល ២ នាទី:</h5>
                <ol className="tg-guide-steps">
                  <li>
                    បើកកម្មវិធី <strong>Telegram</strong> លើទូរស័ព្ទ ឬកុំព្យូទ័រ ហើយស្វែងរក{" "}
                    <code>@BotFather</code>។
                  </li>
                  <li>
                    ផ្ញើសារ <code>/newbot</code> ដាក់ឈ្មោះ (ឧ. <em>Baitong House Alerts</em>)
                    ហើយចម្លង <strong>HTTP API Token</strong> ដាក់ក្នុងប្រអប់ខាងលើ។
                  </li>
                  <li>
                    ស្វែងរក <code>@userinfobot</code> ក្នុង Telegram ផ្ញើសារ <code>/start</code>
                    ហើយចម្លងលេខ <strong>Id</strong> ដាក់ក្នុងប្រអប់ Chat ID រួចចុច{" "}
                    <strong>សាកល្បងផ្ញើសារដំណឹង</strong>!
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
