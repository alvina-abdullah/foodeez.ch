'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, Star, BarChart3, Award } from 'lucide-react';

// Partner logo data
const partnerLogos = [
  {
    name: 'Wirtschafts Woche',
    src: '/images/partners/wirtschaftswoche.png',
    alt: 'Wirtschafts Woche logo'
  },
  {
    name: 'Network Karriere',
    src: '/images/partners/network-karriere.png',
    alt: 'Network Karriere logo'
  },
  {
    name: 'Gründerszene',
    src: '/images/partners/gruenderszene.png',
    alt: 'Gründerszene logo'
  },
  {
    name: 'iBusiness',
    src: '/images/partners/ibusiness.png',
    alt: 'iBusiness logo'
  },
  {
    name: 'Internet World Business',
    src: '/images/partners/internet-world.png',
    alt: 'Internet World Business logo'
  },
  {
    name: 'Cash Online',
    src: '/images/partners/cash-online.png',
    alt: 'Cash Online logo'
  },
  {
    name: 'Unternehmer.de',
    src: '/images/partners/unternehmer.png',
    alt: 'Unternehmer.de logo'
  },
  {
    name: 'CRN',
    src: '/images/partners/crn.png',
    alt: 'CRN logo'
  },
  {
    name: 'Perspektive Mittelstand',
    src: '/images/partners/perspektive.png',
    alt: 'Perspektive Mittelstand logo'
  },
  {
    name: 'Kontakter',
    src: '/images/partners/kontakter.png',
    alt: 'Kontakter logo'
  }
];

// Stats data
const stats = [
  { 
    label: 'Restaurants',
    value: '2,500+',
    icon: <Users className="w-6 h-6 text-primary" />,
    color: 'bg-primary/10'
  },
  { 
    label: 'Reviews',
    value: '85,000+',
    icon: <Star className="w-6 h-6 text-accent" />,
    color: 'bg-accent/10'
  },
  { 
    label: 'Monthly Visitors',
    value: '150,000+',
    icon: <BarChart3 className="w-6 h-6 text-secondary" />,
    color: 'bg-secondary/10'
  },
  { 
    label: 'Cities Covered',
    value: '120+',
    icon: <Award className="w-6 h-6 text-primary" />,
    color: 'bg-primary/10'
  }
];

export default function AboutSection() {
  return (
    <section className="section-padding bg-gradient-to-b from-background to-background-card">
      <div className="container-custom">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            Our Story
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-text-main mb-6">
            The Food Discovery Platform You'll Love
          </h2>
          <p className="text-lg text-text-muted">
            Connecting food lovers with amazing restaurants since 2023. 
            Our mission is to help you discover incredible dining experiences and support local restaurants.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`${stat.color} w-12 h-12 rounded-full flex items-center justify-center mb-4`}>
                {stat.icon}
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-text-main mb-2">{stat.value}</h3>
              <p className="text-text-muted">{stat.label}</p>
            </motion.div>
          ))}
        </div>
        
        {/* Featured Badge */}
        <div className="text-center mb-12">
          <div className="inline-block bg-accent text-white px-6 py-3 rounded-full font-medium">
            Featured In
          </div>
        </div>
        
        {/* Partners/Media logos grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center">
          {partnerLogos.map((logo, index) => (
            <motion.div 
              key={logo.name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex justify-center"
            >
              {/* For actual deployment, replace with real logo images */}
              <div className="h-12 w-36 bg-white flex items-center justify-center rounded-lg shadow-sm opacity-70 hover:opacity-100 transition-all duration-300">
                <span className="text-sm font-medium text-text-muted">{logo.name}</span>
                {/* Once you have the actual logos, use this instead: */}
                {/* <Image 
                  src={logo.src}
                  alt={logo.alt}
                  width={144}
                  height={48}
                  className="h-auto w-auto max-h-10 object-contain grayscale hover:grayscale-0 transition-all"
                /> */}
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* About CTA */}
        <div className="text-center mt-16">
          <Link href="/about" className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-full text-base font-medium text-text-main hover:bg-white transition-colors">
            Learn More About Us
          </Link>
        </div>
      </div>
    </section>
  );
} 