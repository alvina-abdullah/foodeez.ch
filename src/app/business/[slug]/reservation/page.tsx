'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { extractBusinessId, parseSlug } from '@/lib/utils/genSlug';
import LoadingSpinner from '@/components/core/LoadingSpinner';
import { getBusinessById } from '@/lib/db';
import ReservationHero from './components/ReservationHero';
import ContactInfoCard from './components/ContactInfoCard';
import ReservationImage from './components/ReservationImage';
import ReservationForm from './components/ReservationForm';
import ReservationSummary from './components/ReservationSummary';
import ReservationSuccess from './components/ReservationSuccess';

export interface BusinessData {
  BUSINESS_ID: number;
  BUSINESS_NAME?: string;
  SHORT_NAME?: string;
  DESCRIPTION?: string;
  ADDRESS_STREET?: string;
  ADDRESS_ZIP?: bigint;
  ADDRESS_TOWN?: string;
  ADDRESS_CITY_ID?: number;
  CITY_CODE?: string;
  CITY_NAME?: string;
  ADDRESS_COUNTRY?: string;
  PHONE_NUMBER?: string;
  WHATSAPP_NUMBER?: string;
  WEB_ADDRESS?: string;
  LOGO?: string;
  FACEBOOK_LINK?: string;
  INSTA_LINK?: string;
  TIKTOK_LINK?: string;
  GOOGLE_PROFILE?: string;
  IMAGE_URL?: string;
  GOOGLE_RATING?: string;
  APPROVED?: number;
  STATUS?: number;
  Ranking?: bigint;
}

export default function ReservationPage() {
  const params = useParams();
  const slug = params.slug as string;
  const parsedId = parseSlug(slug);
  const businessId = extractBusinessId(slug);

  const [business, setBusiness] = useState<any>();
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

  // Meta data
  const title = business.BUSINESS_NAME ? `Reserve a Table at ${business.BUSINESS_NAME} | Foodeez` : 'Reserve a Table | Foodeez';
  const description = business.DESCRIPTION ? `Reserve your table at ${business.BUSINESS_NAME} on Foodeez. ${business.DESCRIPTION}` : `Reserve your table at ${business.BUSINESS_NAME} on Foodeez.`;
  const image = business.IMAGE_URL || '/reservation-default.jpg';
  const url = typeof window !== 'undefined' ? window.location.href : '';

  if (isSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <ReservationSuccess
          business={business}
          email={formData.email}
          date={formData.date}
          time={formData.time}
          guests={formData.guests}
          onBack={() => window.location.href = `/business/${slug}`}
        />
      </div>
    );
  }

  return (
    <>
      <head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
        <link rel="canonical" href={url} />
      </head>
      <div className="bg-background min-h-screen py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="mb-6">
            <Link
              href={`/business/${slug}`}
              className="inline-flex items-center text-primary hover:text-primary-dark"
            >
              <ChevronLeft size={16} className="mr-1" />
              Back to {business.BUSINESS_NAME}
            </Link>
          </div>
          <ReservationHero business={business} />
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left: Image */}
            <div className="md:w-1/2 w-full flex flex-col gap-6">
              <ReservationImage business={business} />
            </div>
            {/* Right: Contact Info & Form */}
            <div className="md:w-1/2 w-full flex flex flex-col">
              <ContactInfoCard business={business} />
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 md:p-8">
                  <ReservationForm
                    businessName={business.BUSINESS_NAME}
                    formData={formData}
                    setFormData={setFormData}
                    currentStep={currentStep}
                    setCurrentStep={setCurrentStep}
                    isSubmitting={isSubmitting}
                    handleSubmit={handleSubmit}
                  >
                    {currentStep === 2 && (
                      <ReservationSummary
                        business={business}
                        date={formData.date}
                        time={formData.time}
                        guests={formData.guests}
                        occasion={formData.occasion}
                      />
                    )}
                  </ReservationForm>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 