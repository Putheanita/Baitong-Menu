import { useState } from "react";
import { AUTH_CONFIG } from "../config/authConfig";
import { notifyNewUserRegistration } from "../services/notificationService";
import { getRegisteredCustomers, addCustomerRecord } from "../services/customerService";

/**
 * Controller Hook for Authentication
 * Encapsulates state, business validation, credentials checking,
 * and user registration actions in Khmer.
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

  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const dismissFeedback = () => setFeedback(null);

  const switchAuthMode = (mode) => {
    setAuthMode(mode);
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
          u.password === password
      );

      // Check owner credentials from authConfig
      const isOwner =
        (idInput === AUTH_CONFIG.ALLOWED_EMAIL.toLowerCase() ||
          identifier.trim() === AUTH_CONFIG.ALLOWED_PHONE ||
          identifier.trim() === "015 241471") &&
        password === AUTH_CONFIG.PASSWORD;

      if (dynamicUser || isOwner) {
        const loggedUser = dynamicUser || {
          name: "CHUM BUNTHARY (ជុំ ប៊ុនថារី)",
          email: AUTH_CONFIG.ALLOWED_EMAIL,
          phone: "015 241471",
          avatar: "",
          address: "រាជធានីភ្នំពេញ កម្ពុជា",
          province: "Phnom Penh",
          role: "ម្ចាស់ហាង ផ្ទះបៃតង"
        };

        localStorage.setItem("skincare_current_user", JSON.stringify(loggedUser));
        setIsSuccess(true);
        setFeedback({
          type: "success",
          title: `សូមស្វាគមន៍ការវិលត្រឡប់មកវិញ, ${loggedUser.name}!`,
          message: "ចូលគណនីជោគជ័យ។ កំពុងបញ្ជូនបន្ត..."
        });

        setTimeout(() => {
          if (onLoginSuccess) {
            onLoginSuccess(loggedUser);
          }
        }, 850);
      } else {
        setFeedback({
          type: "error",
          title: "ព័ត៌មានមិនត្រឹមត្រូវ",
          message: "អ៊ីមែល/លេខទូរស័ព្ទ ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវទេ។ ឬចុច 'ចុះឈ្មោះថ្មី' ដើម្បីបង្កើតគណនី។"
        });
      }
    } catch (err) {
      console.error("Authentication error:", err);
      setFeedback({
        type: "error",
        title: "មានបញ្ហាបច្ចេកទេស",
        message: "សូមសាកល្បងម្តងទៀតនៅពេលក្រោយ។"
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
        title: "ខ្វះឈ្មោះ",
        message: "សូមបញ្ចូលឈ្មោះពេញរបស់អ្នក។"
      });
      return;
    }
    if (!email) {
      setFeedback({
        type: "error",
        title: "ខ្វះអ៊ីមែល",
        message: "សូមបញ្ចូលអាសយដ្ឋានអ៊ីមែលឱ្យបានត្រឹមត្រូវ។"
      });
      return;
    }
    if (signupPassword.length < 6) {
      setFeedback({
        type: "error",
        title: "ពាក្យសម្ងាត់ខ្សោយ",
        message: "ពាក្យសម្ងាត់ត្រូវតែមានយ៉ាងតិច ៦ ខ្ទង់។"
      });
      return;
    }
    if (signupPassword !== confirmPassword) {
      setFeedback({
        type: "error",
        title: "ពាក្យសម្ងាត់មិនដូចគ្នា",
        message: "ការបញ្ជាក់ពាក្យសម្ងាត់មិនត្រឹមត្រូវទេ។ សូមពិនិត្យឡើងវិញ។"
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
          title: "គណនីមានរួចហើយ",
          message: "អ៊ីមែល ឬលេខទូរស័ព្ទនេះត្រូវបានចុះឈ្មោះរួចហើយ។ សូមចូលគណនី។"
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
        address: signupAddress.trim() || "រាជធានីភ្នំពេញ កម្ពុជា",
        province: signupProvince || "Phnom Penh",
        role: "អតិថិជនផ្លូវការ",
        createdAt: new Date().toISOString()
      };

      addCustomerRecord(newUser);

      try {
        notifyNewUserRegistration(newUser);
      } catch (notifErr) {
        console.warn("Notification dispatch error:", notifErr);
      }

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
        title: "បង្កើតគណនីជោគជ័យ! 🎉",
        message: `សូមស្វាគមន៍, ${newUser.name}! កំពុងចូលទៅកាន់ ផ្ទះបៃតង...`
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
        title: "ការចុះឈ្មោះបរាជ័យ",
        message: "មិនអាចបង្កើតគណនីបានទេ។ សូមពិនិត្យការអនុញ្ញាតអង្គចងចាំកម្មវិធីរុករក។"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
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
    handleLogin,
    handleSignUp
  };
}
