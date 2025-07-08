import { visitor_food_journey_view } from "@prisma/client";
import Image from "next/image";
import React from "react";

interface FoodJourneyCardProps {
  journey: visitor_food_journey_view;
}

const getInitials = (name?: string) => {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const FoodJourneyCard: React.FC<FoodJourneyCardProps> = ({ journey }) => {
  const foodImages = [journey.PIC_1, journey.PIC_2, journey.PIC_4].filter(
    Boolean
  );

  return (
    <article
      className="rounded-2xl border border-accent bg-white shadow-lg p-5 flex flex-col h-full transition hover:shadow-xl focus-within:ring-2 focus-within:ring-primary"
      tabIndex={0}
      aria-label={`Food journey by ${journey.VISITOR_NAME || "Anonymous"}`}
    >
      {/* Visitor Info */}
      <div className="flex items-center gap-3 mb-4">
        {journey.VISITOR_PIC ? (
          <Image

            width={48}
            height={48}
            src={journey.VISITOR_PIC}
            alt={`Visitor ${journey.VISITOR_NAME}`}
            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
          />
        ) : (
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center border-2 border-gray-200">
            <span className="text-white font-semibold text-lg">
              {getInitials(journey.VISITOR_NAME)}
            </span>
          </div>
        )}
        <div className="flex-1">
          <h4 className="font-semibold text-primary text-base line-clamp-1">
            {journey.VISITOR_NAME || "Anonymous"}
          </h4>
          <p className="text-xs text-gray-500 line-clamp-1">
            {journey.RESTAURANT_NAME || "Unknown Restaurant"}
          </p>
        </div>
      </div>

      {/* Journey Title */}
      <h3 className="text-lg font-bold text-secondary mb-2 line-clamp-2">
        {journey.TITLE || "Untitled Journey"}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-700 mb-4 line-clamp-4">
        {journey.DESCRIPTION || "No description available."}
      </p>

      {/* Food Images */}
      <div className="flex flex-wrap gap-2 mt-auto">
        {foodImages.length > 0 ? (
          foodImages.map((pic, idx) => (
            <Image
              key={idx}
              src={pic as string}
              alt={`Food Journey Image ${idx + 1}`}
              title={`Image ${idx + 1}`}
              className="w-16 h-16 rounded object-cover border"
              loading="lazy"
              width={64}
              height={64}
            />
          ))
        ) : (
          <div className="w-full text-center text-xs text-gray-400 italic">
            No food pictures shared.
          </div>
        )}
      </div>
    </article>
  );
};

export default FoodJourneyCard;
