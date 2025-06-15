"use client";

import Link from "next/link";

interface ViewAllLinkProps {
  selectedCity: string;
  searchZipCode: string;
}

export default function ViewAllLink({
  selectedCity,
  searchZipCode,
}: ViewAllLinkProps) {
  return (
    <div className="text-center mt-10">
      <Link
        href={`/discover?${
          selectedCity ? `city=${selectedCity}` : `zip=${searchZipCode}`
        }`}
        className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
      >
        View all restaurants
        <svg
          className="ml-2 w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </Link>
    </div>
  );
} 