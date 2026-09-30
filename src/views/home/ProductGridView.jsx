/**
 * Pure Presentation Component: Products Grid & Empty State
 */
export default function ProductGridView({
  products,
  onProductClick,
  onAddToCart,
  searchTerm,
  onClearSearch
}) {
  return (
    <section className="products-container">
      <div className="products-grid">
        {products.map((product) => (
          <div
            key={product.productCode}
            className="product-card"
            onClick={() => onProductClick(product)}
            title="Click to view details"
          >
            <div className="product-image-container">
              <span className="product-category-tag">
                {product.category}
              </span>
              {product.isNew && (
                <span className="product-new-tag">NEW</span>
              )}
              <img
                src={product.image}
                alt={product.productName}
                className="product-image"
                loading="eager"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentElement.style.backgroundColor = "#f4f3f0";
                  if (!e.target.parentElement.querySelector(".img-fallback")) {
                    const fb = document.createElement("span");
                    fb.className = "img-fallback";
                    fb.textContent = "🧴";
                    e.target.parentElement.appendChild(fb);
                  }
                }}
              />
            </div>

            <div className="product-info">
              <h3 className="product-name" title={product.productName}>
                {product.productName}
              </h3>
              <p className="product-type">{product.productType}</p>

              <div className="product-meta">
                <span className="product-price">${product.price.toFixed(2)}</span>
                <span className="product-volume">{product.volume}</span>
              </div>

              <button
                className="card-add-cart-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onAddToCart) onAddToCart(product, 1);
                }}
              >
                Add to Bag
              </button>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div style={{ textAlign: "center", padding: "50px 20px", color: "#6b6375" }}>
          <p style={{ fontSize: "1.05rem", marginBottom: "12px" }}>
            No products found {searchTerm ? `matching "${searchTerm}"` : "in this category"}.
          </p>
          {searchTerm && (
            <button
              className="category-chip"
              onClick={onClearSearch}
              style={{ cursor: "pointer" }}
            >
              Clear Search
            </button>
          )}
        </div>
      )}
    </section>
  );
}
