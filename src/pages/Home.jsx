import { useState } from "react";
import products from "../data/Products.json";
import ProductModal from "../components/ProductModal";
import "./Home.css";

function Home({
  onLogout,
  onViewAbout,
  onViewContact,
  onOpenCart,
  cartItemCount = 0,
  onAddToCart
}) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeMenu, setActiveMenu] = useState("Shop");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedProductModal, setSelectedProductModal] = useState(null);

  // Get unique categories from products list
  const categories = ["All", ...new Set(products.map((p) => p.category))];

  // Filter products based on selected category AND search term
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const term = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !term ||
      product.productName.toLowerCase().includes(term) ||
      product.productType.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term);
    return matchesCategory && matchesSearch;
  });

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    if (menu === "Shop") {
      setSelectedCategory("All");
      setSearchTerm("");
    } else if (menu === "About" && typeof onViewAbout === "function") {
      onViewAbout();
    } else if (menu === "Contact" && typeof onViewContact === "function") {
      onViewContact();
    }
  };

  return (
    <div className="home-page">
      {/* Header with Logo and Menu Navigation */}
      <header className="main-header">
        <div className="header-left">
          <a href="/" className="logo">
            <span className="logo-icon">🌿</span> SkinCare Co.
          </a>
          <nav className="main-nav">
            <span
              className={`nav-link ${activeMenu === "Shop" ? "active" : ""}`}
              onClick={() => handleMenuClick("Shop")}
            >
              Shop
            </span>
            <span
              className={`nav-link ${activeMenu === "About" ? "active" : ""}`}
              onClick={() => handleMenuClick("About")}
            >
              About
            </span>
            <span
              className={`nav-link ${activeMenu === "Contact" ? "active" : ""}`}
              onClick={() => handleMenuClick("Contact")}
            >
              Contact
            </span>
          </nav>
        </div>

        <div className="header-right">
          {/* Search Button & Input Bar */}
          <div className={`search-container ${isSearchOpen ? "search-open" : ""}`}>
            {isSearchOpen && (
              <input
                type="text"
                className="search-input"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            )}
            <button
              className="search-btn"
              onClick={() => {
                if (isSearchOpen && searchTerm) {
                  setSearchTerm("");
                } else {
                  setIsSearchOpen(!isSearchOpen);
                }
              }}
              title={isSearchOpen ? "Close search" : "Search products"}
              aria-label="Search"
            >
              {isSearchOpen && !searchTerm ? (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <span className="search-btn-label">Search</span>
                </>
              )}
            </button>
          </div>

          {/* Cart Bag Button */}
          <button
            className="cart-nav-btn"
            onClick={onOpenCart}
            title="View Shopping Bag"
            aria-label="Shopping Bag"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span className="cart-nav-label">Bag</span>
            {cartItemCount > 0 && (
              <span className="cart-nav-badge">{cartItemCount}</span>
            )}
          </button>

          <span className="item-count-badge">
            {filteredProducts.length} {filteredProducts.length === 1 ? "Product" : "Products"}
          </span>
          {onLogout && (
            <button onClick={onLogout} className="logout-btn">
              Logout
            </button>
          )}
        </div>
      </header>

      {/* Main Page Layout */}
      <main style={{ flexGrow: 1 }}>
        {/* Category Filters Section */}
        <section className="category-section">
          <h2 className="category-title">Categories</h2>
          <div className="category-list">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-chip ${
                  selectedCategory === category ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Products Grid Section */}
        <section className="products-container">
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <div
                key={product.productCode}
                className="product-card"
                onClick={() => setSelectedProductModal(product)}
                title="Click to view details"
              >
                <div className="product-image-container">
                  <span className="product-category-tag">
                    {product.category}
                  </span>
                  <img
                    src={product.image}
                    alt={product.productName}
                    className="product-image"
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

          {filteredProducts.length === 0 && (
            <div style={{ textAlign: "center", padding: "50px 20px", color: "#6b6375" }}>
              <p style={{ fontSize: "1.05rem", marginBottom: "12px" }}>
                No products found {searchTerm ? `matching "${searchTerm}"` : "in this category"}.
              </p>
              {searchTerm && (
                <button
                  className="category-chip"
                  onClick={() => setSearchTerm("")}
                  style={{ cursor: "pointer" }}
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </section>
      </main>

      {/* Product Detail Modal */}
      {selectedProductModal && (
        <ProductModal
          product={selectedProductModal}
          onClose={() => setSelectedProductModal(null)}
          onAddToCart={onAddToCart}
        />
      )}
    </div>
  );
}

export default Home;