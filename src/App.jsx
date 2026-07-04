import Home from './pages/Home'
import Login from './pages/Login'
import PutheanetaProfile from './pages/abutUS/PutheanetaProfile'
import './App.css'


import { useState, useEffect } from 'react'

import { confirmAndLogout } from './utils/navigation'

function App() {
  // Initialize state from localStorage to persist login across page reloads
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });
  
  // Custom hash routing: initialize from URL hash
  const [currentPage, setCurrentPage] = useState(() => {
    const hash = window.location.hash;
    if (hash === "#/about") return "about";
    return "home";
  });

  // Sync state changes to browser URL hash
  useEffect(() => {
    if (!isAuthenticated) {
      window.location.hash = "/login";
    } else if (currentPage === "about") {
      window.location.hash = "/about";
    } else {
      window.location.hash = "/";
    }
  }, [isAuthenticated, currentPage]);

  // Listen to browser navigation changes (e.g. back/forward buttons)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === "#/about") {
        setCurrentPage("about");
      } else if (hash === "#/login" || !isAuthenticated) {
        // Stay on login if not authenticated
      } else {
        setCurrentPage("home");
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [isAuthenticated]);

  const handleLoginSuccess = () => {
    localStorage.setItem("isLoggedIn", "true");
    setIsAuthenticated(true);
    setCurrentPage("home");
  };

  const handleLogout = () => {
    confirmAndLogout(() => {
      localStorage.removeItem("isLoggedIn");
      setIsAuthenticated(false);
      setCurrentPage("home");
    });
  };

  return (
    <div>
      {isAuthenticated ? (
        currentPage === "about" ? (
          <PutheanetaProfile onBack={() => setCurrentPage("home")} />
        ) : (
          <Home onLogout={handleLogout} onViewAbout={() => setCurrentPage("about")} />
        )
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}
export default App
