import React from 'react';
import { MapPin, Phone, Globe } from 'lucide-react';
import type { BusinessData } from '../page';

interface ContactInfoCardProps {
  business: BusinessData;
}

const ContactInfoCard: React.FC<ContactInfoCardProps> = ({ business }) => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-text-main mb-4">Contact Information</h2>
      <ul className="space-y-3">
        {business.ADDRESS_STREET && (
          <li className="flex items-center gap-3 text-text-muted">
            <MapPin className="text-primary w-5 h-5" />
            <span>{business.ADDRESS_STREET}</span>
          </li>
        )}
        {business.PHONE_NUMBER && (
          <li className="flex items-center gap-3 text-text-muted">
            <Phone className="text-primary w-5 h-5" />
            <span>{business.PHONE_NUMBER}</span>
          </li>
        )}
        {business.WEB_ADDRESS && (
          <li className="flex items-center gap-3 text-text-muted">
            <Globe className="text-primary w-5 h-5" />
            <span>{business.WEB_ADDRESS}</span>
          </li>
        )}
        {!business.ADDRESS_STREET && !business.PHONE_NUMBER && !business.WEB_ADDRESS && (
          <li className="text-text-light">No contact information provided.</li>
        )}
      </ul>
    </div>
  );
};

export default ContactInfoCard;
