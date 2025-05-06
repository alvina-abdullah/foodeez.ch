// components/action-buttons.tsx
"use client";
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Heart, Share2, Star } from "lucide-react";
// import { toast } from "react-hot-toast";

interface ActionButtonsProps {
  onFavorite?: (isFavorite: boolean) => void;
  onShare?: () => void;
  onReview?: () => void;
}

export function ActionButtons({ onFavorite, onShare, onReview }: ActionButtonsProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const handleFavorite = () => {
    const newState = !isFavorite;
    setIsFavorite(newState);
    onFavorite?.(newState);
    // toast.success(newState ? 'Added to favorites' : 'Removed from favorites');
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title: document.title,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        // toast.success('Link copied to clipboard!');
      }
      onShare?.();
    } catch (error) {
    //   toast.error('Sharing failed');
    } finally {
      setIsSharing(false);
    }
  };

  const handleReview = () => {
    onReview?.();
    const reviewSection = document.getElementById('reviews-section');
    reviewSection?.scrollIntoView({ behavior: 'smooth' });
    // toast('Share your experience with us!', { icon: '✍️' });
  };

  return (
    <div className="grid grid-cols-1 md:flex md:items-center justify-between gap-3 mb-8 w-full">
      <Button
        variant={isFavorite ? "default" : "outline"}
        className="flex items-center justify-center gap-2 transition-all"
        onClick={handleFavorite}
      >
        <Heart 
          className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} 
          strokeWidth={isFavorite ? 2 : 1.5}
        />
        <span>{isFavorite ? 'Favorited' : 'Save as Favorite'}</span>
      </Button>

      <Button
        variant="outline"
        className="flex items-center justify-center gap-2"
        onClick={handleShare}
        disabled={isSharing}
      >
        <Share2 className="h-4 w-4" />
        <span>{isSharing ? 'Sharing...' : 'Share Location'}</span>
      </Button>

      <Button
        variant="outline"
        className="flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 border-emerald-200"
        onClick={handleReview}
      >
        <Star className="h-4 w-4 text-emerald-600" />
        <span className="text-emerald-700">Add Review</span>
      </Button>
    </div>
  );
}