// Authentication configuration and security helpers

export const AUTH_CONFIG = {
  // Allowed username/email and phone number
  ALLOWED_EMAIL: "admin@gmail.com",
  ALLOWED_PHONE: "015", // Example default phone number
  
  // SHA-256 hash of the default secure password
  // Hashing prevents storing plaintext passwords in code or configuration files.
  PASSWORD_HASH: "7b991d90fb591049ab7897aceae2aac10eeefab475b9fd73272c78dd7c7d4bb3"
};

/**
 * Encrypts/hashes a password using the browser's native Web Crypto API (SHA-256).
 * This ensures passwords are never processed or compared in plaintext.
 * 
 * @param {string} password - The plaintext password to hash
 * @returns {Promise<string>} The hex-encoded SHA-256 hash
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
