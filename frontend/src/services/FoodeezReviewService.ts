import { FoodeezReview, CreateFoodeezReviewData, UpdateFoodeezReviewData } from '@/types/foodeez-review.types';

const API_BASE = '/api/foodeez-reviews';

export class FoodeezReviewService {
  static async getReviews(params?: {
    approved?: number;
    limit?: number;
    offset?: number;
  }): Promise<FoodeezReview[]> {
    const searchParams = new URLSearchParams();
    if (params?.approved !== undefined) searchParams.append('approved', params.approved.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.offset) searchParams.append('offset', params.offset.toString());

    const response = await fetch(`${API_BASE}?${searchParams.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }
    return response.json();
  }

  static async getReview(id: string): Promise<FoodeezReview> {
    const response = await fetch(`${API_BASE}/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch review');
    }
    return response.json();
  }

  static async createReview(data: CreateFoodeezReviewData): Promise<FoodeezReview> {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create review');
    }

    return response.json();
  }

  static async updateReview(id: string, data: UpdateFoodeezReviewData): Promise<FoodeezReview> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update review');
    }

    return response.json();
  }

  static async deleteReview(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete review');
    }
  }

  static async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload-profile-image', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.imageUrl;
  }
} 