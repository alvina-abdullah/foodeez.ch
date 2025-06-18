"use client";

import { cn } from "@/lib/utils/cn";
import { AnimatePresence, motion } from "framer-motion";

export default function CategoryFilter({
  visibleCategories,
  hiddenCategories,
  selectedCategory,
  onSelect,
  isDropdownOpen,
  setIsDropdownOpen,
  isPending,
}: {
  visibleCategories: string[];
  hiddenCategories: string[];
  selectedCategory: string;
  onSelect: (cat: string) => void;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (open: boolean) => void;
  isPending: boolean;
}) {
  return (
    <div className="
    
    hidden 
    
    border border-accent mb-8 bg-secondary-light rounded-lg text-accent-dark">
      <div className="flex flex-wrap gap-4 relative ">
        {visibleCategories.map((category) => {
          const isSelected = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => onSelect(category)}
              className={cn(
                "px-12 py-2 text-sm md:text-base transition-colors relative",
                isSelected
                  ? "bg-primary text-white"
                  : "bg-secondary-light hover:bg-primary-light"
              )}
              disabled={isPending}
            >
              {category}
              {isPending && isSelected && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary animate-pulse rounded-full"></span>
              )}
            </button>
          );
        })}
        {hiddenCategories.length > 0 && (
          <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={cn(
              "px-4 py-2 text-sm md:text-base transition-colors relative focus:outline-none ",
              isDropdownOpen
                ? "bg-primary text-white"
                : "bg-secondary-light hover:bg-primary-light"
            )}
            disabled={isPending}
          >
            More Categories
            {isPending &&
              hiddenCategories.includes(selectedCategory as any) && (
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
                className="absolute top-full left-0 mt-2 w-auto md:w-56 max-h-96 overflow-y-auto rounded-xl shadow-lg border border-primary z-50 bg-white "
                id="no-scrollbar"
              >
                <div className="p-2 space-y-1">
                  {hiddenCategories.map((category) => {
                    const isSelected = selectedCategory === category;
                    return (
                      <button
                        key={category}
                        onClick={() => {
                          onSelect(category);
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
                        {category}
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
      </div>
    </div>
  );
}
