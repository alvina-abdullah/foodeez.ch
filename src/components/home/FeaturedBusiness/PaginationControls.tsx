import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const PER_PAGE_OPTIONS = [20, 40, 60, 80, 100];

export default function PaginationControls({
  hasMore,
  isPending,
  handleViewMoreBusiness,
  perPage,
  isDropdownOpen,
  setIsDropdownOpen,
  handlePerPageChange,
}: {
  hasMore: boolean;
  isPending: boolean;
  handleViewMoreBusiness: (e: React.MouseEvent<HTMLButtonElement>) => void;
  perPage: number;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (open: boolean) => void;
  handlePerPageChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center justify-between mt-12 gap-4 flex-wrap">
      {hasMore && (
        <button
          onClick={handleViewMoreBusiness}
          className={cn(
            "inline-flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors shadow-sm",
            isPending && "pointer-events-none opacity-50"
          )}
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            `View More`
          )}
        </button>
      )}
      {/* Combo Box for per page selection */}
      <div className="relative">
        <button
          type="button"
          className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/50 min-w-[120px]"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          {perPage}/ page
          <svg
            className="ml-2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        {isDropdownOpen && (
          <div className="absolute z-10 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div className="py-1">
              {PER_PAGE_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    handlePerPageChange(option);
                    setIsDropdownOpen(false);
                  }}
                  className={cn(
                    "block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100",
                    perPage === option &&
                      "bg-primary/10 text-primary font-semibold"
                  )}
                >
                  {option}/ page
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
