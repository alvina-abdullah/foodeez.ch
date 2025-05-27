"use client";

import ComingSoon from "../ui/comingsoon";

// import Link from "next/link";

export default function ShareExperience() {
  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat py-20 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage:
          'url("https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1600&q=80")',
      }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-primary/50 to-accent-light/40 backdrop-blur-sm z-0" />

      <div className="relative z-10 max-w-3xl mx-auto text-center text-white">
        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
          Share Your Food Journey
        </h2>

        {/* Subtext */}
        <p className="text-lg sm:text-xl text-white/90 mb-8">
          Inspire food lovers by reviewing your favorite meals, hidden gems, and
          dining experiences across the city.
        </p>

        {/* Button */}
        {/* <Link
          href="/(auth)/login"
          className="inline-block bg-white border border-white/20 px-6 py-3 rounded-full font-medium text-primary-600 hover:bg-white/90 transition"
        >
          Login or Sign Up
        </Link> */}

       <ComingSoon color="text-white"/>
      </div>
    </section>
  );
}
