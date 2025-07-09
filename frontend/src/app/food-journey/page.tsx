"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import LoginRequiredModal from "@/components/core/LoginRequiredModal";
import { getFoodJourney } from "@/services/FoodJourney";
import FoodJourneyForm from "@/components/core/food-journey/FoodJourneyForm";
import FoodJourneyGrid from "@/components/core/food-journey/FoodJourneyGrid";
import FoodJourneyPagination from "@/components/core/food-journey/FoodJourneyPagination";
import FoodJourneyGridSkeleton from "@/components/core/food-journey/FoodJourneyGridSkeleton";

const initialForm = {
  TITLE: "",
  DESCRIPTION: "",
  RESTAURANT_NAME: "",
  ADDRESS_GOOGLE_URL: "",
  images: [] as File[],
};

const foodJourneyPage = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [allStories, setAllStories] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const limit = 9;
  
  const { data: session } = useSession();
  useEffect(() => {
    fetchStories();
  }, []);

  // Generate image previews when images change
  useEffect(() => {
    if (images.length === 0) {
      setImagePreviews([]);
      return;
    }
    const urls = images.map((file) => URL.createObjectURL(file));
    setImagePreviews(urls);
    // Cleanup
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [images]);

  const fetchStories = async () => {
    const data = await getFoodJourney();
    setAllStories(data);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    // Only allow up to 3 images
    const newImages = [...images, ...files].slice(0, 3);
    setImages(newImages);
  };

  const handleRemoveImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!session) {
      setShowLoginModal(true);
      return;
    }
    setSubmitting(true);

    try {
      const res = await fetch("/api/food-journey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to submit food journey");

      setSuccess("Your food journey has been submitted for review!");
      setForm(initialForm);
      setImages([]);
      fetchStories();
      
    } catch (err: any) {
      setError(err.message || "Failed to submit food journey");
    } finally {
      setSubmitting(false);
    }
  };

  const total = allStories.length;
  const paginatedStories = allStories.slice((page - 1) * limit, page * limit);

  return (
    <div className="px-4 lg:px-0 py-12">
      <h1 className="main-heading text-center mb-10" id="stories">
        Food Journey Stories
      </h1>
      {allStories.length === 0 && !submitting ? (
        <FoodJourneyGridSkeleton />
      ) : (
        <>
          <FoodJourneyGrid stories={paginatedStories} />
          {total > limit && (
            <FoodJourneyPagination
              page={page}
              limit={limit}
              total={total}
              onPageChange={setPage}
            />
          )}
        </>
      )}
      <h2 className="sub-heading text-center mb-10" id="shareFoodJourneyStory">
        Share Your Food Journey
      </h2>
      <FoodJourneyForm
        form={form}
        onInputChange={handleInputChange}
        onImageChange={handleImageChange}
        onRemoveImage={handleRemoveImage}
        imagePreviews={imagePreviews}
        onSubmit={handleSubmit}
        submitting={submitting}
        error={error}
        success={success}
      />
      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
};

export default foodJourneyPage;
