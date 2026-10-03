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
 * Get current active Telegram configuration (always empty by default)
 */
export function getTelegramConfig() {
  return {
    enabled: false,
    token: "",
    chatId: ""
  };
}

/**
 * Save Telegram configuration to localStorage (session only, or cleared)
 */
export function saveTelegramConfig(config) {
  try {
    if (!config || !config.token) {
      localStorage.removeItem(NOTIFICATION_CONFIG.TELEGRAM_STORAGE_KEY);
    } else {
      localStorage.setItem(
        NOTIFICATION_CONFIG.TELEGRAM_STORAGE_KEY,
        JSON.stringify({
          enabled: Boolean(config.enabled),
          token: (config.token || "").trim(),
          chatId: (config.chatId || "").trim()
        })
      );
    }
    window.dispatchEvent(new Event("telegram_config_updated"));
  } catch (err) {
    console.error("Failed to save telegram config:", err);
  }
}

/**
 * Clear/Remove Telegram configuration from localStorage
 */
export function clearTelegramConfig() {
  try {
    localStorage.removeItem(NOTIFICATION_CONFIG.TELEGRAM_STORAGE_KEY);
    window.dispatchEvent(new Event("telegram_config_updated"));
  } catch (err) {
    console.error("Failed to clear telegram config:", err);
  }
}

// Always ensure Telegram credentials are wiped clean on load
try {
  localStorage.removeItem(NOTIFICATION_CONFIG.TELEGRAM_STORAGE_KEY);
} catch {
  // Ignore
}
