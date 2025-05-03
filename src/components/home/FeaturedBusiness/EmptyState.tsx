export default function EmptyState({ clearAllFilters }: { clearAllFilters: () => void }) {
    return (
      <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-100">
        <p className="text-gray-500 mb-2">
          No restaurants found matching the selected filters
        </p>
        <button
          onClick={clearAllFilters}
          className="text-primary hover:text-primary/80 font-medium text-sm"
        >
          Clear Filters
        </button>
      </div>
    );
  }