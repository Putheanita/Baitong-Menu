import { useState } from "react";
import { navigateBack } from "../../utils/navigation";
import promAvatar from "../../assets/prom-putheanita.png"; // Import from assets directly
import managerAvatar from "../../assets/prom-sorrachna.png"; // Import manager avatar directly

// Skincare Founder Profile Data
export const ownerDetails = {
  name: "Ms. Putheanita Prom",
  title: "Founder & CEO",
  company: "SkinCare Co.",
  avatar: promAvatar,
  story: "With a strong belief that nature holds the answers to healthy, glowing skin, I set out to build SkinCare Co. Our mission is to strip away unnecessary chemical additives and focus on premium, clean botanical extracts that heal, soothe, and nourish your skin barrier. 'Your skin, but better' is not just a slogan; it's our promise.",
  missionPoints: [
    { title: "Clean Beauty", desc: "No harsh chemicals, artificial parabens, or toxins. Only clean, dermatologist-approved botanical recipes." },
    { title: "Sustainable Sourcing", desc: "Sourcing ingredients responsibly from their natural habitat, like our premium Madagascar Centella extracts." },
    { title: "Barrier Support", desc: "Formulated specifically to strengthen and nourish the skin's natural moisture barrier, ensuring long-term skin health." }
  ]
};

// Visual Org Chart / Tree Hierarchy Data
export const teamDetails = {
  founder: {
    name: "Ms. Putheanita Prom",
    title: "Founder & CEO",
    avatar: promAvatar,
    desc: "Formulates the vision, core recipes, and directs the clean cosmetics quality standards."
  },
  manager: {
    name: "Ms. Sorrachna Prom",
    title: "General Manager",
    avatar: managerAvatar,
    desc: "Oversees daily business operations, supply chain quality, and customer support relations."
  }
};

/**
 * Controller Hook for the Skincare Founder Profile.
 * Manages tab selection, contact form submissions, and back navigation.
 */
export function usePutheanetaProfile(onBack) {
  const [activeTab, setActiveTab] = useState("story"); // 'story', 'mission', 'contact'
  const [message, setMessage] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [lightboxImage, setLightboxImage] = useState("");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Simulate sending message to the founder
    console.log("Message sent to Ms. Putheanita Prom:", message);
    setIsSent(true);
    setMessage("");

    // Clear success notification after 3 seconds
    setTimeout(() => {
      setIsSent(false);
    }, 3000);
  };

  const goBack = () => {
    if (typeof onBack === "function") {
      onBack();
    } else {
      navigateBack();
    }
  };

  return {
    activeTab,
    message,
    isSent,
    setMessage,
    handleTabChange,
    handleMessageSubmit,
    goBack,
    facebookUrl: "https://www.facebook.com/share/1ExFCeLE93/?mibextid=wwXIfr",
    ownerDetails,
    lightboxImage,
    setLightboxImage,
    teamDetails
  };
}
