/**
 * Global authentication and navigation helper functions.
 * These can be imported and reused across any component.
 */

/**
 * Confirms with the user before performing logout actions.
 * Displays a native confirmation dialog.
 * 
 * @param {function} onLogoutConfirmed - Callback to execute if the user confirms logout
 */
export function confirmAndLogout(onLogoutConfirmed) {
  const isConfirmed = window.confirm("Are you sure you want to log out of this account?");
  if (isConfirmed && typeof onLogoutConfirmed === "function") {
    onLogoutConfirmed();
  }
}

/**
 * Navigates to the previous page in the browser history.
 */
export function navigateBack() {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    // Fallback if there is no browser history
    console.warn("No history found to navigate back.");
  }
}
