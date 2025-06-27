import StarIcon from "@/components/ui/StarIcon";

interface ReviewStarsProps {
  ratingValue: number;
  ratingRaw?: string | number;
}

export default function ReviewStars({ ratingValue, ratingRaw }: ReviewStarsProps) {
  return (
    <div className="flex items-center gap-1 mb-2">
      {[...Array(5)].map((_, i) => (
        <StarIcon
          key={i}
          fillLevel={i < ratingValue ? 1 : 0}
          size={22}
          className={i < ratingValue ? 'text-highlight drop-shadow' : 'text-gray-800'}
        />
      ))}
      <span className="text-sm lg:text-base text-text-main ml-1 font-medium">
        {typeof ratingRaw !== 'undefined' ? Number(ratingRaw).toFixed(1) : ratingValue.toFixed(1)}
      </span>
    </div>
  );
} 