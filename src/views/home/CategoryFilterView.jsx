/**
 * Pure Presentation Component: Category Filter Chips (Khmer Language & Pchum Ben Font)
 */
export default function CategoryFilterView({
  categories,
  selectedCategory,
  onSelectCategory,
  categoryIcons
}) {
  return (
    <section className="category-section">
      <div className="category-header-wrap" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <h2 className="category-title" style={{ fontFamily: "'Dangrek', 'Battambang', cursive", fontSize: "1.65rem", color: "#1b4332" }}>
          បញ្ជីមុខម្ហូបខ្មែរប្រចាំហាង ផ្ទះបៃតង
        </h2>
        <span style={{ fontSize: "1rem", color: "#40534c", fontFamily: "'Dangrek', 'Battambang', cursive" }}>
          សម្លខ្មែរឈ្ងុយឆ្ងាញ់ ឆាក្តៅៗ នំបញ្ចុក គុយទាវ ញាំស្រស់ និងបង្អែមខ្មែរពិតៗ ចម្អិនស្រស់ៗថ្មីៗរាល់ថ្ងៃ
        </span>
      </div>
      <div className="category-list">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-chip ${
              selectedCategory === category ? "active" : ""
            }`}
            onClick={() => onSelectCategory(category)}
            style={{ fontFamily: "'Dangrek', 'Battambang', cursive", fontSize: "0.95rem" }}
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
