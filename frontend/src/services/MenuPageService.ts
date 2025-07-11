"use server";

import { prisma } from "@/lib/prisma";
import { business_food_menu_card_view, business_food_menu_card_detail_view } from "@prisma/client";


export async function getBusinessMenuOnly(BUSINESS_ID: number) {
  try {
    const menuCards = await prisma.business_food_menu_card_view.findMany({
      where: {
        BUSINESS_ID: BUSINESS_ID
      },
      orderBy: {
        MENU_NAME: "asc"
      }
    });
    return menuCards as business_food_menu_card_view[];
  } catch (error) {
    console.error('Error fetching menu cards:', error);
    return [];
  }
}

export async function getBusinessMenuWithProducts(businessId: number) {
  try {
    const allMenuProducts = await prisma.business_food_menu_card_detail_view.findMany({
      where: { BUSINESS_ID: businessId },
      orderBy: [
        { BUSINESS_FOOD_MENU_CARD_ID: "asc" },
        { BUSINESS_PRODUCT_CATEGORY_ID : 'asc'}
      ]
    });
    return allMenuProducts as business_food_menu_card_detail_view[];
  } catch (error) {
    console.error('Error fetching business menu with products:', error);
    return [];
  }
}