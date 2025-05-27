export interface GooglePhoto {
  photoUrl: string;
  width: number;
  height: number;
}

export interface GoogleReview {
  author_name: string;
  rating: number;
  text: string;
  relative_time_description: string;
  profile_photo_url?: string;
}

export interface GooglePlaceDetails {
  name: string;
  rating: number;
  totalReviews: number;
  reviews: GoogleReview[];
  photos: GooglePhoto[];
  openingHours : any
}

export async function fetchGooglePlaceDetails(placeId: string): Promise<GooglePlaceDetails> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) throw new Error("Google API key is not set");
  if (!placeId) throw new Error("Place ID is required");

  const proxy = "https://cors-anywhere.herokuapp.com/";
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,photos,reviews,rating,user_ratings_total&key=${apiKey}`;

  try {
    const res = await fetch(proxy + url);
    const data = await res.json();

    if (data.status !== "OK") {
      throw new Error(data.error_message || "Failed to fetch place details");
    }

    console.log(data)

    const result = data.result;

    const reviews: GoogleReview[] = (result.reviews || []).map((review: any) => ({
      author_name: review.author_name,
      rating: review.rating,
      text: review.text,
      relative_time_description: review.relative_time_description,
      profile_photo_url: review.profile_photo_url,
    }));

    const photos: GooglePhoto[] = (result.photos || []).map((photo: any) => ({
      photoUrl: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${apiKey}`,
      width: photo.width,
      height: photo.height,
    }));

    return {
      name: result.name,
      rating: result.rating,
      totalReviews: result.user_ratings_total,
      reviews,
      photos,
      openingHours : result.openingHours
    };
  } catch (err) {
    console.error("Error fetching place details:", err);
    throw err;
  }
}
