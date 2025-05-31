"use client";

import Link from "next/link";
import { TrendingUp, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function BusinessCTA() {
  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28"
      style={{
        backgroundImage:
          'url("https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1600&q=80")',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-0" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true }}
        className="relative z-10 max-w-4xl mx-auto text-center text-white px-2"
      >
        {/* Badge */}
        <div className="inline-flex items-center bg-white text-text-main text-sm font-semibold px-4 py-1.5 rounded-full mb-6 shadow-md">
          <TrendingUp className="w-4 h-4 text-accent mr-2" />
          For Restaurant Owners
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight drop-shadow-md mb-4">
          Ready to boost your restaurant's visibility?
        </h2>

        {/* Subtext */}
        <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Join thousands of restaurants on <span className="font-semibold">Foodeez</span> and connect with hungry
          customers looking for their next favorite meal.
        </p>

        {/* Button */}
        <Link
          href="/subscription"
          className="inline-flex items-center justify-center bg-primary hover:bg-secondary transition-all duration-300 text-white font-semibold py-3 px-6 sm:px-8 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
        >
          <span>Join Now</span>
          <ArrowRight className="ml-2 w-4 h-4" />
        </Link>
      </motion.div>
    </section>
  );
}
