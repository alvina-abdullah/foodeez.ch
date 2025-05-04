"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const trendingItems = [
  "Best Pizza in Geneva",
  "Best Vegan Brunch in Luzern?",
  "Most Loved Vegan Spots in Interlaken",
  "Hungry in Zurich? Here's what's nearby!",
];

const touristFavorites = [
  "Found the best shawarma in Lucerne!",
  "I didn't expect Thai food this good in the Alps.",
];

const shareIdeas = [
  "Be a Food Explorer — Earn Points & Badges",
  "Know a hidden gem? Recommend it!",
  "Help us serve better! Tell us what's missing.",
];

export default function QuickSearch() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-primary flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6" />
          Quick Search Highlights
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          Discover what's trending and loved by foodies across Switzerland 🇨🇭
        </p>
      </div>

      {/* Trending */}
      <motion.div
        className="bg-white shadow rounded-2xl p-6 border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h3 className="text-lg font-semibold text-primary mb-4">🔥 Trending</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {trendingItems.map((item, idx) => (
            <button
              key={idx}
              className="bg-primary/5 text-primary text-sm font-medium px-4 py-2 rounded-md hover:bg-primary/10 transition cursor-pointer w-full text-left"
              onClick={() => window.open(`/discover?q=${encodeURIComponent(item)}`, '_blank')}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Tourist Favorites */}
      <motion.div
        className="bg-white shadow rounded-2xl p-6 border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <h3 className="text-lg font-semibold text-secondary mb-4">
          🌍 Tourist Favorites
        </h3>
        <ul className="space-y-2">
          {touristFavorites.map((text, idx) => (
            <li key={idx}>
              <button
                className="w-full bg-secondary/5 text-secondary text-sm px-4 py-2 rounded-md hover:bg-secondary/10 transition cursor-pointer text-left"
                onClick={() => window.open(`/discover?q=${encodeURIComponent(text)}`, '_blank')}
                type="button"
              >
                {text}
              </button>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Share Your Favorite */}
      <motion.div
        className="bg-white shadow rounded-2xl p-6 border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <h3 className="text-lg font-semibold text-accent mb-4">
          ✨ Share Your Favorite Meal in Switzerland
        </h3>
        <ul className="space-y-2">
          {shareIdeas.map((text, idx) => (
            <li
              key={idx}
              className="bg-accent/5 text-accent text-sm px-4 py-2 rounded-md hover:bg-accent/10 transition cursor-pointer"
            >
              {text}
            </li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}
