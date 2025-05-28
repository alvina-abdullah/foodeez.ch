import React from "react";
import type { BusinessData } from "../page";
import Image from "next/image";

interface ReservationImageProps {
  business: BusinessData;
}

const ReservationImage: React.FC<ReservationImageProps> = ({ business }) => {
  if (!business.IMAGE_URL) {
    return (
      <div className="w-full h-64 md:h-[800px] rounded-xl overflow-hidden shadow mb-6 md:mb-0 bg-background-card flex items-center justify-center text-text-light">
        No image available
      </div>
    );
  }
  return (
    <div className="w-full h-64 md:h-[800px] flex items-center justify-center rounded-xl shadow">
      <Image
        src={business.IMAGE_URL}
        alt={business.BUSINESS_NAME || "Reservation"}
        width={1000}
        height={1000}
        className="object-cover w-full h-full rounded-xl"
        priority
      />
    </div>
  );
};

export default ReservationImage;
