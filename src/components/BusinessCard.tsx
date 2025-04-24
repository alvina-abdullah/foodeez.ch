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
  MessageCircle,
} from "lucide-react";
import { generateSlug } from "@/lib/utils/genSlug";
import { BusinessDetail } from "@/types/business.types";
import { SocialLinks } from "@/components/core/SocialLinks";

export interface BusinessCardProps {
  business: BusinessDetail;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ business }) => {
  // Use optional chaining to safely access properties
  const {
    BUSINESS_ID,
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

  // Ensure we have a valid business ID
  if (!BUSINESS_ID) {
    return null;
  }

  const slug = generateSlug(BUSINESS_NAME || "business", BUSINESS_ID);
  const rating = GOOGLE_RATING ? parseFloat(GOOGLE_RATING) : null;

  const formatUrl = (url: string | undefined) => {
    if (!url) return null;
    if (!/^https?:\/\//i.test(url)) return `https://${url}`;
    return url;
  };

  // Prepare social links
  const socialLinks = {
    facebook: formatUrl(FACEBOOK_LINK),
    instagram: formatUrl(INSTA_LINK),
    whatsapp: WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}` : null,
    website: formatUrl(WEB_ADDRESS),
  };

  const hasSocialLinks = Object.values(socialLinks).some(
    (link) => link !== null
  );

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Image with link */}
      <Link
        href={`/business/${slug}`}
        className="block relative h-48 w-full bg-gray-50"
      >
        {IMAGE_URL ? (
          <Image
            src={IMAGE_URL}
            alt={BUSINESS_NAME || "Business image"}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <span className="text-2xl font-bold text-gray-400 uppercase">
              {(BUSINESS_NAME || "B").charAt(0)}
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start gap-2">
          <Link
            href={`/business/${slug}`}
            className="hover:opacity-90 transition-opacity"
          >
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
              {BUSINESS_NAME || "Business"}
            </h3>
          </Link>

          {rating && (
            <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
              <Star size={14} className="text-yellow-500 fill-yellow-400" />
              <span className="ml-1 text-xs font-medium text-yellow-700">
                {rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {ADDRESS_TOWN && (
          <p className="mt-1 flex items-center text-sm text-gray-500">
            <MapPin size={14} className="mr-1.5 flex-shrink-0" />
            <span className="line-clamp-1">{ADDRESS_TOWN}</span>
          </p>
        )}

        {DESCRIPTION && (
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
            {DESCRIPTION}
          </p>
        )}

        {/* Contact Info */}
        <div className="mt-4 space-y-2">
          {PHONE_NUMBER && (
            <div className="flex items-center text-sm text-gray-700">
              <Phone size={14} className="mr-2 flex-shrink-0 text-gray-500" />
              <a
                href={`tel:${PHONE_NUMBER}`}
                className="hover:text-blue-600 transition-colors"
              >
                {PHONE_NUMBER}
              </a>
            </div>
          )}

          {/* {EMAIL_ADDRESS && (
            <div className="flex items-center text-sm text-gray-700">
              <Mail size={14} className="mr-2 flex-shrink-0 text-gray-500" />
              <a
                href={`mailto:${EMAIL_ADDRESS}`}
                className="hover:text-blue-600 transition-colors line-clamp-1"
              >
                {EMAIL_ADDRESS}
              </a>
            </div>
          )} */}

          {WEB_ADDRESS && (
            <div className="flex items-center text-sm text-gray-700">
              <Globe size={14} className="mr-2 flex-shrink-0 text-blue-500" />
              <a
                href={formatUrl(WEB_ADDRESS) || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors line-clamp-1"
              >
                {WEB_ADDRESS.replace(/^https?:\/\//, "").split("/")[0]}
              </a>
            </div>
          )}
        </div>

        {/* Social Links */}
        {hasSocialLinks && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex flex-wrap gap-3 items-center">
              <SocialLinks
                {...socialLinks}
                size="sm"
                variant="circle"
                color="colored"
                className="flex-wrap gap-3"
              />

              {WHATSAPP_NUMBER && (
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-all duration-200 flex items-center justify-center rounded-full border border-green-500 w-8 h-8 group hover:bg-green-50"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4 text-green-600" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        <Link
          href={`/business/${slug}/reservation`}
          className="mt-4 w-full inline-flex items-center justify-center px-4 py-2.5 bg-primary hover:bg-accent text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          <Calendar size={16} className="mr-2" />
          Book Now
        </Link>
      </div>
    </div>
  );
};

export default React.memo(BusinessCard);
