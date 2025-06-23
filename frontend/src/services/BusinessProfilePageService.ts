"use server";

import { prisma } from "../lib/prisma";

export async function getBusinesses() {
  try {
    const businesses = await prisma.business_detail_view_all.findMany({
      take: 9 // Limit to 9 results
    })
    // Return as is - already using uppercase field names from the DB view
    return businesses
  } catch (error) {
    console.error('Error fetching businesses:', error)
    return []
  }
}

export async function getBusinessById(id: number) {
  try {
    const business = await prisma.business_detail_view_all.findUnique({
      where: {
        BUSINESS_ID: id
      }
    })
    return business
  } catch (error) {
    console.error('Error fetching business:', error)
    return null
  }
}

// export async function getBusinessReviews(businessId: number) {
//   try {
//     const reviews = await prisma.visitor_business_review.findMany({
//       where: { BUSINESS_ID: businessId },
//       orderBy: { CREATION_DATETIME: "desc" },
//     });
//     return reviews;
//   } catch (error) {
//     console.error("Error fetching business reviews:", error);
//     return [];
//   }
// }

// utils/mockData.ts

export async function getBusinessReviews(businessId: number, count = 5) {
  const firstNames = ['James', 'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'William', 'Sophia', 'Benjamin', 'Isabella', 'Lucas', 'Mia', 'Henry', 'Charlotte', 'Alexander'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson'];
  
  const comments = [
      "The service was exceptional - staff went above and beyond!",
      "Food was delicious but the wait time was longer than expected",
      "Ambiance was perfect for our anniversary dinner",
      "Had a great experience, would definitely come back",
      "Portion sizes were smaller than expected for the price",
      "Loved the live music and friendly atmosphere",
      "Clean facilities and COVID-safe practices",
      "Manager handled our complaint professionally",
      "Best coffee I've had in this neighborhood!",
      "Convenient location but parking was challenging",
      "Staff was attentive and knowledgeable about the menu",
      "The outdoor seating area needs better maintenance",
      "Perfect place for business meetings",
      "Desserts were absolutely divine",
      "Vegetarian options were limited but tasty"
  ];
  
  const mockReviews = Array.from({ length: count }, (_, i) => {
      const id = i + 1;
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      
      // More natural date distribution (recent dates more common)
      const daysAgo = Math.floor(Math.pow(Math.random() * 365, 1.5));
      const creationDate = new Date(Date.now() - daysAgo * 86400000);
      
      // Rating distribution (bell curve centered around 4)
      const ratingRoll = Math.random();
      const rating = ratingRoll < 0.7 ? 4 : 
                    ratingRoll < 0.9 ? 5 : 
                    ratingRoll < 0.95 ? 3 : 2;
      
      // Generate realistic number of photos
      const photoCount = Math.min(10, Math.floor(Math.random() * 4) + Math.floor(Math.random() * 3));
      const photos = Array.from({length: 10}, (_, idx) => 
          idx < photoCount ? `https://picsum.photos/seed/${businessId}${id}${idx}/400/300` : null
      );
      
      // 15% chance of having a video
      const hasVideo = Math.random() < 0.15;
      
      return {
          VISITOR_BUSINESS_REVIEW_ID: id,
          CREATION_DATETIME: creationDate,
          VISITOR_ID: Math.floor(1000 + Math.random() * 9000),
          VISITOR_NAME: `${firstName} ${lastName}`,
          BUSINESS_ID: businessId,
          RATING: rating.toString(),
          REMARKS: comments[Math.floor(Math.random() * comments.length)],
          PIC_1: photos[0],
          PIC_2: photos[1],
          PIC_3: photos[2],
          PIC_4: photos[3],
          PIC_5: photos[4],
          PIC_6: photos[5],
          PIC_7: photos[6],
          PIC_8: photos[7],
          PIC_9: photos[8],
          PIC_10: photos[9],
          VIDEO_1: hasVideo ? `https://example.com/videos/${businessId}/${id}.mp4` : null,
          THUMB_UP_COUNT: Math.floor(Math.random() * 50),
          THUMB_DOWN_COUNT: Math.floor(Math.random() * 5),
          LIKE_COUNT: Math.floor(Math.random() * 30),
          RESPONSE: Math.random() > 0.7 ? "Thank you for your feedback! We hope to serve you again soon." : null,
          RESPONSE_DATETIME: Math.random() > 0.7 ? new Date(creationDate.getTime() + 86400000 * (1 + Math.floor(Math.random() * 3))) : null
      };
  });

  return mockReviews;
}