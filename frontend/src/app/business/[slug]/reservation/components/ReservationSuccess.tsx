import React from 'react';
import { BadgeCheck, Utensils, Calendar, Clock, Users } from 'lucide-react';
import { BusinessDetail } from '@/types/business.types';

interface ReservationSuccessProps {
  business: BusinessDetail;
  email?: string;
  date: string;
  time: string;
  guests: string;
  onBack: () => void;
}

const ReservationSuccess: React.FC<ReservationSuccessProps> = ({ business, email, date, time, guests, onBack }) => {
  return (
    <div className="bg-white rounded-lg shadow-xl p-8 text-center">
      <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <BadgeCheck className="h-10 w-10 text-success" />
      </div>
      <h2 className="text-3xl font-bold text-text-main mb-4">Reservation Confirmed!</h2>
      <div className="bg-background-card rounded-lg p-6 mb-6 inline-block mx-auto">
        <div className="text-left space-y-3">
          {business.BUSINESS_NAME && (
            <div className="flex items-center gap-3">
              <Utensils className="text-primary w-5 h-5" />
              <div>
                <p className="text-sm text-text-light">Business</p>
                <p className="font-medium">{business.BUSINESS_NAME}</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-3">
            <Calendar className="text-primary w-5 h-5" />
            <div>
              <p className="text-sm text-text-light">Date</p>
              <p className="font-medium">{date}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="text-primary w-5 h-5" />
            <div>
              <p className="text-sm text-text-light">Time</p>
              <p className="font-medium">{time}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Users className="text-primary w-5 h-5" />
            <div>
              <p className="text-sm text-text-light">Party Size</p>
              <p className="font-medium">{guests} {guests === '1' ? 'Guest' : 'Guests'}</p>
            </div>
          </div>
        </div>
      </div>
      {email && (
        <p className="text-text-muted mb-6">
          Thank you for your reservation. We have sent the details to {email}.
        </p>
      )}
      <button
        onClick={onBack}
        className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary-dark transition-colors"
      >
        Back to Business Page
      </button>
    </div>
  );
};

export default ReservationSuccess; 