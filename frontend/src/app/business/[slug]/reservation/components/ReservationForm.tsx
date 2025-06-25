import React from 'react';
import { Calendar, Clock, Users, CalendarClock } from 'lucide-react';

interface ReservationFormProps {
  businessName: string;
  formData: any;
  setFormData: (fn: (prev: any) => any) => void;
  currentStep: number;
  setCurrentStep: (fn: (prev: number) => number) => void;
  isSubmitting: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  children?: React.ReactNode;
}

const ReservationForm: React.FC<ReservationFormProps> = ({
  formData,
  setFormData,
  currentStep,
  setCurrentStep,
  isSubmitting,
  handleSubmit,
  children,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => Math.max(1, prev - 1));

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Step 1: Reservation Details */}
      {currentStep === 1 && (
        <div className="space-y-8">
          <h2 className="text-xl font-semibold text-text-main flex items-center gap-2">
            <CalendarClock className="text-primary w-5 h-5" />
            Reservation Details
          </h2>
          <div className="flex flex-col gap-4 md:gap-6">
            {/* Date Selection */}
            <div className="w-full">
              <label className="block text-text-main font-medium mb-2">Date*</label>
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
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition"
                />
              </div>
            </div>
            {/* Time Selection */}
            <div className="w-full">
              <label className="block text-text-main font-medium mb-2">Time*</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  name="time"
                  required
                  value={formData.time}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition"
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
            <div className="w-full">
              <label className="block text-text-main font-medium mb-2">No of Persons*</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  name="guests"
                  required
                  value={formData.guests}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition"
                >
                  {[1,2,3,4,5,6,7,8,9,10].map(num => (
                    <option key={num} value={num.toString()}>{num} {num === 1 ? 'Person' : 'Persons'}</option>
                  ))}
                  <option value="11">More than 10</option>
                </select>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-text-main font-medium mb-2">Reservation For</label>
            <select
              name="occasion"
              value={formData.occasion}
              onChange={handleChange}
              className="block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition"
              required
            >
              <option value="">Select an occasion</option>
              <option value="Birthday">Birthday</option>
              <option value="Anniversary">Anniversary</option>
              <option value="Business Meal">Business Meal</option>
              <option value="Date">Date</option>
              <option value="Special Occasion">Special Occasion</option>
            </select>
          </div>
          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white font-medium rounded-md shadow-sm transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}
      {/* Step 2: Contact Information */}
      {currentStep === 2 && (
        <div className="space-y-8">
          <h2 className="text-xl font-semibold text-text-main flex items-center gap-2">
            <Users className="text-primary w-5 h-5" />
            Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-text-main font-medium mb-2">Full Name*</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-text-main font-medium mb-2">Phone Number*</label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition"
                placeholder="+41 123 456 789"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-text-main font-medium mb-2">Email*</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition"
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-text-main font-medium mb-2">Special Requests (optional)</label>
            <textarea
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleChange}
              rows={3}
              className="block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition"
              placeholder="Allergies, dietary requirements, special occasions, etc."
            />
          </div>
          {children}
          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={prevStep}
              className="px-4 py-2 border border-gray-300 rounded-md text-text-main hover:bg-background-muted transition-colors mr-2"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white font-medium rounded-md shadow-sm transition-colors disabled:opacity-70"
            >
              {isSubmitting ? 'Processing...' : 'Complete Reservation'}
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default ReservationForm; 