import { notFound } from 'next/navigation';
import RestaurantDetailClient from './RestaurantDetailClient';
import { Metadata } from 'next';
import { CloudCog } from 'lucide-react';
import { prisma } from '@/lib/prisma';

interface RestaurantDetailPageProps {
  params: { businessId: string };
}

// Function to fetch detailed restaurant data
async function getRestaurantDetails(id: number) {
  try {
    const business = await prisma.business.findUnique({
      where: { id: id, approved: 1, status: 1 },
      include: {
        businessCategories: {
          include: {
            category: true,
          },
        },
        foodTypes: {
          include: {
            foodType: true,
          }
        },
        businessRating: true,
        businessReviews: {
          orderBy: {
            CREATION_DATETIME: 'desc',
          },
        },
        foodMenus: {
          include: {
            food_menu_items: {
              where: { DISPLAY: 1 },
              orderBy: {
                TITLE: 'asc',
              },
            },
          },
          orderBy: {
            TITLE: 'asc',
          },
        },
      },
    });

    if (!business) {
      return null;
    }

    // Calculate average rating
    const reviews = business.businessReviews || [];
    const googleRating = parseFloat(business.GOOGLE_RATING || '0') || 0;
    const ratingCount = reviews.length;
    let avgRating = googleRating;
    
    if (ratingCount > 0) {
      const reviewsAvg = reviews.reduce((sum, review) => sum + (review.RATING || 0), 0) / ratingCount;
      avgRating = (googleRating * 0.7) + (reviewsAvg * 0.3); // Weighted average
    }

    return {
      ...business,
      avgRating: parseFloat(avgRating.toFixed(1)),
    };
  } catch (error) {
    console.error('Error fetching restaurant details:', error);
    return null;
  }
}

// Generate dynamic metadata for the page
export async function generateMetadata(
  { params }: RestaurantDetailPageProps
): Promise<Metadata> {
  const businessId = parseInt(params.businessId);
  if (isNaN(businessId)) {
    return { title: 'Restaurant Not Found | Foodeez' };
  }

  const restaurant = await getRestaurantDetails(businessId);

  if (!restaurant) {
    return { title: 'Restaurant Not Found | Foodeez' };
  }

  return {
    title: `${restaurant.BUSINESS_NAME || 'Restaurant'} | Foodeez`,
    description: restaurant.DESCRIPTION || `Details about ${restaurant.BUSINESS_NAME || 'this restaurant'}. View menu, reviews, and more.`,
    openGraph: {
      title: `${restaurant.BUSINESS_NAME || 'Restaurant'} | Foodeez`,
      description: restaurant.DESCRIPTION || '',
      images: restaurant.IMAGE_URL ? [{ url: restaurant.IMAGE_URL }] : [],
    },
  };
}

// The main page component
export default async function RestaurantDetailPage({ params }: RestaurantDetailPageProps) {
  const businessId = parseInt(params.businessId);
  console.log(businessId)

  if (isNaN(businessId)) {
    notFound();
  }

  const restaurant = await getRestaurantDetails(businessId);

  if (!restaurant) {
    notFound();
  }

  return <RestaurantDetailClient restaurant={restaurant} />;
} 