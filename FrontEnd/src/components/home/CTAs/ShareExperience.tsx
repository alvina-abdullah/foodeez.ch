"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

export default function ShareExperience() {
  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28"
      style={{
        backgroundImage:
          'url("https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1600&q=80")',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-0" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className="relative z-10 max-w-4xl mx-auto text-center text-white px-2"
      >
        {/* Badge */}
        <div className="inline-flex items-center justify-center p-2 bg-white rounded-full shadow-md mb-6">
          <TrendingUp className="w-5 h-5 text-accent mr-2" />
          <span className="text-sm font-semibold text-text-main">
            For Food Lovers
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 leading-tight drop-shadow-md">
          Share Your Food Journey
        </h2>

        <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Inspire food lovers by reviewing your favorite meals, hidden gems, and
          dining experiences across the city.
        </p>

        <Link
          href="/share-experience"
          className="inline-block bg-primary text-white font-semibold py-3 px-6 sm:px-8 rounded-full shadow-lg hover:bg-secondary transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
        >
          Share Now
        </Link>
      </motion.div>
    </section>
  );
}
