import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PutheanetaProfile from "./pages/abutUS/PutheanetaProfile";
import Contact from "./pages/Contact";
import CartDrawer from "./components/CartDrawer";
import CustomerProfileModal from "./components/CustomerProfileModal";
import NotificationSidebar from "./components/NotificationSidebar";
import { confirmAndLogout } from "./utils/navigation";
import "./App.css";

function App() {
  // Initialize auth state from localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  // Custom hash routing: initialize from URL hash
  const [currentPage, setCurrentPage] = useState(() => {
    const hash = window.location.hash;
    if (hash === "#/about") return "about";
    if (hash === "#/contact") return "contact";
    return "home";
  });

  // Shopping Bag Cart State (persisted to localStorage)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("skincare_current_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("skincare_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCustomerProfileOpen, setIsCustomerProfileOpen] = useState(false);
  const [isNotificationSidebarOpen, setIsNotificationSidebarOpen] = useState(false);
  const [unreadNotifCount, setUnreadNotifCount] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("skincare_admin_notifications") || "[]"
      );
      return saved.filter((n) => !n.read).length;
    } catch {
      return 0;
    }
  });

  // Keep unread notification count synchronized in real time
  useEffect(() => {
    const updateUnread = () => {
      try {
        const saved = JSON.parse(
          localStorage.getItem("skincare_admin_notifications") || "[]"
        );
        setUnreadNotifCount(saved.filter((n) => !n.read).length);
      } catch {
        setUnreadNotifCount(0);
      }
    };

    window.addEventListener("admin_notifications_updated", updateUnread);
    return () => window.removeEventListener("admin_notifications_updated", updateUnread);
  }, []);

  // Persist cart items
  useEffect(() => {
    try {
      localStorage.setItem("skincare_cart", JSON.stringify(cartItems));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cartItems]);

  // Sync state changes to browser URL hash
  useEffect(() => {
    if (currentPage === "about") {
      window.location.hash = "/about";
    } else if (currentPage === "contact") {
      window.location.hash = "/contact";
    } else {
      window.location.hash = "/";
    }
  }, [currentPage]);

  // Listen to browser navigation changes (back/forward buttons)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === "#/about") {
        setCurrentPage("about");
      } else if (hash === "#/contact") {
        setCurrentPage("contact");
      } else {
        setCurrentPage("home");
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleLoginSuccess = (user) => {
    localStorage.setItem("isLoggedIn", "true");
    if (user) {
      setCurrentUser(user);
    }
    setIsAuthenticated(true);
    setCurrentPage("home");
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("skincare_current_user");
    } catch (e) {
      console.error("Error clearing storage on logout:", e);
    }
    setCurrentUser(null);
    setIsAuthenticated(false);
    setIsCustomerProfileOpen(false);
    setIsCartOpen(false);
    setCurrentPage("home");
    window.location.hash = "/";
  };

  // Update Customer Profile Data
  const handleUpdateCurrentUser = (updatedUser) => {
    setCurrentUser(updatedUser);
    try {
      localStorage.setItem("skincare_current_user", JSON.stringify(updatedUser));

      // Update in registered users database
      const registered = JSON.parse(
        localStorage.getItem("skincare_registered_users") || "[]"
      );
      const idx = registered.findIndex(
        (u) =>
          (updatedUser.id && u.id === updatedUser.id) ||
          (updatedUser.email && u.email?.toLowerCase() === updatedUser.email?.toLowerCase())
      );
      if (idx !== -1) {
        registered[idx] = { ...registered[idx], ...updatedUser };
        localStorage.setItem("skincare_registered_users", JSON.stringify(registered));
      }

      // Update in delivery customer info
      localStorage.setItem(
        "skincare_customer_info",
        JSON.stringify({
          name: updatedUser.name,
          phone: updatedUser.phone,
          address: updatedUser.address || "Phnom Penh, Cambodia",
          province: updatedUser.province || "Phnom Penh"
        })
      );
    } catch (e) {
      console.error("Failed to update user profile", e);
    }
  };

  // Cart operations with customizable toppings & spice
  const handleAddToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const toppingKey = product.selectedToppings && product.selectedToppings.length > 0
        ? product.selectedToppings.map((t) => t.id).sort().join("-")
        : "";
      const itemKey = `${product.productCode}${toppingKey ? "_" + toppingKey : ""}${product.spiciness ? "_" + product.spiciness : ""}`;

      const existing = prev.find((item) => (item.cartItemId || item.productCode) === itemKey);
      if (existing) {
        return prev.map((item) =>
          (item.cartItemId || item.productCode) === itemKey
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, cartItemId: itemKey, quantity }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (itemIdentifier, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(itemIdentifier);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        (item.cartItemId || item.productCode) === itemIdentifier
          ? { ...item, quantity: newQty }
          : item
      )
    );
  };

  const handleRemoveItem = (itemIdentifier) => {
    setCartItems((prev) =>
      prev.filter((item) => (item.cartItemId || item.productCode) !== itemIdentifier)
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div>
      {currentPage === "about" ? (
        <PutheanetaProfile onBack={() => setCurrentPage("home")} />
      ) : currentPage === "contact" ? (
        <Contact
          onBack={() => setCurrentPage("home")}
          onNavigateShop={() => setCurrentPage("home")}
          onNavigateAbout={() => setCurrentPage("about")}
        />
      ) : (
        <Home
          onLogout={handleLogout}
          onViewAbout={() => setCurrentPage("about")}
          onViewContact={() => setCurrentPage("contact")}
          onOpenCart={() => setIsCartOpen(true)}
          cartItemCount={totalCartCount}
          onAddToCart={handleAddToCart}
          currentUser={currentUser}
          onOpenCustomerProfile={() => setIsCustomerProfileOpen(true)}
          onOpenNotifications={() => setIsNotificationSidebarOpen(true)}
          unreadNotifCount={unreadNotifCount}
        />
      )}

      {/* Slide-over Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Customer Account & Data Upload Modal */}
      <CustomerProfileModal
        isOpen={isCustomerProfileOpen}
        onClose={() => setIsCustomerProfileOpen(false)}
        currentUser={currentUser}
        onUpdateCurrentUser={handleUpdateCurrentUser}
        onLogout={handleLogout}
      />

      {/* Admin Alerts & Notifications Slide-over Sidebar Drawer */}
      <NotificationSidebar
        isOpen={isNotificationSidebarOpen}
        onClose={() => setIsNotificationSidebarOpen(false)}
      />
    </div>
  );
}

export default App;
