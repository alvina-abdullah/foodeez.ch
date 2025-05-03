import { RefreshCw } from "lucide-react";

export default function ActiveFiltersSummary({ selectedFoodType, selectedCategory, clearAllFilters, isPending }: { selectedFoodType: string; selectedCategory: string; clearAllFilters: () => void; isPending: boolean; }) {
    if (selectedFoodType === "All" && !selectedCategory) return null;
    return (
      <div className="text-center mb-6">
        <div className="text-sm text-gray-500 mb-2">
          <span className="text-gray-600 font-medium mr-2">Filters:</span>
          {selectedFoodType !== "All" && (
            <span className="inline-block bg-blue-50 text-blue-700 rounded-full px-2 py-1 mr-2 mb-2">
              {selectedFoodType}
            </span>
          )}
          {selectedCategory && (
            <span className="inline-block bg-green-50 text-green-700 rounded-full px-2 py-1 mr-2 mb-2">
              {selectedCategory}
            </span>
          )}
        </div>
        <button
          onClick={clearAllFilters}
          className="text-sm text-primary hover:text-primary/80 font-medium inline-flex items-center"
          disabled={isPending}
        >
          <RefreshCw size={12} className="mr-1" />
          {isPending ? "Updating..." : "Clear All Filters"}
        </button>
      </div>
    );
  }