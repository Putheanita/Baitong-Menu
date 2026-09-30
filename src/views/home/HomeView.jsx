import HeaderNavView from "./HeaderNavView";
import CategoryFilterView from "./CategoryFilterView";
import ProductGridView from "./ProductGridView";
import WeatherTimeBar from "../../components/WeatherTimeBar";
import PchumBenBanner from "../../components/PchumBenBanner";
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
  showBanner,
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
  dismissBanner,

  // App Level Props
  onLogout,
  onViewAbout,
  onViewContact,
  onOpenCart,
  cartItemCount,
  onAddToCart,
  currentUser
}) {
  return (
    <div className="home-page">
      {/* Real-time Weather & Timezone Banner */}
      <WeatherTimeBar />

      {/* Pchum Ben Promotion Banner */}
      {showBanner && <PchumBenBanner onClose={dismissBanner} />}

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
        onLogout={onLogout}
      />

      {/* Main Content Area */}
      <main style={{ flexGrow: 1 }}>
        {/* Category Filters */}
        <CategoryFilterView
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categoryIcons={categoryIcons}
        />

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
    </div>
  );
}
