"use client";

import { getAdsLinkData } from "@/services/HomePageService";
import { adsLinkData } from "@/types/addlink.types";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const AdsBar2: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [adsLinkData, setAdsLinkData] = useState<adsLinkData[]>([]);

  useEffect(() => {
    const fetchAdsLinkData = async () => {
      const adsLinkData = await getAdsLinkData();
      setAdsLinkData(adsLinkData);
    };
    fetchAdsLinkData();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full py-6 px-2 sm:px-4 mx-auto no-scrollbar"
      aria-label="Scrolling list of featured businesses"
    >
      <div
        className={`
          grid grid-flow-col 
          auto-cols-[minmax(120px,_1fr)] 
          sm:auto-cols-[minmax(140px,_1fr)]
          xl:grid-cols-6 
          gap-6 
          overflow-x-auto 
          xl:overflow-x-hidden 
        `}
        id="no-scrollbar"
      >
        {adsLinkData.map((biz, index) => (
          <a
            key={index}
            href={biz.WEB_ADDRESS || "#"}
            target="_blank"
            rel="noopener noreferrer"
            title={biz.BUSINESS_NAME || ""}
            className="flex flex-col items-center justify-start transition-transform duration-300 hover:scale-105 "
          >
            <div className="relative w-[clamp(100px,20vw,160px)] h-[clamp(100px,20vw,160px)] rounded-xl bg-white shadow-md hover:shadow-lg p-2 flex items-center justify-center">
              <Image
                src={biz.LOGO_FILE || "/placeholder.png"}
                alt={biz.BUSINESS_NAME || "Business"}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 96px, 144px"
              />
            </div>
            <span className="text-xs sm:text-sm mt-2 text-center text-text-main font-medium max-w-[140px] truncate sm:line-clamp-2">
              {biz.BUSINESS_NAME}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default AdsBar2;
