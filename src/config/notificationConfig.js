/**
 * Notification Configuration
 * 
 * Configure how you receive real-time alerts for:
 * 1. New User Registrations (Signups)
 * 2. New Customer Orders (Checkout)
 */

export const NOTIFICATION_CONFIG = {
  // Store Owner Contact
  OWNER_NAME: "Ms Putheanita Prom",
  OWNER_EMAIL: "putheanitaprom@gmail.com",
  OWNER_PHONE: "015 241471",

  // ── TELEGRAM BOT (Recommended: Free, Instant phone alert in Cambodia) ──
  // Default values (can be overridden by UI sidebar in localStorage)
  TELEGRAM_ENABLED: false,
  TELEGRAM_BOT_TOKEN: "",
  TELEGRAM_CHAT_ID: "",

  // ── BROWSER DESKTOP NOTIFICATIONS ──
  BROWSER_NOTIFICATIONS_ENABLED: true,

  // ── IN-APP ADMIN ACTIVITY LOG ──
  STORAGE_KEY: "skincare_admin_notifications",
  TELEGRAM_STORAGE_KEY: "skincare_telegram_config"
};

/**
 * Get current active Telegram configuration (from localStorage or defaults)
 */
export function getTelegramConfig() {
  try {
    const saved = localStorage.getItem(NOTIFICATION_CONFIG.TELEGRAM_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        enabled: Boolean(parsed.enabled),
        token: parsed.token || NOTIFICATION_CONFIG.TELEGRAM_BOT_TOKEN || "",
        chatId: parsed.chatId || NOTIFICATION_CONFIG.TELEGRAM_CHAT_ID || ""
      };
    }
  } catch {
    // fallback to config defaults
  }

  return {
    enabled: NOTIFICATION_CONFIG.TELEGRAM_ENABLED,
    token: NOTIFICATION_CONFIG.TELEGRAM_BOT_TOKEN,
    chatId: NOTIFICATION_CONFIG.TELEGRAM_CHAT_ID
  };
}

/**
 * Save Telegram configuration to localStorage
 */
export function saveTelegramConfig(config) {
  try {
    localStorage.setItem(
      NOTIFICATION_CONFIG.TELEGRAM_STORAGE_KEY,
      JSON.stringify({
        enabled: Boolean(config.enabled),
        token: (config.token || "").trim(),
        chatId: (config.chatId || "").trim()
      })
    );
    window.dispatchEvent(new Event("telegram_config_updated"));
  } catch (err) {
    console.error("Failed to save telegram config:", err);
  }
}
