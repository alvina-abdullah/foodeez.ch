"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, ArrowLeft, Utensils } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getFoodCategories } from "@/services/DiscoverPageService";

interface Category {
  id: number;
  name: string;
  count: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getFoodCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error loading categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Filter categories based on search term
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group categories by first letter
  const groupedCategories = filteredCategories.reduce((acc, category) => {
    const firstLetter = category.name.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(category);
    return acc;
  }, {} as Record<string, Category[]>);

  // Sort letters alphabetically
  const sortedLetters = Object.keys(groupedCategories).sort();

  const handleCategoryClick = (categoryName: string) => {
    router.push(`/discover?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link
              href="/discover"
              className="text-gray-600 hover:text-primary transition-colors"
            >
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-2xl font-bold text-text-main">Food Categories</h1>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="container max-w-7xl mx-auto px-4 py-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container max-w-7xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="h-32 bg-gray-100 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {sortedLetters.map((letter) => (
              <div key={letter}>
                <h2 className="text-xl font-bold text-text-main mb-4">{letter}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedCategories[letter].map((category) => (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:border-primary transition-colors"
                      onClick={() => handleCategoryClick(category.name)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Utensils size={20} className="text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium text-text-main">{category.name}</h3>
                            <p className="text-sm text-text-muted">
                              {category.count} {category.count === 1 ? 'restaurant' : 'restaurants'}
                            </p>
                          </div>
                        </div>
                        <div className="text-primary">
                          <ArrowLeft size={20} className="transform rotate-180" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 