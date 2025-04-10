// Review data service
// This service fetches review data from external APIs or backend services

import { ReviewData } from "@/features/reviews/components/ReviewCard";

// Mock data that would come from a backend API
const mockReviews: ReviewData[] = [
  {
    id: '1',
    userId: 'user-1',
    businessId: 101,
    rating: 4,
    comment: 'The restaurant was not at all crowded and was very posh and good looking. The restaurant was very clean and staff was polite.',
    createdAt: '2023-08-15T12:00:00Z',
    user: {
      NAME: 'Glenn Robertson',
      PROFILE_IMAGE: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    business: {
      BUSINESS_NAME: 'Spice Garden',
      IMAGE_URL: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      ADDRESS_TOWN: 'Zurich',
      GOOGLE_RATING: '4.5'
    },
    images: [
      { src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', alt: 'Restaurant interior' },
      { src: 'https://images.unsplash.com/photo-1631515242808-497c3fbd3949?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', alt: 'Food dish' }
    ]
  },
  {
    id: '2',
    userId: 'user-2',
    businessId: 102,
    rating: 5,
    comment: 'Best Pakistani food that I\'ve ever tasted! Great presentation, friendly staff and affordable price! Close to the city center, I recommend.',
    createdAt: '2022-09-20T15:30:00Z',
    user: {
      NAME: 'Léa Keller',
      PROFILE_IMAGE: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    business: {
      BUSINESS_NAME: 'Taj Mahal',
      IMAGE_URL: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      ADDRESS_TOWN: 'Geneva',
      GOOGLE_RATING: '4.7'
    },
    images: [
      { src: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', alt: 'Food plate' },
      { src: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', alt: 'Restaurant view' }
    ]
  },
  {
    id: '3',
    userId: 'user-3',
    businessId: 103,
    rating: 5,
    comment: 'Good Indian restaurant in an area with many options, with affordable prices and a buffet for dinner. Also love the interior design.',
    createdAt: '2023-06-10T18:45:00Z',
    user: {
      NAME: 'Amin Diallo',
      PROFILE_IMAGE: 'https://randomuser.me/api/portraits/men/75.jpg'
    },
    business: {
      BUSINESS_NAME: 'Curry House',
      IMAGE_URL: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      ADDRESS_TOWN: 'Basel',
      GOOGLE_RATING: '4.3'
    },
    images: [
      { src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', alt: 'Restaurant interior view' }
    ]
  },
  {
    id: '4',
    userId: 'user-4',
    businessId: 104,
    rating: 4,
    comment: 'They served halal Indian food. Vegetable curry was so nice. Although environment is quite dark and modern in style.',
    createdAt: '2023-02-05T19:20:00Z',
    user: {
      NAME: 'Aisha Waheed',
      PROFILE_IMAGE: 'https://randomuser.me/api/portraits/women/33.jpg'
    },
    business: {
      BUSINESS_NAME: 'Delhi Darbar',
      IMAGE_URL: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      ADDRESS_TOWN: 'Lausanne',
      GOOGLE_RATING: '4.1'
    },
    images: [
      { src: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', alt: 'Food dish' },
      { src: 'https://images.unsplash.com/photo-1533777324565-a040eb52facd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', alt: 'Restaurant' }
    ]
  },
  {
    id: '5',
    userId: 'user-5',
    businessId: 105,
    rating: 5,
    comment: 'Authentic Italian cuisine at its best! The homemade pasta was exceptional, and the service was impeccable. Will definitely be back.',
    createdAt: '2023-05-18T13:15:00Z',
    user: {
      NAME: 'Marco Rossi',
      PROFILE_IMAGE: 'https://randomuser.me/api/portraits/men/42.jpg'
    },
    business: {
      BUSINESS_NAME: 'La Trattoria',
      IMAGE_URL: 'https://images.unsplash.com/photo-1555992336-03a23c7b20ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      ADDRESS_TOWN: 'Zurich',
      GOOGLE_RATING: '4.6'
    },
    images: [
      { src: 'https://images.unsplash.com/photo-1555992336-03a23c7b20ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', alt: 'Italian pasta' },
      { src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', alt: 'Pizza dish' }
    ]
  },
  {
    id: '6',
    userId: 'user-6',
    businessId: 106,
    rating: 5,
    comment: 'The sushi here is absolutely divine! Fresh, beautifully presented, and the flavors are authentic. The chef clearly takes pride in his craft.',
    createdAt: '2023-07-22T19:40:00Z',
    user: {
      NAME: 'Yuki Tanaka',
      PROFILE_IMAGE: 'https://randomuser.me/api/portraits/women/67.jpg'
    },
    business: {
      BUSINESS_NAME: 'Sakura Sushi',
      IMAGE_URL: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      ADDRESS_TOWN: 'Geneva',
      GOOGLE_RATING: '4.8'
    },
    images: [
      { src: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', alt: 'Sushi plate' },
      { src: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', alt: 'Sashimi' }
    ]
  }
];

// Function to get all reviews
export const getAllReviews = async (): Promise<ReviewData[]> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockReviews);
    }, 500);
  });
};

// Function to get high-rated reviews
export const getHighRatedReviews = async (limit: number = 4): Promise<ReviewData[]> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const sortedReviews = [...mockReviews]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit);
      resolve(sortedReviews);
    }, 500);
  });
};

// Function to get reviews for a specific restaurant
export const getReviewsByRestaurantId = async (businessId: number): Promise<ReviewData[]> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredReviews = mockReviews.filter(
        review => review.businessId === businessId
      );
      resolve(filteredReviews);
    }, 300);
  });
};

// Function to get reviews by a specific user
export const getReviewsByUserId = async (userId: string): Promise<ReviewData[]> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredReviews = mockReviews.filter(
        review => review.userId === userId
      );
      resolve(filteredReviews);
    }, 300);
  });
}; 