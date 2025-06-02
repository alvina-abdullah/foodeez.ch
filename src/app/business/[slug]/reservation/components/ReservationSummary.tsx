import { BusinessDetail } from '@/types/business.types';
import React from 'react';

interface ReservationSummaryProps {
  business: BusinessDetail;
  date: string;
  time: string;
  guests: string;
  occasion?: string;
}

const ReservationSummary: React.FC<ReservationSummaryProps> = ({ business, date, time, guests, occasion }) => {
  return (
    <div className="bg-background-card rounded-lg p-4 border border-background-muted">
      <h3 className="text-lg font-medium text-text-main mb-3">Reservation Summary</h3>
      <div className="space-y-2 text-sm">
        {business.BUSINESS_NAME && (
          <div className="flex justify-between">
            <span className="text-text-muted">Business:</span>
            <span className="font-medium">{business.BUSINESS_NAME}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-text-muted">Date:</span>
          <span className="font-medium">{date}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">Time:</span>
          <span className="font-medium">{time}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">Party size:</span>
          <span className="font-medium">{guests} {guests === '1' ? 'Guest' : 'Guests'}</span>
        </div>
        {occasion && (
          <div className="flex justify-between">
            <span className="text-text-muted">Occasion:</span>
            <span className="font-medium">{occasion}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationSummary; 