"use client";

import { useParams } from "next/navigation";
import { getBusinessById } from "@/lib/db";
import { generateSlug, parseSlug } from "@/lib/utils/genSlug";
import BusinessImage from "./components/BusinessImage";
import BusinessSkeleton from "./components/BusinessSkeleton";
import Breadcrumb from "@/components/core/Breadcrumb";
import React, { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import MapCard from "./components/MapSectionBusinesProfile";
import GooglePhotoGallery from "./components/PhotoGallary";
import {
  fetchGooglePlaceDetails,
  GooglePlaceDetails,
} from "./components/fetchGooglePlaceDetails";
import { extractPlaceIdFromUrl } from "@/lib/utils/google";
import GoogleReviews from "./components/GoogleReviews";
import { ActionButtons } from "./components/action-buttons";
import OpeningHours from "./components/OpeningHoursSection";
import BusinessInfo from "./components/BusinessInfoSection";
import BusinessInfoSection from "./components/BusinessInfoSection";

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

const BusinessDetailPage = () => {
  const [business, setBusiness] = useState<BusinessData | null>(null);
  const [placeId, setPlaceId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [googleBusinessData, setGoogleBusinessData] =
    useState<GooglePlaceDetails>();

  const slug = useParams();
  const parsedId = parseSlug(slug?.slug as unknown as string);

  useEffect(() => {
    async function fetchBusiness() {
      if (!parsedId) return;

      const data = await getBusinessById(Number(parsedId.id));

      const mapped = data
        ? Object.fromEntries(
            Object.entries(data).map(([k, v]) => [
              k,
              v === null ? undefined : v,
            ])
          )
        : null;

      if (mapped && mapped.BUSINESS_ID) {
        setBusiness(mapped as unknown as BusinessData);

        // ✅ Extract place ID from Google profile
        const placeId = extractPlaceIdFromUrl(
          String(mapped.GOOGLE_PROFILE || "")
        );
        setPlaceId(placeId);
      } else {
        setBusiness(null);
      }

      setLoading(false);
    }

    fetchBusiness();
  }, []); // 👈 runs once parsedId changes

  useEffect(() => {
    let isMounted = true;

    if (!placeId) return;

    fetchGooglePlaceDetails(placeId)
      .then((data) => {
        if (isMounted) {
          setGoogleBusinessData(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching Google place details:", error);
      });

    return () => {
      isMounted = false;
    };
  }, [placeId]); // 👈 runs once placeId is set

  if (loading) {
    return <BusinessSkeleton />;
  }

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-red-500">
        Business not found
      </div>
    );
  }

  // Meta data
  const title = business.BUSINESS_NAME
    ? `${business.BUSINESS_NAME} | Foodeez`
    : "Business | Foodeez";
  const description =
    business.DESCRIPTION || "Discover this business on Foodeez.";
  const image = business.IMAGE_URL || "/default-business.jpg";
  const url = typeof window !== "undefined" ? window.location.href : "";

  const genslug = generateSlug(
    business?.BUSINESS_NAME || "business",
    business?.BUSINESS_ID
  );

  const mockOpeningHours = [
    { day: "Monday", hours: "10:00 AM - 10:00 PM" },
    { day: "Tuesday", hours: "10:00 AM - 10:00 PM" },
    { day: "Wednesday", hours: "10:00 AM - 10:00 PM" },
    { day: "Thursday", hours: "10:00 AM - 10:00 PM" },
    { day: "Friday", hours: "10:00 AM - 11:00 PM" },
    { day: "Saturday", hours: "11:00 AM - 11:00 PM" },
    { day: "Sunday", hours: "11:00 AM - 9:00 PM" },
  ];

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

      <div className="min-h-screen bg-gray-50 pb-10">
        {/* Header with Restaurant Name and City */}
        <div className="w-full bg-white shadow-sm py-4">
          <div className="container mx-auto px-4">
            <h1 className="text-xl md:text-2xl font-bold">
              {business.BUSINESS_NAME} •{" "}
              <span className="text-gray-600">{business.CITY_NAME}</span>
            </h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 mt-6">
          {/* Restaurant Profile Picture */}
          <div>
            <BusinessImage
              imageUrl={business.IMAGE_URL || ""}
              businessName={business.BUSINESS_NAME || ""}
              className="mb-6"
            />
          </div>

          {/* Info Section */}
          <BusinessInfoSection business={business} />

          <GooglePhotoGallery
            photos={googleBusinessData?.photos || []}
            businessName={googleBusinessData?.name || business.BUSINESS_NAME}
          />

          {/* Opening Hours */}
          <OpeningHours openingHours={mockOpeningHours} />

          {/* Action Buttons */}
          <ActionButtons
            onFavorite={(isFavorite) => {
              console.log("Favorite status:", isFavorite);
            }}
            onShare={() => {
              // Additional share logic if needed
              console.log("Share button clicked");
            }}
            onReview={() => {
              // Custom review handling logic
              console.log("Review button clicked");
            }}
          />

          {/* Foodeez Reviews */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full bg-blue-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-blue-500 text-white px-6 py-1 rounded-full text-sm font-medium">
                {business.BUSINESS_NAME} Reviews
              </span>
            </div>
          </div>

          {/* Reviews */}
          <div className="">
            <GoogleReviews reviews={googleBusinessData?.reviews || []} />
          </div>

          {/* Google Map */}
          <MapCard placeId={placeId} />
        </div>
      </div>
    </>
  );
};

export default BusinessDetailPage;
