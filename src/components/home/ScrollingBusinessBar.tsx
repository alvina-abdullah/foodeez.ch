'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

interface Business {
  name: string;
  url: string;
  logo: string;
}

interface ScrollingBusinessBarProps {
  speed?: number;
}

const businesses: Business[] = [
  {
    name: 'Salpers - Online Grocery Shop',
    url: 'https://salpers.ch/',
    logo: '/images/BusinessLogos/salpers.png'
  },
  {
    name: 'New Spice Village - Dübendorf',
    url: 'https://newspicevillage.ch/',
    logo: '/images/BusinessLogos/spicevillage.png'
  },
  {
    name: 'Sahar Restaurant',
    url: 'https://sahar.ch/',
    logo: '/images/BusinessLogos/sahar.png'
  },
  {
    name: 'Taj Mahal Badan',
    url: 'https://tajmahalbaden.ch/',
    logo: '/images/BusinessLogos/tajmahal.png'
  },
  {
    name: 'Darbar Restaurant',
    url: 'https://darbar.ch/de/',
    logo: '/images/BusinessLogos/darbar.png'
  },
  {
    name: 'Tuscany Italian Restaurant',
    url: 'https://tuscany-restaurant.ch/',
    logo: '/images/BusinessLogos/tuscany.png'
  }
];

const ScrollingBusinessBar: React.FC<ScrollingBusinessBarProps> = ({ speed = 20 }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.setProperty('--speed', `${speed}s`);
    }
  }, [speed]);

  return (
    <div
      className="scroll-strip w-full overflow-hidden py-6 px-2 sm:px-4 bg-gradient-to-r from-gray-50 via-white to-gray-50"
      ref={containerRef}
      aria-label="Scrolling list of featured businesses"
    >
      <div className="scroll-content inline-block whitespace-nowrap animate-scroll">
      {[...businesses, ...businesses].map((biz, index) => (
          <a
            key={index}
            href={biz.url}
            target="_blank"
            rel="noopener noreferrer"
            title={biz.name}
            className="inline-flex flex-col items-center justify-start mx-6 sm:mx-8 hover:scale-105 transition-transform duration-300 min-w-[120px]"
          >
            <div className="relative w-[clamp(60px,10vw,100px)] h-[clamp(60px,10vw,100px)] bg-white rounded-lg p-2 shadow-md hover:shadow-lg transition-shadow">
              <Image
                src={biz.logo}
                alt={biz.name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 70px, 100px object-contain p-1"
                
              />
            </div>
            <span className="text-xs sm:text-sm text-center mt-2 text-text-main max-w-[120px] truncate sm:line-clamp-2">
              {biz.name}
            </span>
          </a>
        ))}
      </div>

      <style jsx>{`
        .scroll-content {
          padding-left: 100%;
          animation: scroll-left var(--speed) linear infinite;
        }

        .scroll-strip:hover .scroll-content {
          animation-play-state: paused;
        }

        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};

export default ScrollingBusinessBar;
