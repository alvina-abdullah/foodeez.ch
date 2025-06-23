import Image from 'next/image';
import React, { useState, ChangeEvent, FormEvent } from 'react';

interface ReviewFormProps {
  businessId: number;
  onSuccess: () => void;
}

const MAX_IMAGES = 3;

const ReviewForm: React.FC<ReviewFormProps> = ({ businessId, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [remarks, setRemarks] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).slice(0, MAX_IMAGES);
    setImages(files);
  };

  const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setVideo(e.target.files[0]);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('businessId', String(businessId));
      formData.append('rating', String(rating));
      formData.append('remarks', remarks);
      images.forEach((img, idx) => formData.append(`image${idx + 1}`, img));
      if (video) formData.append('video', video);

      const res = await fetch('/api/reviews', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit review');
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6 p-4 w-full max-w-lg mx-auto" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-2">Write a Review</h2>
      <div>
        <label className="block font-medium mb-1">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              className={
                star <= rating
                  ? 'text-yellow-500 text-2xl'
                  : 'text-gray-300 text-2xl'
              }
              onClick={() => setRating(star)}
              aria-label={`Set rating to ${star}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block font-medium mb-1">Remarks</label>
        <textarea
          className="w-full border rounded p-2 min-h-[80px]"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          required
          maxLength={1000}
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Images (up to 3)</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          disabled={images.length >= MAX_IMAGES}
        />
        <div className="flex gap-2 mt-2">
          {images.map((img, idx) => (
            <div key={idx} className="w-16 h-16 rounded overflow-hidden border">
              <Image
                src={URL.createObjectURL(img)}
                alt={`Preview ${idx + 1}`}
                className="object-cover w-full h-full"
                width={64}
                height={64}
              />
            </div>
          ))}
        </div>
      </div>
      <div>
        <label className="block font-medium mb-1">Video (optional)</label>
        <input type="file" accept="video/*" onChange={handleVideoChange} />
        {video && (
          <video src={URL.createObjectURL(video)} controls className="w-32 h-20 mt-2 rounded" />
        )}
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button
        type="submit"
        className="btn-primary w-full"
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};

export default ReviewForm;