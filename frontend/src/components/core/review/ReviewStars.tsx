import { Star } from "lucide-react";

interface ReviewStarsProps {
  rating: number | null | undefined;
  size?: number;
  className?: string;
}

const ReviewStars: React.FC<ReviewStarsProps> = ({
  rating,
  size = 16,
  className = "",
}) => {
  const totalStars = 5;
  const starRating = rating ?? 0;

  return (
    <div className={`flex items-center ${className}`}>
      {Array.from({ length: totalStars }, (_, index) => {
        const starNumber = index + 1;
        return (
          <Star
            key={index}
            size={size}
            className={`${
              starRating >= starNumber ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }`}
          />
        );
      })}
    </div>
  );
};

export default ReviewStars; 