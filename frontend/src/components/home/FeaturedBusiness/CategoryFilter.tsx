"use client";

import { cn } from "@/lib/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import { BusinessCategory } from "@/types/business.types";

export default function CategoryFilter({
  visibleCategories,
  hiddenCategories,
  selectedCategory,
  onSelect,
  isDropdownOpen,
  setIsDropdownOpen,
  isPending,
}: {
  visibleCategories: BusinessCategory[];
  hiddenCategories: BusinessCategory[];
  selectedCategory: string;
  onSelect: (cat: string) => void;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (open: boolean) => void;
  isPending: boolean;
}) {
  return (
    <div className=" border border-accent mb-8 bg-secondary-light rounded-lg text-accent-dark">
      <div className="grid grid-cols-2 lg:flex gap-y-2 relative">
        {visibleCategories.map((category) => {
          const isSelected = selectedCategory === category.CATEGORY;
          const displayName = category.CATEGORY ? `${category.CATEGORY} (${category.CNT || 0})` : '';
          return (
            <button
              key={category.BUSINESS_CATEGORY_ID}
              onClick={() => onSelect(category.CATEGORY || '')}
              className={cn(
                "lg:px-10 py-2 text-sm md:text-base transition-colors relative text-center",

                isSelected
                  ? "bg-primary text-white"
                  : "bg-secondary-light hover:bg-primary-light"
              )}
              disabled={isPending}
            >
              {displayName}
              {isPending && isSelected && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary animate-pulse rounded-full" />
              )}
            </button>
          );
        })}

        {hiddenCategories.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={cn(
                "w-full lg:px-10 py-2 text-sm md:text-base transition-colors relative text-center",
                isDropdownOpen
                  ? "bg-primary text-white"
                  : "bg-secondary-light hover:bg-primary-light"
              )}
              disabled={isPending}
            >
              More Categories
              {isPending &&
                hiddenCategories.some(cat => cat.CATEGORY === selectedCategory) && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full animate-pulse" />
                )}
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 mt-2 w-auto md:w-56 max-h-96 overflow-y-auto rounded-xl shadow-lg border border-primary z-50 bg-white"
                  id="no-scrollbar"
                >
                  <div className="p-2 space-y-1">
                    {hiddenCategories.map((category) => {
                      const isSelected = selectedCategory === category.CATEGORY;
                      const displayName = category.CATEGORY ? `${category.CATEGORY} (${category.CNT || 0})` : '';
                      return (
                        <button
                          key={category.BUSINESS_CATEGORY_ID}
                          onClick={() => {
                            onSelect(category.CATEGORY || '');
                            setIsDropdownOpen(false);
                          }}
                          className={cn(
                            "w-full text-left px-4 py-2 rounded-md text-sm transition-colors relative",
                            isSelected
                              ? "bg-primary/10 text-primary font-medium"
                              : "hover:bg-primary/10 text-text-main"
                          )}
                          disabled={isPending}
                        >
                          {displayName}
                          {isPending && isSelected && (
                            <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full animate-pulse" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
        {hiddenCategories.some(cat => cat.CATEGORY === selectedCategory) && (
          <span className="lg:px-10 py-2 text-center bg-primary text-white  text-sm md:text-base font-semibold">
            {(() => {
              const selectedCat = hiddenCategories.find(cat => cat.CATEGORY === selectedCategory);
              return selectedCat ? `${selectedCat.CATEGORY} (${selectedCat.CNT || 0})` : selectedCategory;
            })()}
          </span>
        )}
      </div>
    </div>
  );
}
