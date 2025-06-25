"use client";
import { upcoming_events } from "@prisma/client";
import { Calendar, Clock, MapPin } from "lucide-react";

interface EventCardProps {
  event: upcoming_events;
}

const formatDate = (date: Date | null) => {
  if (!date) return { day: "00", month: "N/A" };
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("default", { month: "short" });
  return { day, month };
};

export default function EventCard({ event }: EventCardProps) {
  const { day, month } = formatDate(event.EVENT_DATE_FROM);
  const location = `${event.ADDRESS_STREET || ""}, ${event.ADDRESS_ZIPCODE || ""} ${event.ADDRESS_TOWN || ""}`;

  return (
    <div className="flex items-center p-6 rounded-lg border border-accent border-dashed">
      <div className="flex-shrink-0 text-center mr-6">
        <div className="bg-background-card border-2 rounded-lg w-20 h-20 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-secondary">{day}</span>
          <span className="text-md text-text-main">{month}</span>
        </div>
      </div>
      <div className="flex-1">
        <h3 className="text-2xl font-bold text-secondary mb-2">
          {event.EVENT_TITLE}
        </h3>
        <div className="flex items-center text-text-main text-sm mb-3">
          <Clock size={16} className="mr-2" />
          <span>{event.EVENT_TIME_FROM}</span>
          <MapPin size={16} className="mr-2 ml-4" />
          <span>{location}</span>
        </div>
        <p className="text-text-main text-sm mb-4">{event.EVENT_DESCRIPTION}</p>
        <button className="bg-primary text-white font-semibold py-2 px-4 rounded-lg flex items-center hover:bg-primary-dark transition-colors">
          Add to calendar
          <Calendar size={16} className="ml-2" />
        </button>
      </div>
    </div>
  );
}
