"use client";

import { useState, useEffect } from "react";
import { getUpcomingEvents } from "@/services/HomePageService";
import { upcoming_events } from "@prisma/client";
import EventCard from "./EventCard";

export default function UpcomingEvents() {
  const [events, setEvents] = useState<upcoming_events[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const upcomingEvents = await getUpcomingEvents();

        // Fill up to 4 events with "Coming Soon" placeholders
        const placeholders = Array(Math.max(0, 4 - upcomingEvents.length))
          .fill(null)
          .map((_, index) => ({
            UPCOMING_EVENTS_ID: -1 - index, // Negative ID for placeholder
            EVENT_TITLE: "Coming Soon",
            EVENT_DATE_FROM: new Date(
              new Date().setMonth(new Date().getMonth() + 1 + index)
            ), // Future dates
            EVENT_TIME_FROM: "00:00",
            ADDRESS_STREET: "Richtiplatz 3",
            ADDRESS_ZIPCODE: "8304",
            ADDRESS_TOWN: "Wallisellen (Zürich)",
            EVENT_DESCRIPTION: "",
            CREATION_DATETIME: null,
            EVENT_DATE_TO: null,
            EVENT_TIME_TO: null,
            ADDRESS_CITY: null,
            ADDRESS_HOUSE_NO: null,
          }));

        setEvents([...upcomingEvents, ...placeholders]);
      } catch (error) {
        console.error("Failed to fetch events", error);
        // Set 4 placeholders on error
        const placeholders = Array(4)
          .fill(null)
          .map((_, index) => ({
            UPCOMING_EVENTS_ID: -1 - index,
            EVENT_TITLE: "Coming Soon",
            EVENT_DATE_FROM: new Date(
              new Date().setMonth(new Date().getMonth() + 1 + index)
            ),
            EVENT_TIME_FROM: "00:00",
            ADDRESS_STREET: "Richtiplatz 3",
            ADDRESS_ZIPCODE: "8304",
            ADDRESS_TOWN: "Wallisellen (Zürich)",
            EVENT_DESCRIPTION: "",
            CREATION_DATETIME: null,
            EVENT_DATE_TO: null,
            EVENT_TIME_TO: null,
            ADDRESS_CITY: null,
            ADDRESS_HOUSE_NO: null,
          }));
        setEvents(placeholders);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <section className="py-16">
        <div className="px-4">
          <h2 className="sub-heading text-center mb-10">Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="flex items-start gap-6 bg-gray-200 p-6 rounded-xl animate-pulse"
                  aria-hidden="true"
                >
                  {/* Image Placeholder */}
                  <div className="h-24 w-24 bg-gray-400 rounded-lg flex-shrink-0" />

                  {/* Text Placeholder */}
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-gray-300 rounded w-3/4" />
                    <div className="h-4 bg-gray-300 rounded w-full" />
                    <div className="h-4 bg-gray-300 rounded w-5/6" />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
    );
  }

  if (!events.length) {
    return null; // Don't render section if there are no events and not loading
  }

  return (
    <section className="py-16 bg-background text-primary">
      <div className="container mx-auto px-4">
        <h2 className="main-heading text-center mb-10">Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map((event) => (
            <EventCard key={event.UPCOMING_EVENTS_ID} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
}
