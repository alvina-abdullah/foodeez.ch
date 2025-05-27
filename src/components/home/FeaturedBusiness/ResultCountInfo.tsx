import { RefreshCw } from "lucide-react";

export default function ResultCountInfo({
  visibleCount,
  totalCount,
  selectedFoodType,
  selectedCategory,
  clearAllFilters,
  isPending,
}: {
  visibleCount: number;
  totalCount: number;
  selectedFoodType: string;
  selectedCategory: string;
  clearAllFilters: () => void;
  isPending: boolean;
}) {
  let filterLabel = "";
  if (selectedFoodType !== "All") filterLabel = selectedFoodType;
  if (selectedCategory)
    filterLabel = filterLabel
      ? `${filterLabel}, ${selectedCategory}`
      : selectedCategory;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-2 border-gray-200 mb-8">
      <div className="">
        <p className="text-lg sm:text-2xl text-accent-dark">
          Showing{" "}
          <span className="text-primary font-semibold">{visibleCount}</span> of{" "}
          <span className="text-primary font-semibold">{totalCount}</span>{" "}
          results
          {filterLabel && (
            <>
              {" "}
              for{" "}
              <span className="text-primary font-semibold">
                "{filterLabel}"
              </span>
            </>
          )}
        </p>
      </div>

      <button
        onClick={clearAllFilters}
        className="text-sm text-primary hover:text-primary/80 font-medium inline-flex items-center transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        disabled={isPending}
      >
        <RefreshCw size={14} className="mr-1" />
        {isPending ? "Updating..." : "Clear All Filters"}
      </button>
    </div>
  );
}
