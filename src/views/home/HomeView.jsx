import { useState } from "react";
import HeaderNavView from "./HeaderNavView";
import WelcomeHeroView from "./WelcomeHeroView";
import WelcomeModal from "../../components/WelcomeModal";
import CategoryFilterView from "./CategoryFilterView";
import ProductGridView from "./ProductGridView";
import WeatherTimeBar from "../../components/WeatherTimeBar";
import Footer from "../../components/Footer";
import ProductModal from "../../components/ProductModal";

/**
 * Pure Presentation Component: Storefront Home View
 * Coordinates sub-views and components with zero state manipulation logic.
 */
export default function HomeView({
  // Controller State & Methods
  selectedCategory,
  activeMenu,
  searchTerm,
  isSearchOpen,
  selectedProductModal,
  categories,
  filteredProducts,
  categoryIcons,
  setSelectedCategory,
  setSearchTerm,
  handleMenuClick,
  handleToggleSearch,
  clearSearch,
  openProductModal,
  closeProductModal,

  // App Level Props
  onLogout,
  onViewAbout,
  onViewContact,
  onOpenCart,
  cartItemCount,
  onAddToCart,
  currentUser,
  onOpenCustomerProfile,
  onOpenNotifications,
  unreadNotifCount
}) {
  // Automatically show the Welcome Popup Modal on load (with left branding and right photo slideshow)
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(true);

  return (
    <div className="home-page">
      {/* Real-time Weather & Timezone Banner */}
      <WeatherTimeBar />

      {/* Header and Navigation Bar */}
      <HeaderNavView
        activeMenu={activeMenu}
        onMenuClick={handleMenuClick}
        isSearchOpen={isSearchOpen}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onToggleSearch={handleToggleSearch}
        onOpenCart={onOpenCart}
        cartItemCount={cartItemCount}
        productCount={filteredProducts.length}
        currentUser={currentUser}
        onOpenCustomerProfile={onOpenCustomerProfile}
        onLogout={onLogout}
        onOpenNotifications={onOpenNotifications}
        unreadNotifCount={unreadNotifCount}
      />

      {/* Main Content Area */}
      <main style={{ flexGrow: 1 }}>
        {/* Authentic Khmer Cuisine Welcome Banner matching Owner CHUM BUNTHARY & Manager Putheanita Prom */}
        <WelcomeHeroView
          onExploreMenu={() => {
            const menuElement = document.getElementById("khmer-menu-section");
            if (menuElement) {
              menuElement.scrollIntoView({ behavior: "smooth" });
            }
          }}
          onNavigateContact={onViewContact}
          onNavigateAbout={onViewAbout}
          onOpenSlideshow={() => setIsWelcomeModalOpen(true)}
        />

        {/* Category Filters */}
        <div id="khmer-menu-section">
          <CategoryFilterView
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            categoryIcons={categoryIcons}
          />
        </div>

        {/* Product Cards Grid */}
        <ProductGridView
          products={filteredProducts}
          onProductClick={openProductModal}
          onAddToCart={onAddToCart}
          searchTerm={searchTerm}
          onClearSearch={clearSearch}
        />
      </main>

      {/* Formal Store Footer */}
      <Footer
        onNavigateShop={() => handleMenuClick("Shop")}
        onNavigateAbout={onViewAbout}
        onNavigateContact={onViewContact}
        onOpenCart={onOpenCart}
      />

      {/* Product Detail Modal */}
      {selectedProductModal && (
        <ProductModal
          product={selectedProductModal}
          onClose={closeProductModal}
          onAddToCart={onAddToCart}
        />
      )}

      {/* First-load Welcome Popup Modal with Screenshot branding on Left & Photo Slideshow on Right */}
      <WelcomeModal
        isOpen={isWelcomeModalOpen}
        onClose={() => setIsWelcomeModalOpen(false)}
        onExploreMenu={() => {
          setIsWelcomeModalOpen(false);
          setTimeout(() => {
            const menuElement = document.getElementById("khmer-menu-section");
            if (menuElement) {
              menuElement.scrollIntoView({ behavior: "smooth" });
            }
          }, 200);
        }}
      />
    </div>
  );
}
