"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import LoginRequiredModal from "@/components/core/LoginRequiredModal";
import FoodJourneyCard from "@/components/home/FoodJourneyCard";
import { getFoodJourney, submitFoodJourney } from "@/services/HomePageService";

const initialForm = {
  TITLE: "",
  DESCRIPTION: "",
  RESTAURANT_NAME: "",
  ADDRESS_GOOGLE_URL: "",
  images: [] as File[],
};

const ShareExperiencePage = () => {
  const { data: session } = useSession();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [stories, setStories] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    fetchStories(0);
  }, []);

  const fetchStories = async (offsetVal: number) => {
    const data = await getFoodJourney();
    setStories(offsetVal === 0 ? data : [...stories, ...data]);
    setHasMore(data.length === 5);
    setOffset(offsetVal + 5);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // setForm((prev) => ({ ...prev, images: Array.from(e.target.files) }))
      // ;
    }
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
      // Upload images to /api/food-journey/upload (to be implemented)
      let uploadedImages = [];
      if (form.images.length > 0) {
        const formData = new FormData();
        form.images.forEach((file, idx) => formData.append(`image${idx+1}`, file));
        const res = await fetch("/api/food-journey/upload", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) throw new Error("Image upload failed");
        uploadedImages = await res.json(); // { PIC_1, PIC_2, PIC_4 }
      }
      const payload = {
        TITLE: form.TITLE,
        DESCRIPTION: form.DESCRIPTION,
        RESTAURANT_NAME: form.RESTAURANT_NAME,
        ADDRESS_GOOGLE_URL: form.ADDRESS_GOOGLE_URL,
        ...uploadedImages,
      };
      await submitFoodJourney(payload);
      setSuccess("Your food journey has been submitted for review!");
      setForm(initialForm);
      fetchStories(0);
    } catch (err: any) {
      setError(err.message || "Failed to submit food journey");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl md:text-5xl font-extrabold text-primary mb-8 text-center">Share Your Food Journey</h1>
      <form className="bg-white rounded-lg shadow-md p-6 mb-10" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Title</label>
          <input
            type="text"
            name="TITLE"
            value={form.TITLE}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Description</label>
          <textarea
            name="DESCRIPTION"
            value={form.DESCRIPTION}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
            rows={4}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Restaurant Name</label>
          <input
            type="text"
            name="RESTAURANT_NAME"
            value={form.RESTAURANT_NAME}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Google Maps URL (optional)</label>
          <input
            type="url"
            name="ADDRESS_GOOGLE_URL"
            value={form.ADDRESS_GOOGLE_URL}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Upload Images (up to 3)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
        </div>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <button
          type="submit"
          className="bg-primary text-white font-semibold px-6 py-2 rounded hover:bg-primary-dark transition-colors"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Share My Journey"}
        </button>
      </form>
      <h2 className="text-2xl font-bold text-secondary mb-6" id="stories">Food Journey Stories</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        {stories.map((j) => (
          <FoodJourneyCard key={j.VISITOR_FOOD_JOURNEY_ID} journey={j} />
        ))}
      </div>
      {hasMore && (
        <button
          className="px-6 py-2 rounded bg-secondary text-white font-semibold hover:bg-primary transition-all duration-300"
          onClick={() => fetchStories(offset)}
        >
          See More Food Journey Stories
        </button>
      )}
      <LoginRequiredModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
};

export default ShareExperiencePage;
