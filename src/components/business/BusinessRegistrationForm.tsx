'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '../core/Input';
import Button from '../core/Button';

interface FormData {
  businessName: string;
  shortName: string;
  description: string;
  addressStreet: string;
  addressZip: string;
  addressCity: string;
  addressTown: string;
  addressCountry: string;
  phoneNumber: string;
  phoneNumberShort: string;
  whatsappNumber: string;
  webAddress: string;
  facebookLink: string;
  instaLink: string;
  tiktokLink: string;
  googleProfile: string;
  imageUrl: string;
}

const initialFormData: FormData = {
  businessName: '',
  shortName: '',
  description: '',
  addressStreet: '',
  addressZip: '',
  addressCity: '',
  addressTown: '',
  addressCountry: '',
  phoneNumber: '',
  phoneNumberShort: '',
  whatsappNumber: '',
  webAddress: '',
  facebookLink: '',
  instaLink: '',
  tiktokLink: '',
  googleProfile: '',
  imageUrl: '',
};

export default function BusinessRegistrationForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user types
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }
    
    if (!formData.addressStreet.trim()) {
      newErrors.addressStreet = 'Street address is required';
    }
    
    if (!formData.addressZip.trim()) {
      newErrors.addressZip = 'ZIP code is required';
    }
    
    if (!formData.addressTown.trim()) {
      newErrors.addressTown = 'Town/City is required';
    }
    
    if (!formData.addressCountry.trim()) {
      newErrors.addressCountry = 'Country is required';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // Convert form data to match API format
      const apiData = {
        BUSINESS_NAME: formData.businessName,
        SHORT_NAME: formData.shortName,
        DESCRIPTION: formData.description,
        ADDRESS_STREET: formData.addressStreet,
        ADDRESS_ZIP: formData.addressZip ? parseInt(formData.addressZip) : null,
        ADDRESS_CITY_ID: formData.addressCity ? parseInt(formData.addressCity) : null,
        ADDRESS_TOWN: formData.addressTown,
        ADDRESS_COUNTRY: formData.addressCountry,
        PHONE_NUMBER: formData.phoneNumber,
        PHONE_NUMBER_SHORT: formData.phoneNumberShort,
        WHATSAPP_NUMBER: formData.whatsappNumber,
        WEB_ADDRESS: formData.webAddress,
        FACEBOOK_LINK: formData.facebookLink,
        INSTA_LINK: formData.instaLink,
        TIKTOK_LINK: formData.tiktokLink,
        GOOGLE_PROFILE: formData.googleProfile,
        IMAGE_URL: formData.imageUrl,
      };
      
      // Make API call to register business
      const response = await fetch('/api/business/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(apiData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to register business');
      }
      
      setSubmitSuccess(true);
      
      // Redirect after successful submission
      setTimeout(() => {
        router.push('/businesses');
      }, 2000);
      
    } catch (error) {
      console.error('Error registering business:', error);
      setSubmitError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="bg-green-50 p-6 rounded-lg text-center">
        <h2 className="text-2xl font-bold text-green-700 mb-4">Registration Successful!</h2>
        <p className="text-green-600 mb-6">
          Your business has been submitted for review. You will be redirected shortly.
        </p>
        <Button 
          variant="primary"
          onClick={() => router.push('/businesses')}
        >
          Go to Businesses
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {submitError && (
        <div className="bg-red-50 p-4 rounded-md text-red-600">
          {submitError}
        </div>
      )}
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold text-secondary-900 mb-6">Basic Information</h3>
        
        <div className="space-y-4">
          <div>
            <Input
              label="Business Name"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              required
              error={errors.businessName}
            />
          </div>
          
          <div>
            <Input
              label="Short Name (for display)"
              name="shortName"
              value={formData.shortName}
              onChange={handleChange}
              maxLength={20}
              helperText="Max 20 characters"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-secondary-900 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              maxLength={1000}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-500"
              required
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
            <p className="mt-1 text-xs text-secondary-500">
              {1000 - formData.description.length} characters remaining
            </p>
          </div>
          
          <div>
            <Input
              label="Image URL"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/your-image.jpg"
            />
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold text-secondary-900 mb-6">Location</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="Street Address"
              name="addressStreet"
              value={formData.addressStreet}
              onChange={handleChange}
              required
              error={errors.addressStreet}
            />
          </div>
          
          <div>
            <Input
              label="ZIP Code"
              name="addressZip"
              value={formData.addressZip}
              onChange={handleChange}
              required
              error={errors.addressZip}
            />
          </div>
          
          <div>
            <Input
              label="Town/City"
              name="addressTown"
              value={formData.addressTown}
              onChange={handleChange}
              required
              error={errors.addressTown}
            />
          </div>
          
          <div>
            <Input
              label="Country"
              name="addressCountry"
              value={formData.addressCountry}
              onChange={handleChange}
              required
              error={errors.addressCountry}
            />
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold text-secondary-900 mb-6">Contact Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              error={errors.phoneNumber}
            />
          </div>
          
          <div>
            <Input
              label="Short Phone Number (optional)"
              name="phoneNumberShort"
              value={formData.phoneNumberShort}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Input
              label="WhatsApp Number (optional)"
              name="whatsappNumber"
              value={formData.whatsappNumber}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Input
              label="Website URL (optional)"
              name="webAddress"
              value={formData.webAddress}
              onChange={handleChange}
              placeholder="https://yourbusiness.com"
            />
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold text-secondary-900 mb-6">Social Media</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="Facebook URL (optional)"
              name="facebookLink"
              value={formData.facebookLink}
              onChange={handleChange}
              placeholder="https://facebook.com/yourbusiness"
            />
          </div>
          
          <div>
            <Input
              label="Instagram URL (optional)"
              name="instaLink"
              value={formData.instaLink}
              onChange={handleChange}
              placeholder="https://instagram.com/yourbusiness"
            />
          </div>
          
          <div>
            <Input
              label="TikTok URL (optional)"
              name="tiktokLink"
              value={formData.tiktokLink}
              onChange={handleChange}
              placeholder="https://tiktok.com/@yourbusiness"
            />
          </div>
          
          <div>
            <Input
              label="Google Business Profile (optional)"
              name="googleProfile"
              value={formData.googleProfile}
              onChange={handleChange}
              placeholder="https://g.page/yourbusiness"
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-4">
        <Button
          variant="secondary"
          onClick={() => router.back()}
          type="button"
        >
          Cancel
        </Button>
        
        <Button
          variant="primary"
          type="submit"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Register Business
        </Button>
      </div>
    </form>
  );
} 