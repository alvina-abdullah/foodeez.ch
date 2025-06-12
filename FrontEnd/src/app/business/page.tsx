"use client";

import ComingSoon from "@/components/ui/comingsoon";
import React from "react";

export default function BusinessesPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="">
        <div className="text-center mb-12">
          <h1 className="main-heading">Browse All Businesses</h1>
          <p className="main-heading-description">
            Discover amazing food businesses that can satisfy your cravings and
            culinary curiosity.
          </p>
        </div>

        <ComingSoon size="6xl" />
      </div>
    </div>
  );
}
