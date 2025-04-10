import { Metadata } from "next";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { searchBusinesses } from "@/services/database/searchService";

export const metadata: Metadata = {
  title: "Search Results | Foodeez",
  description: "Find the perfect restaurant with our powerful search engine",
};

export default async function SearchPage({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  // Get query parameters
  const query = searchParams?.q || '';
  
  // If no query parameter, redirect to discover page
  if (!query) {
    redirect('/discover');
  }
  
  try {
    // Use our enhanced search service
    const results = await searchBusinesses({
      query: typeof query === 'string' ? query : query[0],
      page: 1,
      limit: 20,
      sortBy: 'relevance',
    });
    
    // Redirect to the discover page with the search query
    const redirectUrl = `/discover?q=${encodeURIComponent(typeof query === 'string' ? query : query[0])}`;
    redirect(redirectUrl);
    
  } catch (error) {
    console.error("Search error:", error);
    
    // Still redirect to discover page on error, but with error parameter
    redirect(`/discover?q=${encodeURIComponent(typeof query === 'string' ? query : query[0])}&error=true`);
  }
} 