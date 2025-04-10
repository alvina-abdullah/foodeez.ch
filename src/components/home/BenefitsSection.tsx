'use client';

import { Award, ShieldCheck, Gift, Check } from 'lucide-react';
import Link from 'next/link';

interface BenefitProps {
  icon: React.ReactNode;
  title: string;
  items: string[];
}

function BenefitCard({ icon, title, items }: BenefitProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-center mb-4">
        <div className="text-orange-500 w-12 h-12">
          {icon}
        </div>
      </div>
      <h3 className="text-lg font-bold text-secondary-900 mb-3 text-center">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start">
            <Check size={16} className="text-green-600 mt-1 flex-shrink-0 mr-2" />
            <span className="text-sm text-gray-700">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function BenefitsSection() {
  return (
    <section className="py-12 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BenefitCard 
            icon={<Award size={48} />}
            title="Treueprogramme"
            items={[
              "Sammle Stempel und erfahre mehr über Gewinnspiele, Rabatte, Neuigkeiten und mehr über unsere Newsletter und Sozialen Medien"
            ]}
          />
          
          <BenefitCard 
            icon={<ShieldCheck size={48} />}
            title="Unsere Garantie"
            items={[
              "Ausgezeichneter Service",
              "Echte Kundenbewertungen",
              "Die grösste Auswahl an Restaurants in der Schweiz."
            ]}
          />
          
          <BenefitCard 
            icon={<Gift size={48} />}
            title="Deine Vorteile"
            items={[
              "Wähle Dein Essen von mehr als 5.000 Partner aus",
              "Bezahle online oder in bar",
              "Bestell wann, wo und wie Du willst"
            ]}
          />
        </div>
      </div>
    </section>
  );
} 