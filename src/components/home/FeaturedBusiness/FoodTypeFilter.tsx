import { cn } from "@/lib/utils/cn";

export default function FoodTypeFilter({
  foodTypes,
  selectedFoodType,
  onSelect,
  isPending,
}: {
  foodTypes: string[];
  selectedFoodType: string;
  onSelect: (type: string) => void;
  isPending: boolean;
}) {
  return (
    <div className="border border-black mb-8 bg-primary-100 rounded-lg overflow-hidden ">
      {foodTypes.map((type) => (
        <button
          key={type}
          onClick={() => onSelect(type)}
          className={cn(
            "px-20 py-2 text-sm md:text-base transition-colors relative",
            selectedFoodType === type
              ? "bg-primary text-white font-medium"
              : "bg-primary-100 hover:bg-primary-200"
          )}
          disabled={isPending}
        >
          {type}
          {isPending && selectedFoodType === type && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></span>
          )}
        </button>
      ))}
    </div>
  );
}
