"use client";

import { useEffect, useRef } from "react";

const phrases = [
  "Switzerland’s #1 Food Discovery Platform",
  "Powered by Tech. Driven by Taste",
  "Where Prestige Meets Visibility",
  "Crafted for Culinary Excellence & Designed for Global Discovery",
  "Fine Dining or Hidden Gem — We Make You Visible",
  "More Than a Listing, A Digital Stage for Your Brand",
  "Designed for Chefs Who Want to Be Remembered",
];

interface AnnouncementBarProps {
  bgColor?: string;
  textColor?: string;
  speed?: number;
}

export default function AnnouncementBar1({
  bgColor = "bg-secondary",
  textColor = "text-white",
  speed = 80,
}: AnnouncementBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.setProperty("--scroll-speed", `${speed}s`);
    }
  }, [speed]);

  return (
    <div
      className={`w-full overflow-hidden ${bgColor} ${textColor} py-2.5 px-4 relative shadow-sm`}
      aria-label="Scrolling announcement"
      ref={containerRef}
    >
      <div className="scroll-text whitespace-nowrap animate-scroll">
        {[...phrases, ...phrases].map((text, i) => (
          <span key={i} className=" inline-block">
            {text} &nbsp;&nbsp;&nbsp;*&nbsp;&nbsp;&nbsp;
          </span>
        ))}
      </div>

      <style jsx>{`
        .scroll-text {
          display: inline-block;
          white-space: nowrap;
          animation: scroll-left var(--scroll-speed) linear infinite;
        }

        @keyframes scroll-left {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
