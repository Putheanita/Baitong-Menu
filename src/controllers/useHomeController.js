import { useState, useMemo } from "react";
import products from "../data/Products.json";

export const CATEGORY_ICONS = {
  "ទាំងអស់": "✨",
  "សម្ល & ការី": "🍲",
  "ឆា & អាំង": "🥩",
  "គុយទាវ & នំ": "🍜",
  "ញាំ & ណែម": "🥗",
  "បង្អែមខ្មែរ": "🍮",
  "ភេសជ្ជៈ": "🥤"
};

/**
 * Controller Hook for the Home Storefront
 * Handles category filtering, product search, menu navigation routing,
 * banner dismissal, and product modal selection.
 */
export function useHomeController({ onViewAbout, onViewContact }) {
  const [selectedCategory, setSelectedCategory] = useState("ទាំងអស់");
  const [activeMenu, setActiveMenu] = useState("Shop");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedProductModal, setSelectedProductModal] = useState(null);
  const [showBanner, setShowBanner] = useState(true);

  // Extract unique categories from product catalog
  const categories = useMemo(() => {
    return ["ទាំងអស់", "🏷️ មុខម្ហូបពិសេស", ...new Set(products.map((p) => p.category))];
  }, []);

  // Filter products by selected category and active search query
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const isNewArrivals = selectedCategory === "🏷️ មុខម្ហូបពិសេស";
      let matchesCategory;

      if (selectedCategory === "ទាំងអស់") {
        matchesCategory = true;
      } else if (isNewArrivals) {
        matchesCategory = product.isNew === true;
      } else {
        matchesCategory = product.category === selectedCategory;
      }

      const term = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !term ||
        product.productName.toLowerCase().includes(term) ||
        product.productType.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term) ||
        (product.ingredients && product.ingredients.some(ing => ing.toLowerCase().includes(term)));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

  // Handle navigation menu clicks
  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    if (menu === "Shop") {
      setSelectedCategory("ទាំងអស់");
      setSearchTerm("");
    } else if (menu === "About" && typeof onViewAbout === "function") {
      onViewAbout();
    } else if (menu === "Contact" && typeof onViewContact === "function") {
      onViewContact();
    }
  };

  const handleToggleSearch = () => {
    if (isSearchOpen && searchTerm) {
      setSearchTerm("");
    } else {
      setIsSearchOpen((prev) => !prev);
    }
  };

  const clearSearch = () => setSearchTerm("");
  const openProductModal = (product) => setSelectedProductModal(product);
  const closeProductModal = () => setSelectedProductModal(null);
  const dismissBanner = () => setShowBanner(false);

  return {
    // State
    selectedCategory,
    activeMenu,
    searchTerm,
    isSearchOpen,
    selectedProductModal,
    showBanner,
    categories,
    filteredProducts,
    categoryIcons: CATEGORY_ICONS,

    // Actions
    setSelectedCategory,
    setSearchTerm,
    handleMenuClick,
    handleToggleSearch,
    clearSearch,
    openProductModal,
    closeProductModal,
    dismissBanner
  };
}
