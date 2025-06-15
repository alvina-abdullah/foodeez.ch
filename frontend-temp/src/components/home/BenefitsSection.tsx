'use client';

import { Award, ShieldCheck, Gift, Check } from 'lucide-react';

interface BenefitProps {
  icon: React.ReactNode;
  title: string;
  items: string[];
}

function BenefitCard({ icon, title, items }: BenefitProps) {
  return (
    <div className="bg-white/80  backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
      <div className="flex justify-center mb-4">
        <div className="text-orange-500 bg-orange-100 rounded-full p-3">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-semibold text-center text-gray-900  mb-4">
        {title}
      </h3>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex items-start text-gray-700 text-sm">
            <Check size={18} className="text-green-600 mt-1 mr-2 flex-shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function BenefitsSection() {
  return (
    <section
      className="py-16 px-4 sm:px-6 lg:px-8 "
    >
      <div className="max-w-7xl mx-auto">
        {/* <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 ">
            Why Choose Foodeez?
          </h2>
          <p className="mt-2 text-gray-700  text-lg max-w-2xl mx-auto">
            We go the extra mile to bring you the best experience in food delivery and discovery.
          </p>
        </div> */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <BenefitCard 
            icon={<Award size={36} />}
            title="Loyalty Programs"
            items={[
              "Collect stamps & rewards",
              "Get notified about contests & discounts",
              "Stay updated via newsletter & social media"
            ]}
          />
          
          <BenefitCard 
            icon={<ShieldCheck size={36} />}
            title="Our Guarantee"
            items={[
              "Outstanding customer service",
              "Real reviews you can trust",
              "Switzerland’s largest restaurant network"
            ]}
          />
          
          <BenefitCard 
            icon={<Gift size={36} />}
            title="Your Benefits"
            items={[
              "Browse 5,000+ partner restaurants",
              "Pay with card or cash",
              "Order wherever and whenever you want"
            ]}
          />
        </div>
      </div>
    </section>
  );
}
