"use client"

import { getFeaturedBusiness } from "@/services/database/featuredBusinessService"
import { useEffect, useState } from "react"

// Define a simplified type that matches what we expect from the server
type BusinessData = {
  Business_ID: number;
  BUSINESS_NAME: string | null;
  DESCRIPTION: string | null;
  [key: string]: any;
};

export default function CheckData() {
    const [restaurants, setRestaurants] = useState<BusinessData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFeaturedRestaurants = async () => {
            try {
                setIsLoading(true);
                const data = await getFeaturedBusiness();
                setRestaurants(data as BusinessData[]);
                setError(null);
            } catch (error) {
                console.error('Error fetching restaurants:', error);
                setError('Failed to load restaurants');
            } finally {
                setIsLoading(false);
            }
        };

        fetchFeaturedRestaurants();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Restaurant Data Check</h1>
            
            {isLoading && <p>Loading...</p>}
            
            {error && <p className="text-red-500">{error}</p>}
            
            {!isLoading && !error && restaurants.length === 0 && 
                <p>No restaurants found</p>
            }
            
            {restaurants.map(item => (
                <div key={item.Business_ID} className="border p-4 mb-2 rounded">
                    <h2 className="text-xl font-semibold">{item.BUSINESS_NAME}</h2>
                    <p className="text-gray-600">{item.DESCRIPTION}</p>
                </div>
            ))}
        </div>
    )
}