'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Calendar, Clock, Users, ChevronLeft, Utensils, BadgeCheck, CalendarClock } from 'lucide-react';
import { extractBusinessId, parseSlug } from '@/lib/utils/genSlug';
import LoadingSpinner from '@/components/core/LoadingSpinner';
import { getBusinessById } from '@/lib/db';

export default function ReservationPage() {
  const params = useParams();
  const slug = params.slug as string;
  const parsedId = parseSlug(slug);
  const businessId = extractBusinessId(slug);
  
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    guests: '2',
    name: '',
    email: '',
    phone: '',
    specialRequests: '',
    occasion: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Fetch business data
  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        setLoading(true);
        // Use the imported function
        const data = await getBusinessById(parsedId.id);
        setBusiness(data);
      } catch (error) {
        console.error('Error fetching business:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (businessId) {
      fetchBusiness();
    }
  }, [businessId, slug]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // In a real app, this would send data to an API
    try {
      // Simulate API call to book reservation
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSuccess(true);
    } catch (error) {
      console.error('Error submitting reservation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
    // Scroll to top on step change
    window.scrollTo(0, 0);
  };
  
  const prevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
    // Scroll to top on step change
    window.scrollTo(0, 0);
  };
  
  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  if (!business) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Business Not Found</h2>
        <p className="text-gray-600 mb-6">
          Sorry, we couldn't find the business you're looking for.
        </p>
        <Link href="/business" className="inline-flex items-center text-primary-600 hover:text-primary-700">
          <ChevronLeft size={16} className="mr-1" />
          Return to businesses
        </Link>
      </div>
    );
  }
  
  if (isSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <BadgeCheck className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Reservation Confirmed!</h2>
          <div className="bg-gray-50 rounded-lg p-6 mb-6 inline-block mx-auto">
            <div className="text-left space-y-3">
              <div className="flex items-center gap-3">
                <Utensils className="text-primary-500 w-5 h-5" />
                <div>
                  <p className="text-sm text-gray-500">Business</p>
                  <p className="font-medium">{business.BUSINESS_NAME}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="text-primary-500 w-5 h-5" />
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{formData.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="text-primary-500 w-5 h-5" />
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium">{formData.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="text-primary-500 w-5 h-5" />
                <div>
                  <p className="text-sm text-gray-500">Party Size</p>
                  <p className="font-medium">
                    {formData.guests} {formData.guests === '1' ? 'Guest' : 'Guests'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <p className="text-gray-600 mb-6">
            Thank you for your reservation. We have sent the details to {formData.email}.
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              href={`/business/${slug}`} 
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
            >
              <ChevronLeft size={16} className="mr-1" />
              Return to business page
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <Link 
            href={`/business/${slug}`} 
            className="inline-flex items-center text-primary-600 hover:text-primary-700"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to {business.BUSINESS_NAME}
          </Link>
        </div>
        
        {/* Header section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Reserve a Table</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Complete the form below to reserve a table at {business.BUSINESS_NAME}.
          </p>
        </div>
        
        {/* Progress bar */}
        <div className="mb-10">
          <div className="overflow-hidden rounded-full bg-gray-200">
            <div 
              className="h-2 rounded-full bg-primary-600 transition-all duration-500" 
              style={{ width: `${(currentStep / 2) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2">
            <div className={`text-sm ${currentStep >= 1 ? 'text-primary-600 font-medium' : 'text-gray-500'}`}>
              Reservation Details
            </div>
            <div className={`text-sm ${currentStep >= 2 ? 'text-primary-600 font-medium' : 'text-gray-500'}`}>
              Contact Information
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Step 1: Reservation Details */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <CalendarClock className="text-primary-500 w-5 h-5" />
                    Reservation Details
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Date Selection */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Date*
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="date"
                          name="date"
                          required
                          value={formData.date}
                          onChange={handleChange}
                          min={new Date().toISOString().split('T')[0]}
                          className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>
                    
                    {/* Time Selection */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Time*
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Clock className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                          name="time"
                          required
                          value={formData.time}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="">Select time</option>
                          <option value="12:00 PM">12:00 PM</option>
                          <option value="12:30 PM">12:30 PM</option>
                          <option value="1:00 PM">1:00 PM</option>
                          <option value="1:30 PM">1:30 PM</option>
                          <option value="6:00 PM">6:00 PM</option>
                          <option value="6:30 PM">6:30 PM</option>
                          <option value="7:00 PM">7:00 PM</option>
                          <option value="7:30 PM">7:30 PM</option>
                          <option value="8:00 PM">8:00 PM</option>
                          <option value="8:30 PM">8:30 PM</option>
                        </select>
                      </div>
                    </div>
                    
                    {/* Party Size */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Party Size*
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Users className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                          name="guests"
                          required
                          value={formData.guests}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                            <option key={num} value={num.toString()}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                          ))}
                          <option value="11">More than 10</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Occasion (optional)
                    </label>
                    <select
                      name="occasion"
                      value={formData.occasion}
                      onChange={handleChange}
                      className="block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select an occasion</option>
                      <option value="Birthday">Birthday</option>
                      <option value="Anniversary">Anniversary</option>
                      <option value="Business Meal">Business Meal</option>
                      <option value="Date">Date</option>
                      <option value="Special Occasion">Special Occasion</option>
                    </select>
                  </div>
                </div>
              )}
              
              {/* Step 2: Contact Information */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <Users className="text-primary-500 w-5 h-5" />
                    Contact Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Full Name*
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Your name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Phone Number*
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                        placeholder="+41 123 456 789"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-gray-700 font-medium mb-2">
                        Email*
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Special Requests (optional)
                    </label>
                    <textarea
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleChange}
                      rows={3}
                      className="block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Allergies, dietary requirements, special occasions, etc."
                    />
                  </div>
                  
                  {/* Reservation summary */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Reservation Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Business:</span>
                        <span className="font-medium">{business.BUSINESS_NAME}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">{formData.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-medium">{formData.time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Party size:</span>
                        <span className="font-medium">
                          {formData.guests} {formData.guests === '1' ? 'Guest' : 'Guests'}
                        </span>
                      </div>
                      {formData.occasion && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Occasion:</span>
                          <span className="font-medium">{formData.occasion}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              <div className={`flex ${currentStep === 1 ? 'justify-end' : 'justify-between'} pt-4`}>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                )}
                
                {currentStep < 2 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md shadow-sm transition-colors"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md shadow-sm transition-colors disabled:opacity-70 flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <LoadingSpinner size="sm" color="white" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      'Complete Reservation'
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 