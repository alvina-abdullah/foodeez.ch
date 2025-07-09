import React from 'react';

interface FoodJourneyPaginationProps {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
}

const FoodJourneyPagination: React.FC<FoodJourneyPaginationProps> = ({ page, limit, total, onPageChange }) => {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <nav className="flex justify-center my-6">
      <ul className="inline-flex items-center space-x-1">
        <li>
          <button
            className="px-3 py-1 rounded-l bg-gray-200 hover:bg-primary hover:text-white transition disabled:opacity-50"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            aria-label="Previous page"
          >
            &lt;
          </button>
        </li>
        {getPageNumbers().map((p) => (
          <li key={p}>
            <button
              className={`px-3 py-1 rounded bg-gray-100 hover:bg-primary hover:text-white transition ${p === page ? 'bg-primary text-white font-bold' : ''}`}
              onClick={() => onPageChange(p)}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </button>
          </li>
        ))}
        <li>
          <button
            className="px-3 py-1 rounded-r bg-gray-200 hover:bg-primary hover:text-white transition disabled:opacity-50"
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            aria-label="Next page"
          >
            &gt;
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default FoodJourneyPagination;