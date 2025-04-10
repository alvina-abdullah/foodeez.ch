// Restaurant data service
// This service fetches restaurant data from external APIs or backend services

export interface Restaurant {
  id: number;
  name: string;
  description: string;
  rating: number;
  priceLevel: string;
  cuisine: string;
  location: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  imageUrl: string;
  website?: string;
  phone?: string;
  openingHours?: {
    [key: string]: string;
  };
}

// Mock data that would come from a backend API
const mockRestaurants: Restaurant[] = [
  {
    id: 101,
    name: "Spice Garden",
    description: "Authentic Indian cuisine with a modern twist, offering a wide range of dishes from across the Indian subcontinent.",
    rating: 4.5,
    priceLevel: "$$",
    cuisine: "Indian",
    location: {
      address: "123 Spice Street",
      city: "Zurich",
      state: "ZH",
      postalCode: "8001",
      country: "Switzerland"
    },
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    website: "https://spicegarden.example.com",
    phone: "+41 23 456 7890",
    openingHours: {
      "Monday": "11:00 - 22:00",
      "Tuesday": "11:00 - 22:00",
      "Wednesday": "11:00 - 22:00",
      "Thursday": "11:00 - 22:00",
      "Friday": "11:00 - 23:00",
      "Saturday": "11:00 - 23:00",
      "Sunday": "12:00 - 21:00"
    }
  },
  {
    id: 102,
    name: "Taj Mahal",
    description: "Luxurious Pakistani and Indian restaurant serving authentic dishes in an elegant setting.",
    rating: 4.7,
    priceLevel: "$$$",
    cuisine: "Pakistani",
    location: {
      address: "45 Royal Avenue",
      city: "Geneva",
      state: "GE",
      postalCode: "1201",
      country: "Switzerland"
    },
    imageUrl: "https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    website: "https://tajmahal.example.com",
    phone: "+41 22 345 6789"
  },
  {
    id: 103,
    name: "Curry House",
    description: "Family-run restaurant offering a selection of traditional Indian curries at affordable prices.",
    rating: 4.3,
    priceLevel: "$",
    cuisine: "Indian",
    location: {
      address: "78 Market Square",
      city: "Basel",
      state: "BS",
      postalCode: "4001",
      country: "Switzerland"
    },
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    phone: "+41 61 234 5678"
  },
  {
    id: 104,
    name: "Delhi Darbar",
    description: "Modern Indian restaurant with a focus on halal options and vegetarian specialties.",
    rating: 4.1,
    priceLevel: "$$",
    cuisine: "Indian",
    location: {
      address: "12 Lake View",
      city: "Lausanne",
      state: "VD",
      postalCode: "1001",
      country: "Switzerland"
    },
    imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    website: "https://delhidarbar.example.com",
    phone: "+41 21 345 6789"
  },
  {
    id: 105,
    name: "La Trattoria",
    description: "Authentic Italian restaurant serving homemade pasta and wood-fired pizza.",
    rating: 4.6,
    priceLevel: "$$",
    cuisine: "Italian",
    location: {
      address: "34 Olive Street",
      city: "Zurich",
      state: "ZH",
      postalCode: "8002",
      country: "Switzerland"
    },
    imageUrl: "https://images.unsplash.com/photo-1555992336-03a23c7b20ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    website: "https://latrattoria.example.com",
    phone: "+41 44 123 4567"
  },
  {
    id: 106,
    name: "Sakura Sushi",
    description: "Premium Japanese sushi restaurant with fresh fish imported daily.",
    rating: 4.8,
    priceLevel: "$$$",
    cuisine: "Japanese",
    location: {
      address: "56 Cherry Blossom Road",
      city: "Geneva",
      state: "GE",
      postalCode: "1202",
      country: "Switzerland"
    },
    imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    website: "https://sakurasushi.example.com",
    phone: "+41 22 987 6543"
  }
];

// Function to simulate API call to fetch featured restaurants
export const getFeaturedRestaurants = async (): Promise<Restaurant[]> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      resolve(mockRestaurants);
    }, 500);
  });
};

// Function to get a single restaurant by ID
export const getRestaurantById = async (id: number): Promise<Restaurant | null> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      const restaurant = mockRestaurants.find(r => r.id === id) || null;
      resolve(restaurant);
    }, 300);
  });
};

// Function to get restaurants by city
export const getRestaurantsByCity = async (city: string): Promise<Restaurant[]> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      const restaurants = mockRestaurants.filter(
        r => r.location.city.toLowerCase() === city.toLowerCase()
      );
      resolve(restaurants);
    }, 300);
  });
};

// Function to search restaurants
export const searchRestaurants = async (query: string): Promise<Restaurant[]> => {
  // In a real app, this would be an API call with proper search logic
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      const normalizedQuery = query.toLowerCase();
      const restaurants = mockRestaurants.filter(
        r => 
          r.name.toLowerCase().includes(normalizedQuery) ||
          r.description.toLowerCase().includes(normalizedQuery) ||
          r.cuisine.toLowerCase().includes(normalizedQuery) ||
          r.location.city.toLowerCase().includes(normalizedQuery)
      );
      resolve(restaurants);
    }, 300);
  });
}; 