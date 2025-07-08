"use client";

import { business_detail_view_all } from "@prisma/client";
import Image from "next/image";

interface MenuHeroSectionProps {
  business: business_detail_view_all | null;
}

export default function MenuHeroSection({ business }: MenuHeroSectionProps) {
  return (
    <section className="relative bg-gradient-to-br from-primary-light via-primary to-primary-dark text-white py-16 px-4 sm:px-8 text-center overflow-hidden">
      {/* Decorative overlay */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,_rgba(255,255,255,0)_40%,rgba(0,0,0,0.2)_100%)] pointer-events-none" />

      {/* Circle image */}
      <div className="relative mx-auto w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-8 border-white shadow-lg">
        {business?.IMAGE_URL && (
          <Image
            src={business.IMAGE_URL}
            alt={`${business.BUSINESS_NAME} logo`}
            width={200}
            height={200}
            className="object-cover w-full h-full"
            priority
          />
        )}
        {!business?.IMAGE_URL && (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image Available
          </div>
        )}
      </div>

      {/* Main content */}
      <h1 className="mt-6 text-4xl sm:text-5xl font-extrabold">
        {business?.BUSINESS_NAME} – Menu
      </h1>
      <p className="mt-2 text-lg max-w-xl mx-auto">{business?.DESCRIPTION}</p>
    </section>
  );
}
