import { SocialLinks } from "@/components/core/SocialLinks";
import { MapPin, Phone, Globe } from "lucide-react";
import { BusinessDetail } from "@/types/business.types";
import { generateSlug } from "@/lib/utils/genSlug";
import Link from "next/link";
import Image from "next/image";

const BusinessInfoSection: React.FC<{ business: BusinessDetail }> = ({
  business,
}) => {
  const genslug = generateSlug(
    business?.BUSINESS_NAME || "business",
    business?.BUSINESS_ID
  );

  return (
    <div className="space-y-6 my-10">
      {/* Description Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="sub-heading">Description</h2>

        <div className='flex items-center gap-2 mt-2 md:mt-0'>
         {business.HALAL == 1 && (
              <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs md:text-lg  font-medium bg-green-100 text-green-800 border border-green-200">
                <Image
                src='/images/foodtypes/halal.png'
                alt='halal'
                width={30}
                height={30}
                />
                Halal 
              </span>
            )}
            {business.VEGAN == 1 && (
              <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs md:text-lg font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                 <Image
                src='/images/foodtypes/vegan.png'
                alt='vegan'
                width={30}
                height={30}
                />
                Vegan
              </span>
            )}
            {business.VEGETARIAN == 1 && (
              <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs md:text-lg font-medium bg-teal-100 text-teal-800 border border-teal-200">
                <Image
                src='/images/foodtypes/vegetarian.png'
                alt='halal'
                width={30}
                height={30}
                />
                Vegetarian
              </span>
            )}
         </div>
      </div>

      <p className="sub-heading-description mt-3 text-start text-text-main max-w-none">
        {business.DESCRIPTION}
      </p>

      {/* Address & Contact */}
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <MapPin className="text-primary mt-1 h-5 w-5" />
          <div className="space-y-1">
            <p className="font-medium text-gray-900">
              {business.ADDRESS_STREET}
            </p>
            <p className="text-gray-600">
              {/* {business.ADDRESS_TOWN && `${business.ADDRESS_TOWN}, `} */}
              {business.CITY_NAME && `${business.CITY_NAME}, `}
              {business.ADDRESS_ZIP && `${business.ADDRESS_ZIP}, `}
              {business.ADDRESS_COUNTRY}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <Phone className="text-primary mt-1 h-5 w-5" />
          <div className="space-y-1">
            <p className="font-medium text-gray-900">{business.PHONE_NUMBER}</p>
            {business.WEB_ADDRESS && (
              <a
                href={business.WEB_ADDRESS}
                className="text-primary flex items-center gap-2"
              >
                <Globe className="h-4 w-4" />
                {new URL(business.WEB_ADDRESS).hostname}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Social & Reserve */}
      <div className="flex items-center justify-between border-t pt-8">
        {business.EMAIL_ADDRESS ? (
          <Link href={`/business/${genslug}/reservation`} target="_blank">
            <button className="btn-primary">Reserve Table</button>
          </Link>
        ) : (
          <button
            className="btn-primary opacity-50 cursor-not-allowed"
            disabled
          >
            Reserve Table
          </button>
        )}

        <SocialLinks
          facebook={business.FACEBOOK_LINK}
          instagram={business.INSTA_LINK}
          tiktok={business.TIKTOK_LINK}
          whatsapp={business.WHATSAPP_NUMBER}
          size="xl"
          className="gap-2 [&>a]:text-primary"
        />
      </div>
    </div>
  );
};

export default BusinessInfoSection;
