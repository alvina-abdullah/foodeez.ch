"use client";

interface MenuPaginationProps {
  total: number;
  page?: number;
  perPage?: number;
}

export default function MenuPagination({ total, page = 1, perPage = 20 }: MenuPaginationProps) {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;
  return (
    <nav className="flex justify-center items-center gap-2 mt-8" aria-label="Pagination">
      <button className="px-3 py-1 rounded-lg bg-background-card border text-text-main hover:bg-primary/10" disabled={page === 1} aria-label="Previous Page">Prev</button>
      {[...Array(totalPages)].map((_, idx) => (
        <button
          key={idx}
          className={`px-3 py-1 rounded-lg font-semibold ${page === idx + 1 ? 'bg-primary text-white' : 'bg-background-card text-text-main hover:bg-primary/10'}`}
          aria-current={page === idx + 1 ? 'page' : undefined}
        >
          {idx + 1}
        </button>
      ))}
      <button className="px-3 py-1 rounded-lg bg-background-card border text-text-main hover:bg-primary/10" disabled={page === totalPages} aria-label="Next Page">Next</button>
    </nav>
  );
} 