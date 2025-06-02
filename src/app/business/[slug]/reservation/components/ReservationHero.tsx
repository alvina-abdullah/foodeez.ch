import { BusinessDetail } from "@/types/business.types";
import React from "react";

interface ReservationHeroProps {
  business: BusinessDetail
}

const ReservationHero: React.FC<ReservationHeroProps> = ({ business }) => {
  return (
    <div className="text-center my-12">
      <h1 className="main-heading">Reserve Table</h1>
      <p className="main-heading-description">
        Reserve your table at {business.BUSINESS_NAME}
      </p>
    </div>
  );
};

export default ReservationHero;
