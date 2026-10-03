import { NOTIFICATION_CONFIG, getTelegramConfig } from "../config/notificationConfig.js";

/**
 * Real-Time Notification Service
 * Automatically notifies the store owner when:
 * 1. A new user registers an account
 * 2. A customer places an order and completes checkout
 */

/**
 * Send an instant alert message to the owner's Telegram app
 */
export async function sendTelegramAlert(htmlMessage) {
  const config = getTelegramConfig();
  if (!config.enabled) return { ok: false, reason: "Telegram notifications are disabled." };
  if (!config.token || !config.chatId) {
    console.warn("Telegram alert skipped: BOT_TOKEN or CHAT_ID is missing.");
    return { ok: false, reason: "Token or Chat ID missing." };
  }

  const url = `https://api.telegram.org/bot${config.token}/sendMessage`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: config.chatId,
        parse_mode: "HTML",
        text: htmlMessage
      })
    });
    const data = await res.json();
    if (!data.ok) {
      console.error("Telegram API Error:", data.description);
      return { ok: false, error: data.description };
    }
    return { ok: true, data };
  } catch (err) {
    console.error("Failed to send Telegram alert:", err);
    return { ok: false, error: err.message };
  }
}

/**
 * Show a native Desktop/Browser Push Notification
 */
export function sendBrowserNotification(title, body) {
  if (!NOTIFICATION_CONFIG.BROWSER_NOTIFICATIONS_ENABLED) return;
  if (!("Notification" in window)) return;

  const show = () => {
    try {
      new Notification(title, {
        body,
        icon: "/favicon.ico"
      });
    } catch {
      // Ignore if blocked
    }
  };

  if (Notification.permission === "granted") {
    show();
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        show();
      }
    });
  }
}

/**
 * Persist alert to in-app Admin Notification History
 */
export function recordAdminNotification(notification) {
  try {
    const key = NOTIFICATION_CONFIG.STORAGE_KEY;
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    const updated = [
      {
        id: `NOTIF-${Date.now()}`,
        timestamp: new Date().toISOString(),
        read: false,
        ...notification
      },
      ...existing
    ];
    localStorage.setItem(key, JSON.stringify(updated.slice(0, 100)));
    // Dispatch custom event so UI components can update badges live
    window.dispatchEvent(new Event("admin_notifications_updated"));
  } catch (err) {
    console.error("Failed to record admin notification:", err);
  }
}

import { formatKhmerDateTime } from "../utils/khmerDate";

/**
 * ── EVENT 1: Triggered when a new user registers ──
 */
export function notifyNewUserRegistration(user) {
  const khmerNow = formatKhmerDateTime(new Date());

  // 1. Record In-App Admin Notification
  recordAdminNotification({
    type: "new_user",
    title: "អតិថិជនថ្មីបានចុះឈ្មោះ",
    message: `${user.name} (${user.email || user.phone}) បានចុះឈ្មោះបង្កើតគណនីជោគជ័យ។`,
    user
  });

  // 2. Desktop Push Notification
  sendBrowserNotification(
    "👤 អតិថិជនថ្មីបានចុះឈ្មោះ!",
    `${user.name} ទើបតែបានបង្កើតគណនីនៅលើ ភោជនីយដ្ឋាន ផ្ទះបៃតង (Baitong House)`
  );

  // 3. Telegram Message to Owner's Phone
  const telegramMessage = `
🎉 <b>អតិថិជនថ្មីបានចុះឈ្មោះ / NEW CUSTOMER REGISTRATION</b>
━━━━━━━━━━━━━━━━━━
👤 <b>ឈ្មោះ / Name:</b> ${escapeHtml(user.name)}
📧 <b>អ៊ីមែល / Email:</b> ${escapeHtml(user.email || "N/A")}
📞 <b>ទូរស័ព្ទ / Phone:</b> ${escapeHtml(user.phone || "N/A")}
📍 <b>ទីតាំង / Location:</b> ${escapeHtml(user.province || "Phnom Penh")}, Cambodia
⏰ <b>កាលបរិច្ឆេទ / Date & Time:</b> ${khmerNow}
━━━━━━━━━━━━━━━━━━
🏪 <i>ភោជនីយដ្ឋាន ផ្ទះបៃតង (Baitong House) • ម្ចាស់ហាង: CHUM BUNTHARY</i>
`.trim();

  sendTelegramAlert(telegramMessage);
}

/**
 * ── EVENT 2: Triggered when an order is confirmed & placed ──
 */
export function notifyNewOrderPlaced(invoice) {
  const itemsSummary = (invoice.items || [])
    .map((item) => `• ${item.productName} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`)
    .join("\n");

  // 1. Record In-App Admin Notification
  recordAdminNotification({
    type: "new_order",
    title: `New Food Order #${invoice.invoiceNumber || invoice.id}`,
    message: `Received $${invoice.total?.toFixed(2)} order via ${invoice.paymentMethod} from ${invoice.customerName || invoice.customer?.name || "Customer"}.`,
    invoice
  });

  // 2. Desktop Push Notification
  sendBrowserNotification(
    `🍲 New Food Order Received! ($${invoice.total?.toFixed(2)})`,
    `Invoice #${invoice.invoiceNumber || invoice.id} paid via ${invoice.paymentMethod}`
  );

  // 3. Telegram Message to Owner's Phone
  const telegramMessage = `
🍲 <b>NEW FOOD ORDER RECEIVED!</b>
━━━━━━━━━━━━━━━━━━
🧾 <b>Invoice:</b> ${escapeHtml(invoice.invoiceNumber || invoice.id)}
💰 <b>Total Amount:</b> <b>$${invoice.total?.toFixed(2)}</b>
💳 <b>Payment:</b> ${escapeHtml(invoice.paymentMethod)}

👤 <b>Customer Details:</b>
• <b>Name:</b> ${escapeHtml(invoice.customerName || invoice.customer?.name || "Customer")}
• <b>Phone:</b> ${escapeHtml(invoice.customerPhone || invoice.customer?.phone || "N/A")}
• <b>Delivery:</b> ${escapeHtml(invoice.customerAddress || invoice.customer?.address || "")}, ${escapeHtml(invoice.customerProvince || invoice.customer?.province || "Phnom Penh")}

🍱 <b>Dishes Ordered:</b>
${escapeHtml(itemsSummary || "N/A")}

⏰ <b>Date & Time:</b> ${invoice.date || formatKhmerDateTime(new Date())}
━━━━━━━━━━━━━━━━━━
🏪 <i>ភោជនីយដ្ឋាន ផ្ទះបៃតង (Baitong House) • ម្ចាស់ហាង: CHUM BUNTHARY</i>
`.trim();

  sendTelegramAlert(telegramMessage);
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
