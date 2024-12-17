import React, { useState } from "react";
import styled from "styled-components";
import { reviewApi } from "../../api/review";
import { useUser } from "../../hooks/useUser";
import Button from "../../components/Button";
import { ReviewFormProps, ReviewRegister } from "../../types/review/Review";

const ReviewForm: React.FC<ReviewFormProps> = ({
  store,
  onReviewSubmitted,
}) => {
  const { role, user } = useUser();
  const [contents, setContents] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [secretReview, setSecretReview] = useState<boolean>(false); // secretReview 상태 추가
  const [password, setPassword] = useState<string>(""); // 비밀번호 상태 추가

  const handleReviewSubmit = async () => {
    try {
      const formData: ReviewRegister = {
        user: user,
        store: store,
        contents: contents,
        role: role,
        secretReview: secretReview,
        password: secretReview ? password : undefined,
      };
      const newReview = await reviewApi.registerReview(formData);
      setContents("");
      setError(null);
      setPassword("");
      setSecretReview(false);
      onReviewSubmitted(newReview);
    } catch (err: any) {
      alert(err.response?.data?.message);
    }
  };

  const handleSecretReviewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSecretReview(e.target.checked);
  };

  return (
    <FormContainer>
      <Textarea
        value={contents}
        onChange={(e) => setContents(e.target.value)}
        placeholder="리뷰 내용을 입력하세요."
      />

      {/* 비밀리뷰 체크박스 */}
      <Label>
        <input
          type="checkbox"
          checked={secretReview}
          onChange={handleSecretReviewChange}
        />
        비밀 리뷰로 작성
      </Label>

      {/* 비밀리뷰일 경우 비밀번호 입력란 */}
      {secretReview && (
        <PasswordInput
          type="text" // 숫자만 허용하지만 type="password" 대신 text를 사용하여 필터링 구현
          value={password}
          onChange={(e) => {
            const input = e.target.value;
            if (/^\d*$/.test(input) && input.length <= 4) {
              setPassword(input);
            }
          }}
          placeholder="숫자 4자리를 입력하세요"
        />
      )}

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

const Label = styled.label`
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  margin-bottom: 16px;
`;

const PasswordInput = styled.input`
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #d1d1d1;
  border-radius: 6px;
  margin-bottom: 16px;
  background-color: #fff;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
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
