'use server';

import prisma from "@/lib/prisma";


export async function getFoodJourney() {
    try {
      const journey = await prisma.visitor_food_journey_view.findMany({});
      return journey;
    } catch (error) {
      console.error('Error fetching food journey:', error);
      return [];
    }
  }

export async function getFoodJourneyById(id: number) {
    try {
        const journey = await prisma.visitor_food_journey_view.findUnique({
            where: { VISITOR_FOOD_JOURNEY_ID: id },
        });
        return journey;
        } catch (error) {
        console.error('Error fetching food journey by ID:', error);
        return null;
    }
}
