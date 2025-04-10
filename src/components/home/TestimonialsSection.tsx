'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, MessageSquareQuote, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import ReviewCard, { ReviewData } from '../../features/reviews/components/ReviewCard';
import { getHighRatedReviews } from '@/services/reviewService';

export default function TestimonialsSection() {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Calculate how many reviews to show per slide based on screen size
  const slidesPerView = {
    mobile: 1,
    tablet: 2,
    desktop: 4
  };
  
  const getVisibleReviews = () => {
    // Responsive count based on screen size (simplified version)
    // In real implementation, you'd use a hook for window width
    const count = typeof window !== 'undefined' && window.innerWidth < 768 
      ? slidesPerView.mobile 
      : typeof window !== 'undefined' && window.innerWidth < 1024 
        ? slidesPerView.tablet 
        : slidesPerView.desktop;
        
    return reviews.slice(currentSlide, currentSlide + count);
  };
  
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        // Fetch top-rated reviews from our service
        const reviewData = await getHighRatedReviews(8);
        setReviews(reviewData);
        setError(null);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Could not load reviews. Please try again later.');
        // Set fallback sample data in case of error
        setReviews(getSampleReviews());
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReviews();
  }, []);
  
  const maxSlide = Math.max(0, reviews.length - slidesPerView.desktop);
  
  const nextSlide = () => {
    setCurrentSlide((prev) => 
      prev >= maxSlide ? 0 : prev + 1
    );
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => 
      prev === 0 ? maxSlide : prev - 1
    );
  };
  
  return (
    <section className="section-padding bg-gradient-to-br from-accent-light/5 to-primary-light/5">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full mb-4">
              <MessageSquareQuote className="inline-block w-4 h-4 mr-1" />
              Testimonials
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-text-main mb-3">
              Our Happy Customers
            </h2>
            <p className="text-text-muted max-w-2xl">
              See what our customers have to say about their dining experiences at restaurants discovered through Foodeez
            </p>
          </div>
          
          <div className="flex gap-2 mt-6 md:mt-0">
            <button 
              onClick={prevSlide}
              className="p-3 rounded-full border border-gray-300 hover:bg-white transition-colors text-text-main"
              aria-label="Previous testimonials"
              disabled={isLoading || reviews.length <= slidesPerView.desktop}
            >
              <ArrowLeft size={18} />
            </button>
            
            <button 
              onClick={nextSlide}
              className="p-3 rounded-full bg-primary text-white hover:bg-primary-dark transition-colors"
              aria-label="Next testimonials"
              disabled={isLoading || reviews.length <= slidesPerView.desktop}
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
        
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
        
        {error && reviews.length === 0 && (
          <div className="text-center text-danger p-4 bg-danger-light/20 rounded-lg">
            {error}
          </div>
        )}
        
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.length > 0 ? (
              getVisibleReviews().map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <ReviewCard 
                    review={review} 
                    showBusinessInfo={true}
                    className="h-full"
                  />
                </motion.div>
              ))
            ) : (
              // Fallback message when no reviews are found
              <div className="col-span-4 text-center py-12 bg-white rounded-xl shadow-sm">
                <Star className="w-12 h-12 text-accent mx-auto mb-4 opacity-20" />
                <p className="text-text-muted">No reviews available yet. Be the first to share your experience!</p>
              </div>
            )}
          </div>
        )}
        
        <div className="text-center mt-12">
          <Link 
            href="/reviews" 
            className="inline-flex items-center justify-center px-6 py-3 bg-white border border-gray-300 rounded-full 
                       text-base font-medium text-text-main hover:bg-gray-50 transition-colors shadow-sm"
          >
            View All Reviews
          </Link>
        </div>
      </div>
    </section>
  );
}

// Sample reviews to use as fallback when API fails
function getSampleReviews(): ReviewData[] {
  return [
    {
      id: '1',
      userId: 'user-1',
      businessId: 101,
      rating: 4,
      comment: 'The restaurant was not at all crowded and was very posh and good looking. The restaurant was very clean and staff was polite.',
      createdAt: '2023-08-15T12:00:00Z',
      user: {
        NAME: 'Glenn',
        PROFILE_IMAGE: '/images/avatars/glenn.jpg'
      },
      business: {
        BUSINESS_NAME: 'Spice Garden',
        IMAGE_URL: '/images/restaurants/spice-garden.jpg',
        ADDRESS_TOWN: 'Zurich',
        GOOGLE_RATING: '4.5'
      },
      images: [
        { src: '/images/reviews/glenn1.jpg', alt: 'Restaurant interior' },
        { src: '/images/reviews/glenn2.jpg', alt: 'Food dish' },
        { src: '/images/reviews/glenn3.jpg', alt: 'Food dish' }
      ]
    },
    {
      id: '2',
      userId: 'user-2',
      businessId: 102,
      rating: 5,
      comment: 'Best Pakistani food that I\'ve ever tasted! Great presentation, friendly staff and affordable price! Close to the city center, I recommend.',
      createdAt: '2022-09-20T15:30:00Z',
      user: {
        NAME: 'Léa K',
        PROFILE_IMAGE: '/images/avatars/lea.jpg'
      },
      business: {
        BUSINESS_NAME: 'Taj Mahal',
        IMAGE_URL: '/images/restaurants/taj-mahal.jpg',
        ADDRESS_TOWN: 'Geneva',
        GOOGLE_RATING: '4.7'
      },
      images: [
        { src: '/images/reviews/lea1.jpg', alt: 'Food plate' },
        { src: '/images/reviews/lea2.jpg', alt: 'Restaurant view' }
      ]
    },
    {
      id: '3',
      userId: 'user-3',
      businessId: 103,
      rating: 5,
      comment: 'Good Indian restaurant in an area with many options, with affordable prices and a buffet for dinner. Also love the interior design.',
      createdAt: '2023-06-10T18:45:00Z',
      user: {
        NAME: 'Amin D',
        PROFILE_IMAGE: '/images/avatars/amin.jpg'
      },
      business: {
        BUSINESS_NAME: 'Curry House',
        IMAGE_URL: '/images/restaurants/curry-house.jpg',
        ADDRESS_TOWN: 'Basel',
        GOOGLE_RATING: '4.3'
      },
      images: [
        { src: '/images/reviews/amin1.jpg', alt: 'Restaurant interior view' }
      ]
    },
    {
      id: '4',
      userId: 'user-4',
      businessId: 104,
      rating: 4,
      comment: 'They served halal Indian food. Vegetable curry was so nice. Although environment is quite dark and modern in style.',
      createdAt: '2023-02-05T19:20:00Z',
      user: {
        NAME: 'Aisha Waheed',
        PROFILE_IMAGE: '/images/avatars/aisha.jpg'
      },
      business: {
        BUSINESS_NAME: 'Delhi Darbar',
        IMAGE_URL: '/images/restaurants/delhi-darbar.jpg',
        ADDRESS_TOWN: 'Lausanne',
        GOOGLE_RATING: '4.1'
      },
      images: [
        { src: '/images/reviews/aisha1.jpg', alt: 'Food dish' },
        { src: '/images/reviews/aisha2.jpg', alt: 'Restaurant' }
      ]
    }
  ];
}