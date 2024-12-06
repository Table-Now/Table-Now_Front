export interface ReviewRegister {
  user: string | null;
  store: string;
  contents: string;
  role: string | null;
  secretReview: boolean;
  password?: string;
}

export interface ReviewListTypes {
  id: number;
  contents: string;
  createAt: string;
  user: string;
  store?: string;
  role?: string;
  secretReview: boolean;
  password?: string;
}

export interface ReviewListProps {
  reviews: ReviewListTypes[];
  onReviewDeleted: (reviewId: number) => void;
}

export interface ReviewFormProps {
  store: string;
  onReviewSubmitted: (newReview: ReviewListTypes) => void;
}

export interface ReviewPassword {
  id: number;
  user: string;
  password: string;
}
