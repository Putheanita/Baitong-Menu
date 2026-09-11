import { useState } from "react";
import "./CartDrawer.css";

function CartDrawer({
  isOpen,
  onClose,
  cartItems = [],
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 2.5;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckoutComplete(true);
      if (onClearCart) onClearCart();
    }, 1200);
  };

  const handleCloseAndReset = () => {
    setCheckoutComplete(false);
    onClose();
  };

  return (
    <div className="cart-drawer-overlay" onClick={handleCloseAndReset}>
      <div className="cart-drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-drawer-header">
          <div className="cart-header-title">
            <h3>Your Shopping Bag</h3>
            <span className="cart-count-pill">
              {cartItems.reduce((acc, i) => acc + i.quantity, 0)} items
            </span>
          </div>
          <button
            className="cart-close-btn"
            onClick={handleCloseAndReset}
            aria-label="Close cart"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="cart-drawer-body">
          {checkoutComplete ? (
            <div className="checkout-success-view">
              <div className="success-icon-wrap">✓</div>
              <h3>Order Placed Successfully! 🎉</h3>
              <p>
                Thank you for choosing SkinCare Co.! Your botanical order has been confirmed. Our team will contact you via phone (015) for delivery coordination.
              </p>
              <button
                className="cart-checkout-btn"
                onClick={handleCloseAndReset}
                style={{ marginTop: "20px" }}
              >
                Continue Shopping
              </button>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="cart-empty-view">
              <div className="empty-cart-icon">🛍️</div>
              <h4>Your bag is currently empty</h4>
              <p>Explore our clean Centella & botanical collection to find your perfect daily routine.</p>
              <button className="cart-shop-now-btn" onClick={onClose}>
                Explore Products
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.productCode} className="cart-item-row">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="cart-item-img"
                  />
                  <div className="cart-item-details">
                    <h4 className="cart-item-name">{item.productName}</h4>
                    <span className="cart-item-meta">
                      {item.volume} • ${item.price.toFixed(2)} each
                    </span>

                    <div className="cart-qty-controls">
                      <button
                        className="qty-btn"
                        onClick={() => onUpdateQuantity(item.productCode, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        –
                      </button>
                      <span className="qty-number">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => onUpdateQuantity(item.productCode, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>

                      <button
                        className="remove-item-btn"
                        onClick={() => onRemoveItem(item.productCode)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="cart-item-total">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with checkout summary */}
        {!checkoutComplete && cartItems.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-summary-line">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="cart-summary-line">
              <span>Shipping {subtotal > 50 && <em className="free-tag">(Free over $50)</em>}</span>
              <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="cart-summary-total">
              <span>Total</span>
              <span className="total-number">${total.toFixed(2)}</span>
            </div>

            <button
              className="cart-checkout-btn"
              onClick={handleCheckout}
              disabled={isCheckingOut}
            >
              {isCheckingOut ? "Processing Order..." : `Checkout • $${total.toFixed(2)}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartDrawer;
