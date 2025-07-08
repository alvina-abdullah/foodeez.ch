"use client";

interface MenuFilterSortBarProps {
  categories: { MENU_CATEGORY_ID: number; TITLE: string }[];
}

export default function MenuFilterSortBar({ categories }: MenuFilterSortBarProps) {
  return (
    <section className="mb-8 bg-background-card rounded-xl shadow p-4 flex flex-col md:flex-row md:items-center gap-4">
      {/* Sort By */}
      <div className="flex items-center gap-2">
        <label htmlFor="sortBy" className="text-sm font-medium text-text-main">Sort by:</label>
        <select id="sortBy" className="rounded-lg border border-gray-300 px-2 py-1 text-sm">
          <option value="PRODUCT_NAME">Name</option>
          <option value="PRODUCT_PRICE">Price</option>
        </select>
      </div>
      {/* Availability */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-text-main">Availability:</label>
        <input type="checkbox" id="inStock" className="accent-primary" />
        <label htmlFor="inStock" className="text-sm">In Stock</label>
      </div>
      {/* Price Range */}
      <div className="flex items-center gap-2">
        <label htmlFor="priceRange" className="text-sm font-medium text-text-main">Price:</label>
        <input type="range" id="priceRange" min={0} max={100} className="accent-primary" />
        <span className="text-xs text-text-muted">CHF 0 - 100</span>
      </div>
      {/* Items per page */}
      <div className="flex items-center gap-2">
        <label htmlFor="perPage" className="text-sm font-medium text-text-main">Items per page:</label>
        <select id="perPage" className="rounded-lg border border-gray-300 px-2 py-1 text-sm">
          <option value={12}>12</option>
          <option value={24}>24</option>
          <option value={48}>48</option>
        </select>
      </div>
    </section>
  );
} 