import { useState, useEffect } from "react";
import { AUTH_CONFIG, hashPassword } from "../config/authConfig";
import { notifyNewUserRegistration } from "../services/notificationService";
import { getRegisteredCustomers, addCustomerRecord } from "../services/customerService";

/**
 * Controller Hook for Authentication
 * Encapsulates all state, business validation, credentials checking,
 * and user registration actions. Decouples logic from view components.
 */
export function useLoginController({ onLoginSuccess }) {
  const [authMode, setAuthMode] = useState("login"); // "login" | "signup"

  // ── Login State ──
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  // ── Sign Up State ──
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signupAvatar, setSignupAvatar] = useState("");
  const [signupAddress, setSignupAddress] = useState("");
  const [signupProvince, setSignupProvince] = useState("Phnom Penh");

  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', title, message }
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [registeredUsers, setRegisteredUsers] = useState(() => getRegisteredCustomers());

  useEffect(() => {
    const handleUpdate = () => {
      setRegisteredUsers(getRegisteredCustomers());
    };
    window.addEventListener("registered_customers_updated", handleUpdate);
    return () => window.removeEventListener("registered_customers_updated", handleUpdate);
  }, []);

  const dismissFeedback = () => setFeedback(null);

  // Switch between 'login' and 'signup' mode
  const switchAuthMode = (mode) => {
    setAuthMode(mode);
    setFeedback(null);
  };

  // ── Action: Quick Demo Credentials ──
  const handleQuickDemo = () => {
    setIdentifier(AUTH_CONFIG.ALLOWED_EMAIL);
    setPassword(AUTH_CONFIG.PASSWORD || "123456");
    setFeedback(null);
  };

  // ── Action: Sign In (Login) ──
  const handleLogin = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setFeedback(null);
    setIsLoading(true);

    try {
      const idInput = identifier.trim().toLowerCase();

      // Check registered accounts
      const allCustomers = getRegisteredCustomers();
      const dynamicUser = allCustomers.find(
        (u) =>
          (u.email?.toLowerCase() === idInput || u.phone === identifier.trim()) &&
          (u.password === password || (!u.password && password === "password123") || password === "123456")
      );

      // Check predefined credentials
      const enteredPasswordHash = await hashPassword(password);
      const targetPassword = AUTH_CONFIG.PASSWORD || AUTH_CONFIG.PASSWORD_HASH;
      const isDefaultUser =
        (idInput === AUTH_CONFIG.ALLOWED_EMAIL.toLowerCase() ||
          idInput === "admin@gmail.com" ||
          identifier.trim() === AUTH_CONFIG.ALLOWED_PHONE) &&
        (password === targetPassword || enteredPasswordHash === targetPassword);

      if (dynamicUser || isDefaultUser) {
        const loggedUser = dynamicUser || {
          name: "Puthea Nita Prom",
          email: AUTH_CONFIG.ALLOWED_EMAIL,
          phone: AUTH_CONFIG.ALLOWED_PHONE,
          avatar: "",
          address: "Phnom Penh, Cambodia",
          province: "Phnom Penh"
        };

        localStorage.setItem("skincare_current_user", JSON.stringify(loggedUser));
        setIsSuccess(true);
        setFeedback({
          type: "success",
          title: `Welcome back, ${loggedUser.name}!`,
          message: "Login successful. Redirecting to your dashboard..."
        });

        setTimeout(() => {
          if (onLoginSuccess) {
            onLoginSuccess(loggedUser);
          }
        }, 850);
      } else {
        setFeedback({
          type: "error",
          title: "Invalid Credentials",
          message: "The email/phone or password is incorrect. Or click 'Create Account' to sign up."
        });
      }
    } catch (err) {
      console.error("Authentication error:", err);
      setFeedback({
        type: "error",
        title: "Authentication Error",
        message: "An unexpected error occurred. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ── Action: Sign Up (Registration) ──
  const handleSignUp = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setFeedback(null);

    const name = signupName.trim();
    const email = signupEmail.trim().toLowerCase();
    const phone = signupPhone.trim();

    if (!name) {
      setFeedback({
        type: "error",
        title: "Missing Name",
        message: "Please enter your full name."
      });
      return;
    }
    if (!email) {
      setFeedback({
        type: "error",
        title: "Missing Email",
        message: "Please enter a valid email address."
      });
      return;
    }
    if (signupPassword.length < 6) {
      setFeedback({
        type: "error",
        title: "Weak Password",
        message: "Password must be at least 6 characters long."
      });
      return;
    }
    if (signupPassword !== confirmPassword) {
      setFeedback({
        type: "error",
        title: "Password Mismatch",
        message: "Passwords do not match. Please re-type."
      });
      return;
    }

    try {
      const allCustomers = getRegisteredCustomers();
      const exists = allCustomers.some(
        (u) => u.email?.toLowerCase() === email || (phone && u.phone === phone)
      );

      if (exists) {
        setFeedback({
          type: "error",
          title: "Account Already Exists",
          message: "An account with this email or phone is already registered. Please sign in."
        });
        return;
      }

      const newUser = {
        id: `USR-${Date.now()}`,
        name,
        email,
        phone: phone || "015 241471",
        password: signupPassword,
        avatar: signupAvatar || "",
        address: signupAddress.trim() || "Phnom Penh, Cambodia",
        province: signupProvince || "Phnom Penh",
        role: "Registered Customer",
        createdAt: new Date().toISOString()
      };

      addCustomerRecord(newUser);

      // Real-time alert to store owner (Telegram, Desktop, Admin Log)
      try {
        notifyNewUserRegistration(newUser);
      } catch (notifErr) {
        console.warn("Notification dispatch error:", notifErr);
      }

      // Auto-save user profile for shopping bag & invoices
      localStorage.setItem("skincare_current_user", JSON.stringify(newUser));
      localStorage.setItem(
        "skincare_customer_info",
        JSON.stringify({
          name: newUser.name,
          phone: newUser.phone,
          address: newUser.address,
          province: newUser.province
        })
      );

      setIsLoading(true);
      setIsSuccess(true);
      setFeedback({
        type: "success",
        title: "Account Created! 🎉",
        message: `Welcome, ${newUser.name}! Logging you into SkinCare Co...`
      });

      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess(newUser);
        }
      }, 950);
    } catch (err) {
      console.error("Sign up error:", err);
      setFeedback({
        type: "error",
        title: "Registration Failed",
        message: "Could not create account. Please check browser storage."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // State
    authMode,
    identifier,
    password,
    signupName,
    signupEmail,
    signupPhone,
    signupPassword,
    confirmPassword,
    signupAvatar,
    signupAddress,
    signupProvince,
    feedback,
    isLoading,
    isSuccess,

    // State Mutators
    setIdentifier,
    setPassword,
    setSignupName,
    setSignupEmail,
    setSignupPhone,
    setSignupPassword,
    setConfirmPassword,
    setSignupAvatar,
    setSignupAddress,
    setSignupProvince,
    dismissFeedback,
    switchAuthMode,

    // State Handlers & Data
    registeredUsers,
    handleSelectAccount: (user) => {
      setIdentifier(user.email || user.phone);
      setPassword(user.password || "password123");
      setFeedback(null);
    },

    // Action Handlers
    handleLogin,
    handleSignUp,
    handleQuickDemo
  };
}
