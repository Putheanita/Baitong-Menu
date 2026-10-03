import { useState } from "react";
import "./ProductModal.css";

// Authentic Khmer Food Toppings with prices
const TOPPING_OPTIONS = [
  { id: "egg", name: "ពងមាន់ / ពងទាចៀនស្រែ (Fried Egg)", price: 0.60, icon: "🍳" },
  { id: "rice", name: "បាយសផ្កាម្លិះមួយចាន (Jasmine Rice)", price: 0.50, icon: "🍚" },
  { id: "meat", name: "បន្ថែមសាច់ / គ្រឿងសមុទ្រ (Extra Meat/Seafood)", price: 1.50, icon: "🥩" },
  { id: "garlic_dip", name: "ខ្ទឹមបំពង & ទឹកត្រីម្រេចកំពត (Garlic & Dip)", price: 0.40, icon: "🧄" },
  { id: "soup", name: "ទឹកសម្ល / ខ្ទិះដូងបន្ថែម (Extra Soup Broth)", price: 0.60, icon: "🍲" },
  { id: "veggies", name: "បន្លែស្រស់ & ជីរគ្រប់មុខ (Fresh Herbs)", price: 0.50, icon: "🌿" }
];

const SPICE_LEVELS = [
  { id: "mild", label: "មិនហិរ (Mild)" },
  { id: "medium", label: "ហិរល្មម (Medium)" },
  { id: "spicy", label: "ហិរខ្លាំង (Spicy)" }
];

export default function ProductModal({ product, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [selectedSpice, setSelectedSpice] = useState("ហិរល្មម (Medium)");
  const [addedNotice, setAddedNotice] = useState(false);

  if (!product) return null;

  // Toggle topping selection
  const toggleTopping = (topping) => {
    setSelectedToppings((prev) => {
      const exists = prev.some((t) => t.id === topping.id);
      if (exists) {
        return prev.filter((t) => t.id !== topping.id);
      } else {
        return [...prev, topping];
      }
    });
  };

  // Price calculations with toppings
  const toppingTotal = selectedToppings.reduce((sum, t) => sum + t.price, 0);
  const finalUnitPrice = product.price + toppingTotal;
  const totalPrice = finalUnitPrice * quantity;

  // Concise 1-2 sentence description
  const shortDescription = product.usageDesc
    ? product.usageDesc.split("។")[0] + "។"
    : "ចម្អិនស្រស់ៗថ្មីៗតាមការកុម្ម៉ង់ ជាមួយគ្រឿងបុកប្រពៃណី និងគ្រឿងផ្សំខ្មែរពិតៗ។";

  const handleAdd = () => {
    if (onAddToCart) {
      // Build unique customized cart item
      const itemToCart = {
        ...product,
        basePrice: product.price,
        price: finalUnitPrice,
        finalUnitPrice,
        selectedToppings,
        spiciness: selectedSpice
      };
      onAddToCart(itemToCart, quantity);
    }
    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
      onClose();
    }, 600);
  };

  return (
    <div className="product-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="product-modal-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose} aria-label="បិទផ្ទាំង">
          &times;
        </button>

        <div className="modal-grid">
          
          {/* ════════════════════════════════════════════════
              LEFT: Extra Large, Crystal-Clear Food Photo
             ════════════════════════════════════════════════ */}
          <div className="modal-image-showcase">
            <span className="modal-category-tag">{product.category}</span>
            <img
              src={product.image}
              alt={product.productName}
              className="modal-food-hero-img"
              loading="eager"
            />
            {product.discount > 0 && (
              <span className="modal-discount-tag">-{product.discount}%</span>
            )}
          </div>

          {/* ════════════════════════════════════════════════
              RIGHT: Clean Details, Toppings, & Cart Button
             ════════════════════════════════════════════════ */}
          <div className="modal-details-showcase">
            
            {/* Brand Header */}
            <div className="modal-header-meta">
              <span className="modal-brand-label">
                {product.brand || "ផ្ទះបៃតង (Baitong House)"} • ស្រស់ៗថ្មីៗ
              </span>
            </div>

            {/* Food Title */}
            <h2 className="modal-food-title">{product.productName}</h2>
            <p className="modal-food-subtitle">{product.productType} • {product.volume}</p>

            {/* Price & Rating */}
            <div className="modal-price-rating-row">
              <div className="modal-price-box">
                <span className="modal-price">${product.price.toFixed(2)}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="modal-original-price">${product.originalPrice.toFixed(2)}</span>
                )}
              </div>
              {product.rating && (
                <div className="modal-rating-pill">
                  <span>★ {product.rating}</span>
                  <span className="modal-rating-count">({product.reviewCount || 100}+)</span>
                </div>
              )}
            </div>

            {/* Concise Description: Short, clean 1-sentence */}
            <div className="modal-short-desc-box">
              <p className="modal-short-desc">{shortDescription}</p>
            </div>

            {/* ── Selection of Toppings (គ្រឿងបន្ថែម) ── */}
            <div className="modal-toppings-section">
              <div className="toppings-header">
                <span className="toppings-title">🥗 ជ្រើសរើស Topping / គ្រឿងបន្ថែម:</span>
                <span className="toppings-hint">ជ្រើសរើសបានច្រើនមុខ</span>
              </div>
              <div className="toppings-grid">
                {TOPPING_OPTIONS.map((topping) => {
                  const isChecked = selectedToppings.some((t) => t.id === topping.id);
                  return (
                    <div
                      key={topping.id}
                      className={`topping-chip-btn ${isChecked ? "active" : ""}`}
                      onClick={() => toggleTopping(topping)}
                    >
                      <span className="topping-icon">{topping.icon}</span>
                      <span className="topping-name">{topping.name}</span>
                      <span className="topping-price">+${topping.price.toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Spiciness Level ── */}
            <div className="modal-spice-section">
              <span className="spice-title">🌶️ កម្រិតហិរ:</span>
              <div className="spice-btn-row">
                {SPICE_LEVELS.map((spice) => (
                  <button
                    key={spice.id}
                    type="button"
                    className={`spice-btn ${selectedSpice === spice.label ? "active" : ""}`}
                    onClick={() => setSelectedSpice(spice.label)}
                  >
                    {spice.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Add to Cart Action */}
            <div className="modal-action-footer">
              <div className="modal-qty-counter">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="បន្ថយ"
                >
                  –
                </button>
                <span>{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="បន្ថែម"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                className={`modal-order-btn ${addedNotice ? "btn-added" : ""}`}
                onClick={handleAdd}
              >
                {addedNotice ? "✓ បានបន្ថែមទៅកន្ត្រកម្ហូប!" : `+ បន្ថែមទៅកន្ត្រក • $${totalPrice.toFixed(2)}`}
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
