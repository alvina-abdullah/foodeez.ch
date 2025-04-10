'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MapPin, Phone, Globe, Utensils, Info, Star, MessageSquare, Calendar, Clock, Users } from 'lucide-react';
import { business, business_reviews, food_menu, food_menu_items, food_type, business_category } from '@prisma/client';
import ReviewCard from '@/features/reviews/components/ReviewCard';
import AddReviewForm from '@/features/reviews/components/AddReviewForm';
import { motion } from 'framer-motion';

// Define the enriched restaurant type
type RestaurantWithDetails = business & {
  avgRating: number;
  business_2_business_category: ({ business_category: business_category | null })[];
  business_2_food_type: ({ food_type: food_type | null })[];
  business_reviews: business_reviews[];
  food_menu: (food_menu & { food_menu_items: food_menu_items[] })[];
};

interface RestaurantDetailClientProps {
  restaurant: RestaurantWithDetails;
}

export default function RestaurantDetailClient({ restaurant }: RestaurantDetailClientProps) {
  const [activeTab, setActiveTab] = useState('menu'); // 'menu', 'reviews', 'info', 'reserve'
  const [reviewsList, setReviewsList] = useState<business_reviews[]>(restaurant.business_reviews);

  const tabs = [
    { id: 'menu', label: 'Menu', icon: Utensils },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare },
    { id: 'info', label: 'Info', icon: Info },
    { id: 'reserve', label: 'Reserve Table', icon: Calendar },
  ];

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => <Star key={`full-${i}`} size={16} className="text-yellow-400 fill-yellow-400" />)}
        {halfStar && <Star key="half" size={16} className="text-yellow-400" />}
        {[...Array(emptyStars)].map((_, i) => <Star key={`empty-${i}`} size={16} className="text-gray-300" />)}
      </div>
    );
  };

  const handleReviewSubmitted = (newReview: business_reviews) => {
    setReviewsList(prevReviews => [newReview, ...prevReviews]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'menu':
        return <MenuSection menus={restaurant.food_menu} />;
      case 'reviews':
        return <ReviewsSection 
                 reviews={reviewsList} 
                 restaurantId={restaurant.BUSINESS_ID} 
                 onReviewSubmitted={handleReviewSubmitted} 
               />;
      case 'info':
        return <InfoSection restaurant={restaurant} />;
      case 'reserve':
        return <ReservationSection restaurantId={restaurant.BUSINESS_ID} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative h-64 md:h-80 w-full">
        <Image
          src={restaurant.IMAGE_URL || '/images/placeholder-restaurant.jpg'}
          alt={`${restaurant.BUSINESS_NAME || 'Restaurant'} hero image`}
          layout="fill"
          objectFit="cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-8 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 font-heading">
            {restaurant.BUSINESS_NAME}
          </h1>
          <div className="flex items-center gap-2 mb-2">
            {renderStars(restaurant.avgRating)}
            <span className="text-sm">({restaurant.avgRating.toFixed(1)})</span>
            <span className="text-sm">({reviewsList.length} reviews)</span>
          </div>
          <div className="text-sm flex flex-wrap gap-x-4 gap-y-1">
            {restaurant.business_2_food_type.map(({ food_type }) => food_type?.TITLE).filter(Boolean).join(' · ')}
            {restaurant.business_2_food_type.length > 0 && restaurant.business_2_business_category.length > 0 && ' · '}
            {restaurant.business_2_business_category.map(({ business_category }) => business_category?.CATEGORY_NAME).filter(Boolean).join(' · ')}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container-custom py-8 md:py-12">
        {/* Sticky Tabs */}
        <div className="sticky top-16 bg-white shadow-sm rounded-lg z-40 mb-8 overflow-x-auto">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

// --- Sub-components for each tab ---

// Menu Section
const MenuSection = ({ menus }: { menus: RestaurantWithDetails['food_menu'] }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
    {menus.length === 0 ? (
      <p className="text-gray-600 text-center py-12">Menu information is currently unavailable.</p>
    ) : (
      menus.map((menu) => (
        <div key={menu.FOOD_MENU_ID} className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-primary-600">{menu.TITLE || 'Menu Section'}</h2>
          {menu.food_menu_items.length === 0 ? (
            <p className="text-gray-500">No items found in this section.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {menu.food_menu_items.map((item) => (
                <div key={item.FOOD_MENU_ITEMS_ID} className="border-b border-gray-100 py-2 last:border-b-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-800">{item.TITLE}</h3>
                      {item.DESCRIPTION && <p className="text-sm text-gray-500 mt-1">{item.DESCRIPTION}</p>}
                    </div>
                    {item.PRICE && (
                      <span className="text-sm font-semibold text-primary ml-4 whitespace-nowrap">
                        {item.CURRENCY || 'CHF'} {item.PRICE.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))
    )}
  </motion.div>
);

// Reviews Section
interface ReviewsSectionProps {
  reviews: business_reviews[];
  restaurantId: number;
  onReviewSubmitted: (newReview: business_reviews) => void;
}

const ReviewsSection = ({ reviews, restaurantId, onReviewSubmitted }: ReviewsSectionProps) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Customer Reviews</h2>
      
      <AddReviewForm 
        restaurantId={restaurantId} 
        onSubmitSuccess={onReviewSubmitted} 
      />
      
      {reviews.length === 0 ? (
        <p className="text-gray-600 text-center py-12 bg-white p-6 rounded-lg shadow-md">Be the first to review this restaurant!</p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <ReviewCard key={review.BUSINESS_REVIEWS_ID} review={review as any} className="bg-white shadow-md" />
          ))}
        </div>
      )}
    </motion.div>
  );
};

// Info Section
const InfoSection = ({ restaurant }: { restaurant: RestaurantWithDetails }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-2xl font-semibold mb-6 text-gray-800">Restaurant Information</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-medium mb-3 text-primary-600">Details</h3>
        {restaurant.DESCRIPTION && <p className="text-gray-600 mb-4">{restaurant.DESCRIPTION}</p>}
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-gray-700">
            <Utensils size={14} className="mr-2 text-primary" />
            Cuisines: {restaurant.business_2_food_type.map(({ food_type }) => food_type?.TITLE).filter(Boolean).join(', ') || 'N/A'}
          </div>
          <div className="flex items-center text-gray-700">
            <Info size={14} className="mr-2 text-primary" />
            Categories: {restaurant.business_2_business_category.map(({ business_category }) => business_category?.CATEGORY_NAME).filter(Boolean).join(', ') || 'N/A'}
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-medium mb-3 text-primary-600">Contact & Location</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-gray-700">
            <MapPin size={14} className="mr-2 text-primary" />
            Address: {`${restaurant.ADDRESS_STREET || ''}, ${restaurant.ADDRESS_ZIP || ''} ${restaurant.ADDRESS_TOWN || ''}`.trim().replace(/^,|,$/g, '') || 'N/A'}
          </div>
          {restaurant.PHONE_NUMBER && (
            <div className="flex items-center text-gray-700">
              <Phone size={14} className="mr-2 text-primary" />
              Phone: <a href={`tel:${restaurant.PHONE_NUMBER}`} className="ml-1 text-primary hover:underline">{restaurant.PHONE_NUMBER}</a>
            </div>
          )}
          {restaurant.WEB_ADDRESS && (
            <div className="flex items-center text-gray-700">
              <Globe size={14} className="mr-2 text-primary" />
              Website: <a href={restaurant.WEB_ADDRESS} target="_blank" rel="noopener noreferrer" className="ml-1 text-primary hover:underline">Visit Website</a>
            </div>
          )}
          {/* TODO: Add Opening Hours */} 
        </div>
      </div>
    </div>
    {/* TODO: Add Map Integration */}
  </motion.div>
);

// Reservation Section
const ReservationSection = ({ restaurantId }: { restaurantId: number }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(2);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!date) {
      setMessage({ type: 'error', text: 'Please select a date for your reservation.' });
      return;
    }
    if (!time) {
      setMessage({ type: 'error', text: 'Please select a time for your reservation.' });
      return;
    }
    if (!guestName.trim()) {
      setMessage({ type: 'error', text: 'Please enter your name.' });
      return;
    }
    if (!guestEmail.trim() || !guestEmail.includes('@')) {
      setMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }
    
    setIsSubmitting(true);
    setMessage(null);
    
    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessId: restaurantId,
          date,
          time,
          guestCount: guests,
          guestName,
          guestEmail,
          guestPhone,
          specialRequests
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit reservation request');
      }
      
      // Success - clear form and show success message
      setMessage({ 
        type: 'success', 
        text: 'Your reservation request has been submitted successfully! You will receive a confirmation email shortly.' 
      });
      
      // Reset form fields
      setDate('');
      setTime('');
      setGuests(2);
      setGuestName('');
      setGuestEmail('');
      setGuestPhone('');
      setSpecialRequests('');
      
    } catch (error: any) {
      console.error('Reservation submission error:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'An error occurred while submitting your reservation. Please try again or contact the restaurant directly.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Reserve Your Table</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Date and Time Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date*</label>
            <input 
              type="date" 
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              min={new Date().toISOString().split('T')[0]} // Set min date to today
            />
          </div>
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Time*</label>
            <input 
              type="time" 
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
        
        {/* Guest Details */}
        <div>
          <label htmlFor="guestName" className="block text-sm font-medium text-gray-700 mb-1">Your Name*</label>
          <input 
            type="text" 
            id="guestName"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            required 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Enter your full name"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="guestEmail" className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
            <input 
              type="email" 
              id="guestEmail"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              required 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="For confirmation email"
            />
          </div>
          <div>
            <label htmlFor="guestPhone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input 
              type="tel" 
              id="guestPhone"
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Optional"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">Number of Guests*</label>
          <input 
            type="number" 
            id="guests"
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
            required 
            min="1"
            max="20" // Set a reasonable max
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        
        <div>
          <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
          <textarea 
            id="specialRequests"
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            rows={3}
            placeholder="Any special requirements or preferences?"
          />
        </div>
        
        {/* Status Message */}
        {message && (
          <div className={`p-3 rounded-md text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}
        
        {/* Submit Button */}
        <button 
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 bg-primary text-white font-medium rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? 'Sending Request...' : 'Request Reservation'}
        </button>
      </form>
      
      <p className="text-xs text-gray-500 mt-4 text-center">
        This is a reservation request. The restaurant will confirm availability via email.
      </p>
    </motion.div>
  );
}; 