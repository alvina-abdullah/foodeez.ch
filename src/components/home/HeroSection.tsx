"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaArrowRight, FaSearch } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

type Slide = {
  id: number;
  title: string;
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
    title: "Discover Local Gems",
    subtitle: "Authentic Dining",
    description: "Find the best hidden restaurants and cafes in your neighborhood with trusted reviews from real foodies.",
    cta: "Explore Now",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    alt: "Cozy restaurant with ambient lighting and happy diners",
    link: "/discover"
  },
  {
    id: 2,
    title: "Taste of Culture",
    subtitle: "Global Cuisine",
    description: "Experience authentic flavors from around the world with our curated selection of multicultural restaurants.",
    cta: "Find Cuisines",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    alt: "Colorful plate of international cuisine",
    link: "/discover?category=international"
  },
  {
    id: 3,
    title: "Farm to Table",
    subtitle: "Fresh & Sustainable",
    description: "Support local farms and enjoy the freshest ingredients at restaurants committed to sustainability.",
    cta: "Eat Fresh",
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    alt: "Farm to table fresh food arrangement",
    link: "/discover?category=sustainable"
  },
  {
    id: 4,
    title: "Fine Dining Experience",
    subtitle: "Premium Selection",
    description: "Indulge in exceptional culinary experiences at the most prestigious restaurants in your city.",
    cta: "Reserve Now",
    image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    alt: "Elegant fine dining restaurant interior",
    link: "/discover?category=fine-dining"
  },
  {
    id: 5,
    title: "Authentic Street Food",
    subtitle: "Local Favorites",
    description: "Experience the vibrant flavors of street food from the comfort of established eateries with proper hygiene standards.",
    cta: "Taste Adventure",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    alt: "Colorful and vibrant street food display",
    link: "/discover?category=street-food"
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
  const [searchValue, setSearchValue] = useState("");

  const router = useRouter();

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/discover?q=${encodeURIComponent(searchValue)}`);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative h-[650px] sm:h-[750px] w-full overflow-hidden"
      aria-roledescription="carousel"
      aria-label="Featured products"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      {/* Decorative Element */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-light via-primary to-accent z-10"></div>
      
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
              quality={85}
            />
            {/* Enhanced gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative h-full container-custom flex items-center">
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="max-w-xl text-white"
            >
              <motion.span variants={itemVariants} className="inline-block px-3 py-1 rounded-full bg-accent text-white text-sm font-medium mb-4">
                {slides[currentSlide].subtitle}
              </motion.span>
              <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">
                {slides[currentSlide].title}
              </motion.h1>
              <motion.p variants={itemVariants} className="text-lg md:text-xl mb-8 text-gray-100">
                {slides[currentSlide].description}
              </motion.p>
              <motion.div variants={itemVariants}>
                <Link
                  href={slides[currentSlide].link}
                  className="btn-primary"
                >
                  <span>{slides[currentSlide].cta}</span>
                  <FaArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Search Bar Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent py-8">
        <div className="container-custom">
          <form 
            onSubmit={handleSearch}
            className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-3 bg-white rounded-full p-2 shadow-lg"
          >
            <div className="flex-1 flex items-center pl-4">
              <FaSearch className="text-text-muted mr-3" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search for restaurants, cuisines, or dishes..."
                className="w-full py-2 outline-none text-text-main"
                aria-label="Search"
              />
            </div>
            <button 
              type="submit" 
              className="w-full sm:w-auto px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-full transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-32 sm:bottom-28 left-0 right-0 flex justify-center space-x-2 z-10">
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