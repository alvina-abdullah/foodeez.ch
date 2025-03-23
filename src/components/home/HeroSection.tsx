"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

type Slide = {
  id: number;
  subtitle: string;
  description: string;
  cta: string;
  image: string;
  alt: string;
  link: string;
};

const slides = [
  {
    id: 1,
    title: "Fresh Fruits",
    subtitle: "Nature's Sweet Treats",
    description: "Enjoy the vibrant flavors and nutritional benefits of fresh fruits from around the world.",
    cta: "Explore Fruits",
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    alt: "A colorful arrangement of fresh fruits",
    link: "/categories/fruits"
  },
  {
    id: 2,
    title: "Artisanal Breads",
    subtitle: "Handcrafted Goodness",
    description: "Discover the rich textures and flavors of artisanal breads, perfect for any meal.",
    cta: "Bake with Us",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    alt: "A variety of artisanal breads on a wooden table",
    link: "/categories/breads"
  },
  {
    id: 3,
    title: "Specialty Cheeses",
    subtitle: "A World of Flavors",
    description: "Explore a diverse selection of specialty cheeses, each with its unique taste and texture.",
    cta: "Taste the Difference",
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    alt: "An assortment of specialty cheeses on a platter",
    link: "/categories/cheeses"
  },
  {
    id: 4,
    title: "Exotic Spices",
    subtitle: "Flavors from Around the World",
    description: "Transform your dishes with our curated selection of exotic spices from every corner of the globe.",
    cta: "Spice It Up",
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    alt: "A variety of colorful spices in bowls",
    link: "/categories/spices"
  },
  {
    id: 5,
    title: "Organic Vegetables",
    subtitle: "Farm-Fresh Goodness",
    description: "Savor the taste and health benefits of organic vegetables, grown with care and sustainability in mind.",
    cta: "Shop Veggies",
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    alt: "A basket filled with fresh organic vegetables",
    link: "/categories/vegetables"
  }
];

const contentVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      staggerChildren: 0.1,
      when: "beforeChildren",
    },
  },
  exit: { opacity: 0, x: -50, transition: { duration: 0.4 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5, 
      ease: "circOut" 
    } 
  },
};

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const changeSlide = useCallback(
    (index: number) => {
      if (isAnimating || index === currentSlide) return;
      setIsAnimating(true);
      setCurrentSlide(index);
    },
    [isAnimating, currentSlide]
  );

  // Auto-advance with pause on hover
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      changeSlide((currentSlide + 1) % slides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [currentSlide, isHovered, changeSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        changeSlide((currentSlide - 1 + slides.length) % slides.length);
      } else if (e.key === "ArrowRight") {
        changeSlide((currentSlide + 1) % slides.length);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide, changeSlide]);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative h-[800px] w-full overflow-hidden"
      aria-roledescription="carousel"
      aria-label="Featured products"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={slides[currentSlide].id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0"
          onAnimationComplete={() => setIsAnimating(false)}
          aria-live="polite"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={slides[currentSlide].image}
              alt={slides[currentSlide].alt}
              fill
              priority={currentSlide === 0}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
              quality={80}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="max-w-xl text-white"
            >
              <motion.h2 variants={itemVariants} className="text-secondary font-orbitron uppercase tracking-wider mb-2">
                {slides[currentSlide].subtitle}
              </motion.h2>
              <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl lg:text-6xl font-orbitron font-bold mb-4">
                {slides[currentSlide].title}
              </motion.h1>
              <motion.p variants={itemVariants} className="text-lg md:text-xl mb-8 text-gray-200">
                {slides[currentSlide].description}
              </motion.p>
              <motion.div variants={itemVariants}>
                <Link
                  href={slides[currentSlide].link}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark transition-colors duration-300 group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  <span>{slides[currentSlide].cta}</span>
                  <FaArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Indicators */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => changeSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? "bg-primary scale-125" 
                : "bg-white/50 hover:bg-white/80 scale-100"
            }`}
            aria-label={`Go to slide ${index + 1}`}
            disabled={isAnimating}
            aria-current={index === currentSlide}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <div className="absolute inset-0 flex items-center justify-between px-4">
        <button
          onClick={() => changeSlide((currentSlide - 1 + slides.length) % slides.length)}
          className="p-3 rounded-full bg-black/30 hover:bg-black/50 transition-colors duration-300 text-white disabled:opacity-50"
          disabled={isAnimating}
          aria-label="Previous slide"
        >
          ←
        </button>
        <button
          onClick={() => changeSlide((currentSlide + 1) % slides.length)}
          className="p-3 rounded-full bg-black/30 hover:bg-black/50 transition-colors duration-300 text-white disabled:opacity-50"
          disabled={isAnimating}
          aria-label="Next slide"
        >
          →
        </button>
      </div>
    </motion.section>
  );
}