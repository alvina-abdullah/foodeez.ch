"use client";

import { useParams } from "next/navigation";
import { getBusinessById } from "@/lib/db";
import { generateSlug, parseSlug } from "@/lib/utils/genSlug";
import { motion } from "framer-motion";
import BusinessImage from "./components/BusinessImage";
import BusinessSkeleton from "./components/BusinessSkeleton";
import Breadcrumb from "@/components/core/Breadcrumb";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  MapPin,
  Star,
  Heart,
  Share2,
  Calendar,
  Facebook,
  Instagram,
} from "lucide-react";
import { SocialLinks } from "@/components/core/SocialLinks";
import MapCard from "./components/MapSectionBusinesProfile";
import GooglePhotoGallery from "./components/PhotoGallary";
import {
  fetchGooglePlaceDetails,
  GooglePlaceDetails,
} from "./components/fetchGooglePlaceDetails";
import { extractPlaceIdFromUrl } from "@/lib/utils/google";

import {
  format,
  getDay,
  isWithinInterval,
  setHours,
  setMinutes,
} from "date-fns";

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
  const [isBusinessOpenNow, setIsBusinessOpenNow] = useState<Boolean>();
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

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      // Example: open from 10:00 to 22:00
      const openTime = setHours(setMinutes(new Date(), 0), 10);
      const closeTime = setHours(setMinutes(new Date(), 0), 22);
      setIsBusinessOpenNow(
        isWithinInterval(now, { start: openTime, end: closeTime })
      );
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

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
          <div className="w-full h-64 md:h-96 bg-orange-200 rounded-lg overflow-hidden mb-6">
            {business.IMAGE_URL ? (
              <img
                src={business.IMAGE_URL}
                alt={business.BUSINESS_NAME}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-500">
                Restaurant Profile Pic
              </div>
            )}
          </div>

          <GooglePhotoGallery
            photos={googleBusinessData?.photos || []}
            businessName={googleBusinessData?.name || business.BUSINESS_NAME}
          />

          {/* Info Section */}
          <Card className="mb-6">
            {/* Description */}
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-600">{business.DESCRIPTION}</p>
            </div>

            {/* Address and Contact */}
            <div className="p-4 border-b bg-gray-50">
              <div className="flex flex-col md:flex-row justify-between">
                {/* Address */}
                <div className="mb-4 md:mb-0">
                  <div className="flex items-start">
                    <MapPin className="text-gray-500 mr-2 h-5 w-5 mt-0.5" />
                    <div>
                      <p className="text-gray-700">{business.ADDRESS_STREET}</p>
                      <p className="text-gray-700">
                        {business.ADDRESS_TOWN && `${business.ADDRESS_TOWN}, `}
                        {business.CITY_NAME && `${business.CITY_NAME}, `}
                        {business.ADDRESS_ZIP &&
                          `${business.ADDRESS_ZIP.toString()}, `}
                        {business.ADDRESS_COUNTRY}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div className="flex flex-col">
                  {business.PHONE_NUMBER && (
                    <p className="text-gray-700 mb-1">
                      📞 {business.PHONE_NUMBER}
                    </p>
                  )}
                  {business.WEB_ADDRESS && (
                    <a
                      href={business.WEB_ADDRESS}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline mb-1"
                    >
                      🌐 {new URL(business.WEB_ADDRESS).hostname}
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Social Media and Reserve */}
            <SocialLinks
              facebook={business.FACEBOOK_LINK}
              instagram={business.INSTA_LINK}
              tiktok={business.TIKTOK_LINK}
              whatsapp={business.WHATSAPP_NUMBER}
              size="md"
              variant="circle"
              className="p-4 border-b bg-gray-50"
            />
          </Card>

          {/* Opening Hours */}
          <Card className="mb-6">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-gray-500" />
                  <h2 className="text-lg font-semibold">Opening Hours</h2>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm ${
                    isBusinessOpenNow
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {isBusinessOpenNow ? "Open Now" : "Closed"} •{" "}
                  {format(new Date(), "hh:mm a")}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                {/* {googleBusinessData.openingHours?.map((item, index) => ( */}
                {mockOpeningHours?.map((item, index) => {
                  const currentDay = format(new Date(), "EEEE"); // Get current day as full name
                  return (
                    <div
                      key={index}
                      className={`flex justify-between p-2 ${
                        item.day === currentDay ? "bg-blue-50 rounded" : ""
                      }`}
                    >
                      <span className="font-medium">{item.day}</span>
                      <span className="text-gray-600">{item.hours}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Button
              variant="outline"
              className="flex items-center justify-center"
            >
              <Heart className="mr-2 h-4 w-4" /> Save as Favorite
            </Button>
            <Button
              variant="outline"
              className="flex items-center justify-center"
            >
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
            <Button
              variant="outline"
              className="flex items-center justify-center"
            >
              <Star className="mr-2 h-4 w-4" /> Add Review
            </Button>
          </div>

          {/* Foodeez Reviews */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full bg-blue-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-blue-500 text-white px-6 py-1 rounded-full text-sm font-medium">
                Foodeez Reviews (if available)
              </span>
            </div>
          </div>

          {/* Reviews */}
          {googleBusinessData?.reviews &&
            googleBusinessData?.reviews.length > 0 && (
              <Card className="mb-6">
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-4 flex items-center">
                    <Star className="mr-2 h-5 w-5 text-yellow-500 fill-yellow-500" />
                    Reviews
                  </h2>

                  <div className="space-y-4">
                    {googleBusinessData?.reviews.map((review, idx) => (
                      <div
                        key={idx}
                        className="border-b pb-4 last:border-0 last:pb-0"
                      >
                        <div className="flex justify-between">
                          <span className="font-medium">
                            {review.author_name}
                          </span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? "text-yellow-500 fill-yellow-500"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600 mt-1">{review.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}

          {googleBusinessData?.reviews?.length === 0 && (
            <div className="p-4 bg-gray-50 rounded-lg mb-6 text-center">
              <p className="text-gray-600">No reviews available.</p>
            </div>
          )}

          {/* Separator */}

          {/* Google Reviews */}
          <Card className="mb-6 bg-gray-100">
            <div className="p-8 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Google Reviews</h3>
                {business.GOOGLE_RATING && (
                  <div className="flex items-center justify-center text-yellow-500 text-xl">
                    <Star className="mr-1 h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <span>{business.GOOGLE_RATING}</span>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Google Map */}
          <MapCard placeId={placeId} />
        </div>
      </div>
    </>
  );
};

export default BusinessDetailPage;
