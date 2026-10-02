/**
 * Customer Accounts & Directory Service
 * Manages all registered store customer records in localStorage.
 * Seeds initial customer profiles so the store owner can see who has accounts.
 */

export const DEFAULT_CUSTOMERS = [
  {
    id: "USR-001",
    name: "Puthea Nita Prom",
    email: "admin@gmail.com",
    phone: "015 241471",
    role: "Store Owner (Admin)",
    province: "Phnom Penh",
    address: "St. 2004, Sen Sok, Phnom Penh",
    avatar: "",
    createdAt: "2026-09-15T08:00:00.000Z",
    password: "password123"
  },
  {
    id: "USR-002",
    name: "Sreymom Seng",
    email: "sreymom.kh@gmail.com",
    phone: "012 889 977",
    role: "Loyal Customer",
    province: "Siem Reap",
    address: "Wat Bo Village, Siem Reap",
    avatar: "",
    createdAt: "2026-09-22T10:30:00.000Z",
    password: "password123"
  },
  {
    id: "USR-003",
    name: "Dara Sok",
    email: "dara.beauty@gmail.com",
    phone: "098 776 554",
    role: "Verified Customer",
    province: "Phnom Penh",
    address: "Toul Kork, Phnom Penh",
    avatar: "",
    createdAt: "2026-09-28T14:15:00.000Z",
    password: "password123"
  },
  {
    id: "USR-004",
    name: "Bopha Chea",
    email: "bopha.skin@gmail.com",
    phone: "077 443 322",
    role: "Verified Customer",
    province: "Battambang",
    address: "Street 3, Svay Por, Battambang",
    avatar: "",
    createdAt: "2026-09-30T16:40:00.000Z",
    password: "password123"
  }
];

const STORAGE_KEY = "skincare_registered_users";

/**
 * Get all registered customers from localStorage, seeding default profiles if empty
 */
export function getRegisteredCustomers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CUSTOMERS));
      return DEFAULT_CUSTOMERS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CUSTOMERS));
      return DEFAULT_CUSTOMERS;
    }
    return parsed;
  } catch (e) {
    console.error("Failed to parse registered customers from storage", e);
    return DEFAULT_CUSTOMERS;
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
