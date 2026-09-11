export const AUTH_CONFIG = {
  ALLOWED_EMAIL: "putheanitaprom@gmail.com",
  ALLOWED_PHONE: "015",

  PASSWORD: "nita123"
};

/**
 * Encrypts/hashes a password using the browser's native Web Crypto API (SHA-256).
 * This ensures passwords are never processed or compared in plaintext.
 * 
 * @param {string} password - The plaintext password to hash
 * @returns {Promise<string>}
 */
export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  // Convert buffer to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hashHex;
}

// nita123