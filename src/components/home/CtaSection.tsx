// 'use client';

// import Link from 'next/link';
// import Image from 'next/image';
// import { motion } from 'framer-motion';

// export default function CtaSection() {
//   return (
//     <section className="relative py-20 overflow-hidden">
//       {/* Background with overlay */}
//       <div className="absolute inset-0 z-0">
//         <Image
//           src="/images/cta-background.jpg"
//           alt="Food background"
//           fill
//           className="object-cover"
//           // Placeholder for actual image - in real implementation use a high-quality image
//           style={{ backgroundColor: '#222' }}
//         />
//         <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-secondary-900/80"></div>
//       </div>

//       <div className="container mx-auto px-4 relative z-10">
//         <div className="max-w-3xl mx-auto text-center">
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             viewport={{ once: true }}
//           >
//             <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
//               Ready to Discover Amazing Food Near You?
//             </h2>

//             <p className="text-lg text-white/80 mb-8">
//               Join thousands of food lovers who have already found their new favorite restaurants on Foodeez. Whether you're looking for a quick bite or a fine dining experience, we've got you covered.
//             </p>

//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <Link href="/registration" className="inline-block bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-8 rounded-full transition-colors">
//                 Register Your Business
//               </Link>

//               <Link href="/search" className="inline-block bg-white hover:bg-gray-100 text-secondary-900 font-medium py-3 px-8 rounded-full transition-colors">
//                 Explore Restaurants
//               </Link>
//             </div>

//             <div className="mt-12 flex items-center justify-center space-x-8">
//               <div className="flex flex-col items-center">
//                 <span className="text-3xl font-bold text-white">10K+</span>
//                 <span className="text-sm text-white/70">Happy Users</span>
//               </div>

//               <div className="h-12 w-px bg-white/20"></div>

//               <div className="flex flex-col items-center">
//                 <span className="text-3xl font-bold text-white">5K+</span>
//                 <span className="text-sm text-white/70">Restaurants</span>
//               </div>

//               <div className="h-12 w-px bg-white/20"></div>

//               <div className="flex flex-col items-center">
//                 <span className="text-3xl font-bold text-white">100+</span>
//                 <span className="text-sm text-white/70">Cities</span>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </div>

//       {/* Decorative elements */}
//       <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-primary-500/30 rounded-full blur-3xl"></div>
//       <div className="absolute -top-16 -right-16 w-32 h-32 bg-secondary-500/30 rounded-full blur-3xl"></div>
//     </section>
//   );
// }

"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function CtaSection() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1600&q=80"
          alt="Delicious food table background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-primary/60 to-accent-light/60 backdrop-blur-sm z-0"></div>
      </div>

      {/* Foreground content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6">
              Discover Amazing Food Near You
            </h2>

            <p className="text-base sm:text-lg text-white/80 mb-10">
              Join thousands of food lovers who’ve already found their new
              favorite spots. Whether you crave quick bites or fine dining,
              Foodeez has your next meal covered.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
              <Link
                href="/business/register"
                target="_blank"
                className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300"
              >
                Register Your Business
              </Link>

              <Link
                href="#"
                className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 px-8 rounded-full transition-all duration-300"
              >
                Explore Restaurants
              </Link>
            </div>

            {/* Stats */}
            {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-8 text-white">
              {[
                { label: "Happy Users", value: "10K+" },
                { label: "Restaurants", value: "5K+" },
                { label: "Cities", value: "100+" },
              ].map((stat, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <span className="text-4xl font-bold">{stat.value}</span>
                  <span className="text-sm text-white/70">{stat.label}</span>
                </div>
              ))}
            </div> */}
          </motion.div>
        </div>
      </div>

      {/* Decorative glow orbs */}
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary-400/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-secondary-400/30 rounded-full blur-3xl pointer-events-none"></div>
    </section>
  );
}
