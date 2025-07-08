export interface FoodeezReview {
  FOODEEZ_REVIEW_ID: bigint;
  CREATION_DATETIME: Date | null;
  REVIEWER_NAME: string | null;
  REVIEWER_EMAIL: string | null;
  AVATAR: string | null;
  RATING: number | null;
  REVIEW: string | null;
  PIC_1: string | null;
  PIC_2: string | null;
  PIC_3: string | null;
  APPROVED: number | null;
}

export interface CreateFoodeezReviewData {
  REVIEWER_NAME?: string;
  REVIEWER_EMAIL?: string;
  AVATAR?: string;
  RATING: number;
  REVIEW: string;
  PIC_1?: string;
  PIC_2?: string;
  PIC_3?: string;
}

export interface UpdateFoodeezReviewData {
  REVIEWER_NAME?: string;
  REVIEWER_EMAIL?: string;
  AVATAR?: string;
  RATING?: number;
  REVIEW?: string;
  PIC_1?: string;
  PIC_2?: string;
  PIC_3?: string;
  APPROVED?: number;
}

export interface ReviewFormData {
  rating: number;
  review: string;
  images: File[];
}