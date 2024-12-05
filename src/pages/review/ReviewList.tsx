import React from "react";
import styled from "styled-components";
import { ReviewListProps, ReviewListTypes } from "../../types/review/Review";
import Button from "../../components/Button";
import { useUser } from "../../hooks/useUser";
import { reviewApi } from "../../api/review";

const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  onReviewDeleted,
}) => {
  const { user } = useUser();

  const handleDelete = async (review: ReviewListTypes) => {
    try {
      await reviewApi.deleteReview(review.id, user);
      onReviewDeleted(review.id);
      alert("리뷰가 삭제되었습니다.");
    } catch (err: any) {
      alert(err.response?.data);
    }
  };

  return (
    <ReviewListContainer>
      {reviews.length === 0 ? (
        <NoReviews>아직 리뷰가 없습니다.</NoReviews>
      ) : (
        reviews.map((review) => (
          <ReviewItem
            key={review.id}
            $secretReview={review.secretReview}
            data-secret-review={review.secretReview}
          >
            <ReviewHeader>
              <Username>{review.user}</Username>
            </ReviewHeader>
            <ReviewContent>
              {review.secretReview && review.password ? (
                <SecretMessage>비밀글입니다</SecretMessage>
              ) : (
                review.contents
              )}
            </ReviewContent>
            {sessionStorage.getItem("token") && user === review.user && (
              <ButtonContainer>
                <StyledButton onClick={() => handleDelete(review)}>
                  삭제
                </StyledButton>
              </ButtonContainer>
            )}
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

const ReviewItem = styled.div<{ $secretReview: boolean }>`
  background-color: ${(props) => (props.$secretReview ? "#fff" : "#f9f9f9")};
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  position: relative;
  padding-bottom: 50px;
  box-shadow: ${(props) =>
    props.$secretReview ? "0px 0px 10px rgba(0, 0, 0, 0.1)" : "none"};
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const Username = styled.span`
  font-weight: bold;
`;

const ReviewContent = styled.p`
  margin-bottom: 10px;
`;

const SecretMessage = styled.span`
  display: inline-block;
  padding: 10px;
  background-color: #f1f1f1;
  color: #333;
  font-size: 1.1em;
  font-weight: bold;
  text-align: center;
  border-radius: 5px;
`;

const ButtonContainer = styled.div`
  position: absolute;
  bottom: 15px;
  right: 15px;
  display: flex;
  gap: 10px;
`;

const StyledButton = styled(Button)`
  padding: 5px 10px;
  font-size: 0.9em;
`;

export default ReviewList;
