"use client"

import { cn } from "@/lib/utils/utils";
import { AnimatePresence , motion} from "framer-motion";

export default function CategoryFilter({ visibleCategories, hiddenCategories, selectedCategory, onSelect, isDropdownOpen, setIsDropdownOpen, isPending }: { visibleCategories: string[]; hiddenCategories: string[]; selectedCategory: string; onSelect: (cat: string) => void; isDropdownOpen: boolean; setIsDropdownOpen: (open: boolean) => void; isPending: boolean; }) {
    return (
      <div className="border border-black mb-8 bg-primary-100 rounded-lg">
        <div className="flex flex-wrap gap-4 relative">
          {visibleCategories.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => onSelect(category)}
                className={cn(
                  "px-12 py-2 text-sm md:text-base transition-colors relative",
                  isSelected
                    ? "bg-primary text-white font-medium"
                    : "bg-primary-100 hover:bg-primary-200"
                )}
                disabled={isPending}
              >
                {category}
                {isPending && isSelected && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 animate-pulse"></span>
                )}
              </button>
            );
          })}
          {hiddenCategories.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={cn(
                  "px-4 py-2 text-sm md:text-base transition-colors relative focus:outline-none focus:ring-2 focus:ring-primary/50",
                  isDropdownOpen
                    ? "bg-primary text-white font-semibold"
                    : "bg-primary-200 hover:bg-primary-400"
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
                    className="absolute top-full left-0 mt-2 w-56 max-h-96 overflow-y-auto rounded-xl shadow-lg border border-primary z-50 bg-white scrollbar-thin scrollbar-thumb-accent scrollbar-track-gray-100 "
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
                                : "hover:bg-accent/10 text-slate-700"
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
  