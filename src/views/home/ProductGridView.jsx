/**
 * Pure Presentation Component: Products Grid & Empty State (Khmer Language)
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
            title="ចុចដើម្បីមើលព័ត៌មានលម្អិត"
          >
            <div className="product-image-container">
              <span className="product-category-tag">
                {product.category}
              </span>
              {product.isNew && (
                <span className="product-new-tag">ថ្មី</span>
              )}
              {product.discount > 0 && (
                <span className="product-discount-tag">-{product.discount}%</span>
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
                    fb.textContent = "🍲";
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
                <div className="product-price-box">
                  <span className="product-price">${product.price.toFixed(2)}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="product-original-price">${product.originalPrice.toFixed(2)}</span>
                  )}
                </div>
                <div className="product-sub-meta">
                  {product.rating && (
                    <span className="product-rating">★ {product.rating}</span>
                  )}
                  <span className="product-volume">{product.volume}</span>
                </div>
              </div>

              <button
                className="card-add-cart-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onAddToCart) onAddToCart(product, 1);
                }}
              >
                + បន្ថែមទៅកន្ត្រក
              </button>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div style={{ textAlign: "center", padding: "50px 20px", color: "#6b6375" }}>
          <p style={{ fontSize: "1.05rem", marginBottom: "12px", fontFamily: "'Dangrek', 'Battambang', cursive" }}>
            មិនមានមុខម្ហូប {searchTerm ? `ដែលត្រូវនឹង "${searchTerm}" ទេ` : "ក្នុងផ្នែកនេះទេ"}។
          </p>
          {searchTerm && (
            <button
              className="category-chip"
              onClick={onClearSearch}
              style={{ cursor: "pointer", fontFamily: "'Dangrek', 'Battambang', cursive" }}
            >
              សម្អាតការស្វែងរក
            </button>
          )}
        </div>
      )}
    </section>
  );
}
