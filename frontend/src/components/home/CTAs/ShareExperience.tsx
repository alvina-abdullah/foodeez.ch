import Banner from "@/components/core/Banner";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { getFoodJourney } from "@/services/HomePageService";
import FoodJourneyCard from "../FoodJourneyCard";
import { visitor_food_journey_view } from "@prisma/client";

const ShareExperience = () => {
  const [journeys, setJourneys] = useState<visitor_food_journey_view[]>([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    async function fetchJourneys() {
      const data = await getFoodJourney();
      setJourneys(data);
      setHasMore(data.length === 5); // If 5, there may be more
    }
    fetchJourneys();
  }, []);

  return (
    <section className=" w-full text-center">
      {/* Banner */}

      <Banner
        src="/images/banners/CTAs/shareExperiance.png"
        alt="Share Your Experience"
      />

      {/* CTA Button Below Banner */}
      <div className="mt-12 mb-8">
        <Link href="/share-experience" passHref>
          <button className="px-6 sm:px-8 py-3 rounded-full bg-primary text-white font-semibold shadow-lg hover:bg-secondary transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            Share Now
          </button>
        </Link>
      </div>

      {/* Top Food Journey Stories */}
      <div className="px-4 lg:px-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
        {journeys.map((j) => (
          <FoodJourneyCard key={j.VISITOR_FOOD_JOURNEY_ID} journey={j} />
        ))}
      </div>
      {hasMore && (
        <Link href="/share-experience#stories" passHref>
          <button className="btn-primary">
            See More Food Journey Stories
          </button>
        </Link>
      )}
    </section>
  );
};

export default ShareExperience;
