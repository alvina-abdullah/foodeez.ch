"use client";

import { useState } from "react";
import { X, Bell } from "lucide-react";
import Link from "next/link";

interface AnnouncementBarProps {
  message?: string;
  bgColor?: string;
  textColor?: string;
}

export default function AnnouncementBar2({
  message = "Limited Time Offer: Get 15% off on your first restaurant review!",
  bgColor = "bg-primary",
  textColor = "text-white",
}: AnnouncementBarProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div
      className={`w-full ${bgColor} ${textColor} py-2.5 px-4 relative flex items-center justify-center text-center shadow-sm`}
    >
      <Bell className="w-4 h-4 mr-2 hidden sm:block" />

      {/* Container for message with max width for readability */}
      <div className="max-w-5xl w-full text-sm sm:text-base font-medium">
        {message}{" "}
        <Link
          // href="/signup"
          href="/coming-soon"
          className="underline font-bold hover:text-white/90 transition-colors"
        >
          Sign up now
        </Link>
      </div>

      {/* Close button */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 hover:bg-white/10 p-1 rounded-full transition-colors"
        aria-label="Close announcement"
      >
        <X size={16} />
      </button>
    </div>
  );
}
