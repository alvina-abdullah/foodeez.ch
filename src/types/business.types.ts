// types/business.types.ts

import { Prisma } from "@prisma/client";

export interface BusinessDetail {
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
  // Add compatibility with different view structures
  IFNULL_d_Ranking__0_?: bigint;
  Category_name?: string;
}

export type BusinessCategory = {
  id?: number;
  CNT?: bigint;
  Business_category_id: number;
  Category_name: string;
};

export type BusinessResult = Prisma.business_detail_view_allGetPayload<{
  select: {
    BUSINESS_ID: true;
    BUSINESS_NAME: true;
    SHORT_NAME: true;
    DESCRIPTION: true;
    ADDRESS_STREET: true;
    ADDRESS_ZIP: true;
    ADDRESS_TOWN: true;
    ADDRESS_CITY_ID: true;
    CITY_CODE: true;
    CITY_NAME: true;
    ADDRESS_COUNTRY: true;
    PHONE_NUMBER: true;
    WHATSAPP_NUMBER: true;
    WEB_ADDRESS: true;
    LOGO: true;
    FACEBOOK_LINK: true;
    INSTA_LINK: true;
    TIKTOK_LINK: true;
    GOOGLE_PROFILE: true;
    IMAGE_URL: true;
    GOOGLE_RATING: true;
    APPROVED: true;
    STATUS: true;
    Ranking: true;
  }
}>[];