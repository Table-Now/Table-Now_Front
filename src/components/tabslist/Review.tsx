import React, { useState } from "react";
import { ReviewListTypes, ReviewProps } from "../../types/review/Review";
import ReviewForm from "../../pages/review/ReviewForm";
import ReviewList from "../../pages/review/ReviewList";

const Review: React.FC<ReviewProps> = ({
  reviews,
  storeDetail,
  setReviews,
}) => {
  const handleReviewSubmitted = (newReview: ReviewListTypes) => {
    setReviews((prevReviews) => [newReview, ...prevReviews]);
  };

  const handleReviewDeleted = (deletedReviewId: number) => {
    setReviews((prevReviews) =>
      prevReviews.filter((review) => review.id !== deletedReviewId)
    );
  };

  return (
    <div>
      {sessionStorage.getItem("token") && (
        <ReviewForm
          store={storeDetail ?? ""}
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}
      <ReviewList reviews={reviews} onReviewDeleted={handleReviewDeleted} />
    </div>
  );
};

export default Review;
