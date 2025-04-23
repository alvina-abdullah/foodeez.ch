"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getBusinessById } from "@/lib/db";
import { BusinessDetail } from "@/types/business.types";
import Image from "next/image";
import { FaPhone, FaWhatsapp, FaGlobe, FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import { parseSlug } from "@/lib/utils/genSlug";

export default function BusinessDetailPage() {
  const  slug  = useParams();
  const parsedId = parseSlug(slug?.slug as unknown as string);
  const [business, setBusiness] = useState<BusinessDetail>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBusiness() {
      if (!parsedId) return;
      console.log(parsedId.id);
      const data = await getBusinessById(Number(parsedId.id));
      setBusiness(data);
      setLoading(false);
    }
    fetchBusiness();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl">Loading...</div>;
  }

  if (!business) {
    return <div className="min-h-screen flex items-center justify-center text-xl text-red-500">Business not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6 sm:px-12 lg:px-24">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
        {business.IMAGE_URL && (
          <div className="relative h-64 w-full">
            <Image
              src={business.IMAGE_URL}
              alt={business.BUSINESS_NAME || "Business image"}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {business.BUSINESS_NAME}
          </h1>
          <p className="text-gray-600 mb-4">{business.DESCRIPTION}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
            <p><strong>Short Name:</strong> {business.SHORT_NAME}</p>
            <p><strong>Town:</strong> {business.ADDRESS_TOWN}</p>
            <p><strong>City:</strong> {business.CITY_NAME} ({business.CITY_CODE})</p>
            <p><strong>Zip:</strong> {business.ADDRESS_ZIP}</p>
            <p><strong>Country:</strong> {business.ADDRESS_COUNTRY}</p>
            <p><strong>Address:</strong> {business.ADDRESS_STREET}</p>
            <p><strong>Status:</strong> {business.STATUS ? "Active" : "Inactive"}</p>
            <p><strong>Approved:</strong> {business.APPROVED ? "Yes" : "No"}</p>
            <p><strong>Ranking:</strong> {business.Ranking}</p>
          </div>

          <div className="mt-6 flex flex-col gap-2 text-gray-800 text-base">
            {business.PHONE_NUMBER && (
              <p className="flex items-center gap-2"><FaPhone /> {business.PHONE_NUMBER}</p>
            )}
            {business.WHATSAPP_NUMBER && (
              <p className="flex items-center gap-2"><FaWhatsapp /> {business.WHATSAPP_NUMBER}</p>
            )}
            {business.WEB_ADDRESS && (
              <p className="flex items-center gap-2">
                <FaGlobe /> <a href={business.WEB_ADDRESS} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{business.WEB_ADDRESS}</a>
              </p>
            )}
          </div>

          <div className="mt-6 flex gap-4 text-xl text-gray-600">
            {business.FACEBOOK_LINK && (
              <a href={business.FACEBOOK_LINK} target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
            )}
            {business.INSTA_LINK && (
              <a href={business.INSTA_LINK} target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            )}
            {business.TIKTOK_LINK && (
              <a href={business.TIKTOK_LINK} target="_blank" rel="noopener noreferrer"><FaTiktok /></a>
            )}
          </div>

          {business.GOOGLE_RATING && (
            <div className="mt-6 text-yellow-500 font-semibold text-lg">
              ⭐ Google Rating: {business.GOOGLE_RATING}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}