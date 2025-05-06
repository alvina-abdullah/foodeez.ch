// components/OpeningHours.tsx
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { setHours, setMinutes, isWithinInterval } from 'date-fns';
import { Clock } from 'lucide-react';

// Type Definitions
type OpeningHoursItem = {
  day: string;
  hours: string;
};

type OpeningHoursProps = {
  openingHours: OpeningHoursItem[];
};

const OpeningHours: React.FC<OpeningHoursProps> = ({ openingHours }) => {
  const [isBusinessOpenNow, setIsBusinessOpenNow] = useState(false);
  const currentDay = format(new Date(), 'EEEE'); // Get current day as full name

  // Update the open/close status
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      
      // Example: open from 10:00 to 22:00, can customize this logic
      const openTime = setHours(setMinutes(new Date(), 0), 10); // 10:00 AM
      const closeTime = setHours(setMinutes(new Date(), 0), 22); // 10:00 PM
      
      setIsBusinessOpenNow(isWithinInterval(now, { start: openTime, end: closeTime }));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  return (
    <div className="mb-6">
      <div className="p-4 bg-white shadow-lg rounded-lg">
        {/* Title Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Clock className="mr-2 h-6 w-6 text-primary" />
            <h2 className="text-lg font-semibold text-primary">Opening Hours</h2>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              isBusinessOpenNow ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {isBusinessOpenNow ? 'Open Now' : 'Closed'} • {format(new Date(), 'hh:mm a')}
          </div>
        </div>

        {/* Opening Hours List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {openingHours?.map((item, index) => (
            <div
              key={index}
              className={`flex justify-between items-center p-3 rounded-lg border ${
                item.day === currentDay ? 'bg-blue-50 border-blue-300' : 'border-gray-200'
              }`}
            >
              <span className={`font-medium ${item.day === currentDay ? 'text-primary' : 'text-gray-700'}`}>
                {item.day}
              </span>
              <span className="text-gray-600">{item.hours}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OpeningHours;
