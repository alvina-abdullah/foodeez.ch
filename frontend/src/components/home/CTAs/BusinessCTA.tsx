import Banner from "@/components/core/Banner";
import Link from "next/link";
import React from "react";

const ShareExperience = () => {
  return (
    <section className="w-full text-center">
      {/* Banner */}
      <div className="w-full overflow-hidden">
        <Banner
          src="/images/banners/CTAs/registerCTA.png"
          alt="Register you business"
        />
      </div>

      {/* CTA Button Below Banner */}
      <div className="mt-12">
        <Link href="/business/register" passHref>
          <button className="px-6 sm:px-8 py-3 rounded-full bg-primary text-white font-semibold shadow-lg hover:bg-secondary transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            Register Now
          </button>
        </Link>
      </div>
    </section>
  );
};

export default ShareExperience;
