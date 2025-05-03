"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getBusinessById } from "@/lib/db";
import { generateSlug, parseSlug } from "@/lib/utils/genSlug";
import { motion } from "framer-motion";
import BusinessImage from './components/BusinessImage';
import { SocialLinks } from '@/components/core/SocialLinks';
import BusinessSkeleton from './components/BusinessSkeleton';
import Breadcrumb from '@/components/core/Breadcrumb';
import Link from "next/link";

export interface BusinessData {
  BUSINESS_ID: number;
  BUSINESS_NAME?: string;
  SHORT_NAME?: string;
  DESCRIPTION?: string;
  ADDRESS_STREET?: string;
  ADDRESS_ZIP?: bigint;
  ADDRESS_TOWN?: string;
  ADDRESS_CITY_ID?: number;
  CITY_CODE?: string;
  CITY_NAME?: string;
  ADDRESS_COUNTRY?: string;
  PHONE_NUMBER?: string;
  WHATSAPP_NUMBER?: string;
  WEB_ADDRESS?: string;
  LOGO?: string;
  FACEBOOK_LINK?: string;
  INSTA_LINK?: string;
  TIKTOK_LINK?: string;
  GOOGLE_PROFILE?: string;
  IMAGE_URL?: string;
  GOOGLE_RATING?: string;
  APPROVED?: number;
  STATUS?: number;
  Ranking?: bigint;
}

export default function BusinessDetailPage() {
  const slug = useParams();
  const parsedId = parseSlug(slug?.slug as unknown as string);
  const [business, setBusiness] = useState<BusinessData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBusiness() {
      if (!parsedId) return;
      const data = await getBusinessById(Number(parsedId.id));
      // Map all null string fields to undefined for type compatibility
      const mapped = data ? Object.fromEntries(Object.entries(data).map(([k, v]) => [k, v === null ? undefined : v])) : null;
      if (mapped && mapped.BUSINESS_ID) {
        setBusiness(mapped as unknown as BusinessData);
      } else {
        setBusiness(null);
      }
      setLoading(false);
    }
    fetchBusiness();
  }, []);


  if (loading) {
    return <BusinessSkeleton />;
  }

  if (!business) {
    return <div className="min-h-screen flex items-center justify-center text-xl text-red-500">Business not found</div>;
  }

  // Meta data
  const title = business.BUSINESS_NAME ? `${business.BUSINESS_NAME} | Foodeez` : 'Business | Foodeez';
  const description = business.DESCRIPTION || 'Discover this business on Foodeez.';
  const image = business.IMAGE_URL || '/default-business.jpg';
  const url = typeof window !== 'undefined' ? window.location.href : '';

  const genslug = generateSlug(business?.BUSINESS_NAME || "business", business?.BUSINESS_ID);

  return (
    <>
      <head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:type" content="business.business" />
        <meta property="og:url" content={url} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
        <link rel="canonical" href={url} />
      </head>
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Restaurant', href: '/' },
              { label: business.BUSINESS_NAME || 'Restaurant' }
            ]}
            className="mb-6"
          />
        </div>
        <div className="max-w-5xl mx-auto flex flex-col gap-6 md:flex-row bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Left: Business Image */}
          <motion.div
            className="md:w-1/2 w-full"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, type: 'spring' }}
          >
            <BusinessImage business={business} />
          </motion.div>
          {/* Right: Info */}
          <motion.div
            className="md:w-1/2 w-full flex flex-col gap-6 p-4"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, type: 'spring', delay: 0.2 }}
          >
            {/* Main Business Info */}
            <div className="bg-white rounded-xl flex flex-col gap-4">
              <h1 className="text-2xl md:text-3xl font-bold text-text-main mb-1">
                {business.BUSINESS_NAME || 'Business'}
              </h1>

              {business.GOOGLE_RATING && (
                <div className="flex items-center gap-2 text-yellow-500 text-lg">
                  ⭐ {business.GOOGLE_RATING}
                </div>
              )}

              <div className="text-xl font-semibold text-primary mt-2 mb-4">
                {business.ADDRESS_TOWN || business.CITY_NAME || ''}
              </div>

              {business.ADDRESS_STREET && (
                <div className="text-text-muted">{business.ADDRESS_STREET}</div>
              )}

              {(business.ADDRESS_ZIP || business.CITY_NAME || business.ADDRESS_COUNTRY) && (
                <div className="text-text-muted">
                  {business.ADDRESS_ZIP ? `${business.ADDRESS_ZIP}, ` : ''}
                  {business.CITY_NAME ? `${business.CITY_NAME}, ` : ''}
                  {business.ADDRESS_COUNTRY || ''}
                </div>
              )}

              <Link href={`/business/${genslug}/reservation`} passHref>
                <button
                  className="w-full py-3 bg-primary text-white font-semibold rounded-lg shadow hover:bg-primary-dark transition-colors text-lg mt-4"
                >
                  Reserve a Table
                </button>
              </Link>
            </div>

            {/* Description */}
            {business.DESCRIPTION && (
              <div>
                <h2 className="text-lg font-semibold text-text-main mb-2">Description</h2>
                <p className="text-text-muted whitespace-pre-line">{business.DESCRIPTION}</p>
              </div>
            )}

            {/* Contact Information */}
            <div>
              <h2 className="text-lg font-semibold text-text-main mb-2">Contact</h2>
              <ul className="text-text-muted flex flex-col gap-2">
                {business.PHONE_NUMBER && <li><strong>Phone:</strong> {business.PHONE_NUMBER}</li>}
                {business.WHATSAPP_NUMBER && <li><strong>WhatsApp:</strong> {business.WHATSAPP_NUMBER}</li>}
                {business.WEB_ADDRESS && <li><strong>Website:</strong> <a href={business.WEB_ADDRESS} className="text-primary underline" target="_blank" rel="noopener noreferrer">{business.WEB_ADDRESS}</a></li>}
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h2 className="text-lg font-semibold text-text-main mb-2">Social Media</h2>
              <SocialLinks
                facebook={business.FACEBOOK_LINK}
                instagram={business.INSTA_LINK}
                whatsapp={business.WHATSAPP_NUMBER}
                tiktok={business.TIKTOK_LINK}            
                size="md"
                variant="circle"
              />
            </div>

            {/* Other Info */}
            {/* <div>
              <h2 className="text-lg font-semibold text-text-main mb-2">Additional Information</h2>
              <ul className="text-text-muted flex flex-col gap-2">
                {business.CITY_CODE && <li><strong>City Code:</strong> {business.CITY_CODE}</li>}
                {business.ADDRESS_CITY_ID && <li><strong>City ID:</strong> {business.ADDRESS_CITY_ID}</li>}
                {business.GOOGLE_PROFILE && <li><strong>Google Profile:</strong> <a href={business.GOOGLE_PROFILE} className="text-primary underline" target="_blank" rel="noopener noreferrer">{business.GOOGLE_PROFILE}</a></li>}
                {typeof business.APPROVED !== 'undefined' && <li><strong>Approved:</strong> {business.APPROVED === 1 ? 'Yes' : 'No'}</li>}
                {typeof business.STATUS !== 'undefined' && <li><strong>Status:</strong> {business.STATUS === 1 ? 'Active' : 'Inactive'}</li>}
                {typeof business.Ranking !== 'undefined' && <li><strong>Ranking:</strong> {business.Ranking.toString()}</li>}
              </ul>
            </div> */}
          </motion.div>

        </div >
      </div >
    </>
  );
}

