/**
 * Pure Presentation Component: Category Filter Chips
 */
export default function CategoryFilterView({
  categories,
  selectedCategory,
  onSelectCategory,
  categoryIcons
}) {
  return (
    <section className="category-section">
      <h2 className="category-title">Categories</h2>
      <div className="category-list">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-chip ${
              selectedCategory === category ? "active" : ""
            }`}
            onClick={() => onSelectCategory(category)}
          >
            {categoryIcons[category] && !category.includes("🏷️") && (
              <span className="category-chip-icon">{categoryIcons[category]} </span>
            )}
            {category}
          </button>
        ))}
      </div>
    </section>
  );
}
