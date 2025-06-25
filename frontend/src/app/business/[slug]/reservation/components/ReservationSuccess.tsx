import React from 'react';
import { BadgeCheck, Utensils, Calendar, Clock, Users } from 'lucide-react';
import { BusinessDetail } from '@/types/business.types';

// Helper component for consistent detail rows
interface DetailRowProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

const DetailRow: React.FC<DetailRowProps> = ({ icon, label, value }) => (
  <div className="flex items-center gap-3">
    <div className="text-primary w-5 h-5 flex-shrink-0">{icon}</div> {/* Ensure icon doesn't shrink */}
    <div>
      <p className="text-sm text-text-light">{label}</p>
      <p className="font-medium text-text-dark">{value}</p> {/* Added text-text-dark for contrast */}
    </div>
  </div>
);

interface ReservationSuccessProps {
  business: BusinessDetail;
  email?: string;
  date: string;
  time: string;
  guests: string;
  onBack: () => void;
}

const ReservationSuccess: React.FC<ReservationSuccessProps> = ({ business, email, date, time, guests, onBack }) => {
  const partySizeText = `${guests} ${guests === '1' ? 'Guest' : 'Guests'}`;

  return (
    <div className="text-center p-4 sm:p-6 md:p-8"> {/* Added padding for better spacing on smaller screens */}
      <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-fade-in-up"> {/* Larger, animated icon */}
        <BadgeCheck className="h-12 w-12 text-success" />
      </div>

      <h2 className="sub-heading mb-4 text-3xl font-bold">Reservation Confirmed!</h2> {/* Larger, bolder heading */}
      <p className="sub-heading-description text-md mb-8 text-gray-600">
        Your booking for {business.BUSINESS_NAME} is all set.
      </p>

      <div className="bg-background-card rounded-xl shadow-lg p-6 lg:p-10 my-8 max-w-md mx-auto transform hover:scale-[1.01] transition-transform duration-200"> {/* Enhanced card styling */}
        <div className="text-left space-y-5"> {/* Increased vertical spacing */}
          {business.BUSINESS_NAME && (
            <DetailRow
              icon={<Utensils />}
              label="Business"
              value={business.BUSINESS_NAME}
            />
          )}
          <DetailRow
            icon={<Calendar />}
            label="Date"
            value={date}
          />
          <DetailRow
            icon={<Clock />}
            label="Time"
            value={time}
          />
          <DetailRow
            icon={<Users />}
            label="Party Size"
            value={partySizeText}
          />
        </div>
      </div>

      {email && (
        <p className="sub-heading-description mb-10 text-lg text-gray-700"> {/* Slightly larger text for email confirmation */}
          Thank you for your reservation! We've sent a confirmation to <span className="font-semibold text-primary">{email}</span>.
        </p>
      )}

      <button
        onClick={onBack}
        className="btn-primary w-full sm:w-auto px-8 py-3 text-lg" // Wider button, larger text
      >
        Back to Business Page
      </button>
    </div>
  );
};

export default ReservationSuccess;