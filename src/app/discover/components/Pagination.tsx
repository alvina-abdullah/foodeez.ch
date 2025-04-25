"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

export default function Pagination({ currentPage, totalPages, onPageChange, isLoading }: PaginationProps) {
  // Generate page numbers to display (current, neighbors, first/last)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    // Always include first page
    pages.push(1);
    
    // Calculate range around current page
    const rangeStart = Math.max(2, currentPage - 1);
    const rangeEnd = Math.min(totalPages - 1, currentPage + 1);
    
    // Add ellipsis if there's a gap after first page
    if (rangeStart > 2) {
      pages.push("...");
    }
    
    // Add pages around current page
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }
    
    // Add ellipsis if there's a gap before last page
    if (rangeEnd < totalPages - 1) {
      pages.push("...");
    }
    
    // Always include last page if more than 1 page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  const pageNumbers = getPageNumbers();
  
  // Check if we can go to previous/next page
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;
  
  return (
    <div className="flex justify-center mt-12">
      <div className="flex items-center rounded-lg overflow-hidden">
        {/* Previous button */}
        <button
          onClick={() => canGoPrevious && onPageChange(currentPage - 1)}
          disabled={!canGoPrevious || isLoading}
          className="px-3 py-2 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          <ChevronLeft size={20} />
        </button>
        
        {/* Page numbers */}
        <div className="flex">
          {pageNumbers.map((page, index) => (
            <div key={index}>
              {typeof page === "number" ? (
                <button
                  onClick={() => onPageChange(page)}
                  disabled={page === currentPage || isLoading}
                  className={`min-w-[40px] px-3 py-2 border border-gray-200 ${
                    page === currentPage
                      ? "bg-primary text-white font-medium"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  } ${index > 0 ? "-ml-px" : ""}`}
                >
                  {page}
                </button>
              ) : (
                <span className="min-w-[40px] px-3 py-2 border border-gray-200 bg-white text-gray-400 -ml-px text-center">
                  {page}
                </span>
              )}
            </div>
          ))}
        </div>
        
        {/* Next button */}
        <button
          onClick={() => canGoNext && onPageChange(currentPage + 1)}
          disabled={!canGoNext || isLoading}
          className="px-3 py-2 -ml-px bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
} 