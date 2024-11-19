import React, { useState } from "react";
import styled from "styled-components";
import { reviewApi } from "../../api/review";
import { useUser } from "../../hooks/useUser";
import Button from "../../components/Button";
import { ReviewListTypes, ReviewRegister } from "../../types/review/Review";

interface ReviewFormProps {
  store: string;
  onReviewSubmitted: (newReview: ReviewListTypes) => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  store,
  onReviewSubmitted,
}) => {
  const { role, user } = useUser();
  const [contents, setContents] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleReviewSubmit = async () => {
    try {
      const formData: ReviewRegister = {
        user: user,
        store: store,
        contents: contents,
        role: role,
      };
      const newReview = await reviewApi.registerReview(formData);
      setContents("");
      onReviewSubmitted(newReview); // 새로운 리뷰를 부모 컴포넌트에 전달
    } catch (err: any) {
      setError(err.response?.data);
    }
  };

  return (
    <FormContainer>
      <Title>리뷰 작성</Title>
      <Textarea
        value={contents}
        onChange={(e) => setContents(e.target.value)}
        placeholder="리뷰 내용을 입력하세요."
      />
      <Button onClick={handleReviewSubmit}>등록하기</Button>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </FormContainer>
  );
};

export default ReviewForm;

const FormContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 30px auto;
  margin-top: 20px;
  padding: 16px;
  background: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h3`
  font-size: 22px;
  font-weight: bold;
  color: #222;
  margin-bottom: 16px;
  text-align: center;
`;

const Textarea = styled.textarea`
  width: 100%;
  height: 120px;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #d1d1d1;
  border-radius: 6px;
  resize: none;
  margin-bottom: 16px;
  background-color: #fff;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: border-color 0.3s;

  &:focus {
    border-color: #4caf50;
    outline: none;
  }

  &::placeholder {
    color: #b0b0b0;
  }
`;

const ErrorMessage = styled.p`
  margin-top: 12px;
  color: #e74c3c;
  font-size: 14px;
  text-align: center;
  background: #ffecec;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ffcccc;
`;
