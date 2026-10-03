/**
 * Customer Accounts & Directory Service
 * Manages all registered store customer records in localStorage.
 * Seeds initial customer profiles so the store owner can see who has accounts.
 */

export const DEFAULT_CUSTOMERS = [];

const STORAGE_KEY = "skincare_registered_users";
const LEGACY_DEMO_IDS = ["USR-001", "USR-002", "USR-003", "USR-004"];
const DEMO_NAMES = [
  "Sophea Chea",
  "Dara Rathana",
  "Vannak Meas",
  "Kalyan Lim",
  "Channary Keo",
  "Pisey Heng",
  "Sreymom Seng",
  "Dara Sok",
  "Bopha Chea"
];

/**
 * Get all registered customers from localStorage (strictly real registered users)
 */
export function getRegisteredCustomers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Filter out legacy demo accounts and test simulator accounts
    const realCustomers = parsed.filter(
      (c) => !LEGACY_DEMO_IDS.includes(c.id) && !DEMO_NAMES.includes(c.name)
    );
    if (realCustomers.length !== parsed.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(realCustomers));
    }
    return realCustomers;
  } catch (e) {
    console.error("Failed to parse registered customers from storage", e);
    return [];
  }
}

/**
 * Persist the customer list to localStorage and broadcast an update event
 */
export function saveRegisteredCustomers(customers) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
    window.dispatchEvent(new Event("registered_customers_updated"));
    window.dispatchEvent(new Event("admin_notifications_updated"));
  } catch (e) {
    console.error("Failed to save registered customers to storage", e);
  }
}

/**
 * Add a newly registered user to the customer list
 */
export function addCustomerRecord(newUser) {
  const customers = getRegisteredCustomers();
  const exists = customers.some(
    (c) =>
      (newUser.email && c.email?.toLowerCase() === newUser.email.toLowerCase()) ||
      (newUser.phone && c.phone === newUser.phone)
  );

  if (!exists) {
    const updated = [newUser, ...customers];
    saveRegisteredCustomers(updated);
    return true;
  }
  return false;
}

/**
 * Delete a customer record by ID
 */
export function deleteCustomerRecord(customerId) {
  const customers = getRegisteredCustomers();
  const updated = customers.filter((c) => c.id !== customerId);
  saveRegisteredCustomers(updated);
  return updated;
}
