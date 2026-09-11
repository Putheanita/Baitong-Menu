import { useState } from "react";
import "./ProductModal.css";

function ProductModal({ product, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    if (onAddToCart) {
      onAddToCart(product, quantity);
    }
    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
      onClose();
    }, 700);
  };

  return (
    <div className="product-modal-overlay" onClick={onClose}>
      <div className="product-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          &times;
        </button>

        <div className="modal-grid">
          {/* Left: Product Image */}
          <div className="modal-image-wrap">
            <span className="modal-category-tag">{product.category}</span>
            <img src={product.image} alt={product.productName} className="modal-product-image" />
          </div>

          {/* Right: Details & Action */}
          <div className="modal-details-wrap">
            <span className="modal-brand-label">SkinCare Co. • Clean Formula</span>
            <h2 className="modal-title">{product.productName}</h2>
            <p className="modal-type-volume">{product.productType} • {product.volume}</p>

            <div className="modal-price-tag">${product.price.toFixed(2)}</div>

            <div className="modal-description">
              <p>
                Crafted with responsibly sourced extracts, this gentle formula deeply hydrates, balances sebum production, and calms irritated skin while reinforcing your natural barrier.
              </p>
            </div>

            <div className="modal-highlights">
              <div className="highlight-item">
                <span className="highlight-icon">🌿</span>
                <span>Centella Asiatica extract for barrier healing</span>
              </div>
              <div className="highlight-item">
                <span className="highlight-icon">💧</span>
                <span>Non-comedogenic & dermatologist tested</span>
              </div>
              <div className="highlight-item">
                <span className="highlight-icon">✨</span>
                <span>Cruelty-free, paraben-free & clean beauty</span>
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="modal-action-bar">
              <div className="modal-qty-selector">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease"
                >
                  –
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase"
                >
                  +
                </button>
              </div>

              <button
                className={`modal-add-btn ${addedNotice ? "btn-added" : ""}`}
                onClick={handleAdd}
              >
                {addedNotice ? "✓ Added to Bag!" : `Add to Bag • $${(product.price * quantity).toFixed(2)}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
