import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { reviewApi } from "../../api/review";
import { ReviewListTypes } from "../../types/review/Review";
interface ReviewListProps {
  reviews: ReviewListTypes[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  return (
    <ReviewListContainer>
      {reviews.length === 0 ? (
        <NoReviews>아직 리뷰가 없습니다.</NoReviews>
      ) : (
        reviews.map((review) => (
          <ReviewItem key={review.id}>
            <ReviewHeader>
              <Username>{review.user}</Username>
            </ReviewHeader>
            <ReviewContent>{review.contents}</ReviewContent>
          </ReviewItem>
        ))
      )}
    </ReviewListContainer>
  );
};

const ReviewListContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const NoReviews = styled.p`
  text-align: center;
  color: #666;
  font-style: italic;
`;

const ReviewItem = styled.div`
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const Username = styled.span`
  font-weight: bold;
`;

const Rating = styled.span`
  color: #f39c12;
`;

const ReviewContent = styled.p`
  margin-bottom: 10px;
`;

const ReviewDate = styled.span`
  color: #777;
  font-size: 0.9em;
`;

export default ReviewList;
