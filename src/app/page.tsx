"use client";

import BusinessCTA from "@/components/home/BusinessCTA";
import ShareExperience from "@/components/home/ShareExperience";
import BenefitsSection from "@/components/home/BenefitsSection";
// import AboutSection from "@/components/home/AboutSection";
// import TestimonialsSection from "@/components/home/TestimonialsSection";
import CtaSection from "@/components/home/CtaSection";
import FaqSection from "@/components/home/FaqSection";
import HeroSection from "@/components/home/HeroSection";
import FeaturedBusiness from "@/components/home/FeaturedBusiness";
import MapSection from "@/components/home/MapSection";
import QuickSearch from "@/components/home/QuickSearch";
import CitySection from "@/components/home/CitySection/index";

export default function Home() {
  return (
    <div className=" bg-white">
      {/* Hero Section with Search */}
      {/* <HeroSection /> */}

      {/* Featured Business Grid */}

      <FeaturedBusiness />

      {/* Business CTA */}
      <BusinessCTA />

      {/* Cities Section */}
      <CitySection/>

      {/* About Section - We Are Foodeez */}
      {/* <AboutSection /> */}

      {/* Testimonials from Google Reviews */}
      {/* <TestimonialsSection /> */}

      <QuickSearch />

      {/* Share Experience CTA */}
      <ShareExperience />

      {/* Benefits Section */}
      {/* <BenefitsSection />/ */}

      {/* FAQ Section */}
      <FaqSection />

      {/* Main CTA Section */}
      <CtaSection />


      {/* Map  Section */}
      {/* <MapSection /> */}


    </div>
  );
}

/*


Proper Started 5 April

From 5 - 2028 April No record

28 April 3 hours

29 April 1.5 hour

30 April 3.5 hour

1 May 3 hours

2 May 1 hour

3 May 2.5 hour

4 May 2 hour

5 May No work

6 May 4 hours

9 - 25 May No Work

26 May 5.5 Hours 

27 May 3 hours



*/
