// import Link from "next/link";
// import { TrendingUp, ArrowRight } from "lucide-react";

export default function BusinessCTA() {
  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat py-20 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage:
          'url("https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1600&q=80")',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0" />

      <div className="relative z-10 max-w-3xl mx-auto text-center text-white">
        {/* Badge */}
        {/* <div className="inline-flex items-center justify-center p-2 bg-white rounded-full shadow-md mb-6">
          <TrendingUp className="w-5 h-5 text-accent mr-2" />
          <span className="text-sm font-semibold text-text-main">
            For Restaurant Owners
          </span>
        </div> */}

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
          Ready to boost your restaurant's visibility?
        </h2>

        {/* Subtext */}
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 mb-8">
          Join thousands of restaurants on Foodeez and connect with hungry
          customers looking for their next favorite meal.
        </p>

        {/* Buttons */}
        {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/business/register" className="btn-primary">
            Add Your Restaurant
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>

          <Link
            href="/pricing"
            className="inline-flex items-center justify-center px-6 py-3 border border-white rounded-full text-base font-medium text-white hover:bg-white/10 transition"
          >
            View Pricing Plans
          </Link>
        </div> */}

        <p className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
          Coming Soon
        </p>
      </div>
    </section>
  );
}
