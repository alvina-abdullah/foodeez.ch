// components/BusinessCard.tsx

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Star,
  MapPin,
  Calendar,
  Globe,
  Phone,
} from "lucide-react";
import { generateSlug } from "@/lib/utils/genSlug";
import { SocialLinks } from "@/components/core/SocialLinks";
import { DiscoverBusiness } from "@/types/discover.types";

export interface BusinessCardProps {
  business: DiscoverBusiness;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ business }) => {
  const {
    Business_ID,
    BUSINESS_NAME = "Business",
    IMAGE_URL,
    ADDRESS_TOWN,
    DESCRIPTION,
    GOOGLE_RATING,
    PHONE_NUMBER,
    WHATSAPP_NUMBER,
    WEB_ADDRESS,
    FACEBOOK_LINK,
    INSTA_LINK,
  } = business || {};

  if (!Business_ID) return null;


  const slug = generateSlug(BUSINESS_NAME || "business", Business_ID);
  const rating = GOOGLE_RATING ? parseFloat(GOOGLE_RATING) : null;

  const formatUrl = (url: string | undefined) => {
    if (!url || url.trim() === '' || url === '0' || url === 'null') return null;

    // Handle regular URLs
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  const socialLinks = {
    facebook: formatUrl(FACEBOOK_LINK),
    instagram: formatUrl(INSTA_LINK),
    whatsapp: WHATSAPP_NUMBER,
    website: formatUrl(WEB_ADDRESS),
  };

  const hasSocialLinks = Object.values(socialLinks).some(
    (link) => link !== null && link !== undefined && link !== ''
  );

  return (
    <div className="group relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden w-full max-w-md h-[420px] flex flex-col">
      {/* Image */}
      <Link
        href={`/business/${slug}`}
        className="block relative h-40 w-full bg-gray-100"
      >
        {IMAGE_URL ? (
          <Image
            src={IMAGE_URL}
            alt={BUSINESS_NAME}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <span className="text-3xl font-bold text-gray-400 uppercase">
              {BUSINESS_NAME.charAt(0)}
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between p-4">
        <div>
          {/* Title & Rating */}
          <div className="flex justify-between items-start">
            <Link href={`/business/${slug}`}>
              <h3 className="text-base font-semibold text-primary line-clamp-1">
                {BUSINESS_NAME}
              </h3>
            </Link>
            {rating && (
              <div className="flex items-center bg-yellow-50 px-2 py-0.5 rounded-full">
                <Star size={14} className="text-accent-dark fill-accent" />
                <span className="ml-1 text-xs text-accent-dark">
                  {rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          {/* Address */}
          {ADDRESS_TOWN && (
            <p className="mt-1 flex items-center text-sm text-gray-500">
              <MapPin size={14} className="mr-1.5 text-primary" />
              <span className="line-clamp-1">{ADDRESS_TOWN}</span>
            </p>
          )}

          {/* Description */}
          {DESCRIPTION && (
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
              {DESCRIPTION}
            </p>
          )}

          {/* Contact Info */}
          <div className="mt-3 space-y-1 text-sm text-gray-700">
            {PHONE_NUMBER && (
              <div className="flex items-center">
                <Phone size={14} className="mr-2 text-primary" />
                <a
                  href={`tel:${PHONE_NUMBER}`}
                  className="hover:text-accent transition-colors"
                >
                  {PHONE_NUMBER}
                </a>
              </div>
            )}

            {WEB_ADDRESS && (
              <div className="flex items-center">
                <Globe size={14} className="mr-2 text-primary" />
                <a
                  href={formatUrl(WEB_ADDRESS) || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors line-clamp-1"
                >
                  {WEB_ADDRESS.replace(/^https?:\/\//, "").split("/")[0]}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          {/* Socials */}
          {hasSocialLinks && (
            <div className="flex gap-2 items-center">
              <SocialLinks
                {...socialLinks}
                size="sm"
                color="colored"
                variant="default"
                className="mt-2 justify-center"
              />
            </div>
          )}

          {/* Reserve Link */}
          <Link
            href={`/business/${slug}/reservation`}
            className="text-sm text-primary font-medium flex items-center gap-1 hover:underline"
          >
            <Calendar size={14} />
            Reserve Table
          </Link>
        </div>
      </div>
    </div>
  );
};

export default React.memo(BusinessCard);
