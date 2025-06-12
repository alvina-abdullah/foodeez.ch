import { FilterX } from "lucide-react";

export default function EmptyState({ clearAllFilters }: { clearAllFilters: () => void }) {
  return (
    <div className="text-center py-12">
      <FilterX className="mx-auto mb-4 h-10 w-10 text-accent-light" aria-hidden="true" />
      
      <p className="text-text-muted text-base md:text-lg font-medium mb-4">
        No restaurants found matching your filters.
      </p>

      <button
        onClick={clearAllFilters}
        className="inline-flex items-center gap-2 text-sm md:text-base font-semibold text-primary border border-primary active:text-primary-dark transition-colors rounded-md px-4 py-2 "
      >
        <FilterX className="w-4 h-4" aria-hidden="true" />
        Clear Filters
      </button>
    </div>
  );
}
