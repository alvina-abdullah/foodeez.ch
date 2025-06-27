import { RefreshCw } from "lucide-react";

export default function ResultCountInfo({
  visibleCount,
  totalCount,
  selectedFoodType,
  selectedCategory,
  selectedCity,
  zipCode,
  clearAllFilters,
  isPending,
}: {
  visibleCount: number;
  totalCount: number;
  selectedFoodType: string;
  selectedCategory: string;
  selectedCity: string;
  zipCode: string;
  clearAllFilters: () => void;
  isPending: boolean;
}) {
  const buildDescription = () => {
    const foodParts = [];
    if (selectedFoodType && selectedFoodType !== "All") {
      foodParts.push(selectedFoodType);
    }
    if (selectedCategory) {
      foodParts.push(selectedCategory);
    }

    const hasFoodFilter = foodParts.length > 0;
    const hasLocationFilter = selectedCity || zipCode;

    if (!hasFoodFilter && !hasLocationFilter) {
      return "results";
    }

    const descriptionParts = [];
    if (hasFoodFilter) {
      descriptionParts.push(foodParts.join(" "));
    }
    descriptionParts.push("restaurants");

    if (selectedCity) {
      descriptionParts.push(`in ${selectedCity}`);
    } else if (zipCode) {
      descriptionParts.push(`for zip code ${zipCode}`);
    }

    return descriptionParts.join(" ");
  };

  const description = buildDescription();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-2 border-gray-200 mb-8">
      <div>
        <p className="text-lg sm:text-2xl text-text-main font-semibold">
          Showing{" "}
          <span className="text-primary">{visibleCount}</span> of{" "}
          <span className="text-primary">{totalCount}</span>{" "}
          <span className="text-test-main">{description}</span>
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
