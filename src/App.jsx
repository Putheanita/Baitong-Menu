import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PutheanetaProfile from "./pages/abutUS/PutheanetaProfile";
import Contact from "./pages/Contact";
import CartDrawer from "./components/CartDrawer";
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
    if (!isAuthenticated) {
      window.location.hash = "/login";
    } else if (currentPage === "about") {
      window.location.hash = "/about";
    } else if (currentPage === "contact") {
      window.location.hash = "/contact";
    } else {
      window.location.hash = "/";
    }
  }, [isAuthenticated, currentPage]);

  // Listen to browser navigation changes (back/forward buttons)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === "#/about") {
        setCurrentPage("about");
      } else if (hash === "#/contact") {
        setCurrentPage("contact");
      } else if (hash === "#/login" || !isAuthenticated) {
        // Stay on login if not authenticated
      } else {
        setCurrentPage("home");
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [isAuthenticated]);

  const handleLoginSuccess = (user) => {
    localStorage.setItem("isLoggedIn", "true");
    if (user) {
      setCurrentUser(user);
    }
    setIsAuthenticated(true);
    setCurrentPage("home");
  };

  const handleLogout = () => {
    confirmAndLogout(() => {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("skincare_current_user");
      setCurrentUser(null);
      setIsAuthenticated(false);
      setCurrentPage("home");
    });
  };

  // Cart operations
  const handleAddToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.productCode === product.productCode);
      if (existing) {
        return prev.map((item) =>
          item.productCode === product.productCode
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productCode, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(productCode);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.productCode === productCode ? { ...item, quantity: newQty } : item
      )
    );
  };

  const handleRemoveItem = (productCode) => {
    setCartItems((prev) => prev.filter((item) => item.productCode !== productCode));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div>
      {isAuthenticated ? (
        <>
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
        </>
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;
