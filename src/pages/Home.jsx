import { useState } from "react";
import products from "../data/Products.json";
import "./Home.css";

function Home({ onLogout, onViewAbout }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeMenu, setActiveMenu] = useState("Shop");

  // Get unique categories from products list
  const categories = ["All", ...new Set(products.map((p) => p.category))];

  // Filter products based on selected category
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    if (menu === "Shop") {
      setSelectedCategory("All");
    } else if (menu === "About" && typeof onViewAbout === "function") {
      onViewAbout();
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
              <div key={product.productCode} className="product-card">
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
                    <span className="product-price">${product.price}</span>
                    <span className="product-volume">{product.volume}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#6b6375" }}>
              No products found in this category.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Home;