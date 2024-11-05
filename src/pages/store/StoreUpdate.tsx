import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { storeApi } from "../../api/store";
import { StoreDetailType } from "../../types/stores/detail";
import Button from "../../components/Button";

const StoreUpdate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [storeData, setStoreData] = useState<StoreDetailType>({
    store: "",
    storeLocation: "",
    storeImg: "",
    storeContents: "",
    storeOpen: "",
    storeClose: "",
    storeWeekOff: "",
  });

  useEffect(() => {
    const fetchStoreDetail = async () => {
      try {
        const response = await storeApi.getStoreDetail(Number(id));
        setStoreData(response);
      } catch (err: any) {
        alert(err.response?.data);
      }
    };
    fetchStoreDetail();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setStoreData((prevData) => ({ ...prevData, [name]: value }));
  };

  // 체크박스 변경 처리
  const handleWeekOffChange = (day: string) => {
    setStoreData((prev) => {
      const currentDays = prev.storeWeekOff?.split(",").filter(Boolean) || [];
      if (currentDays.includes(day)) {
        // 이미 체크된 경우, 제거
        const updatedDays = currentDays.filter((d) => d !== day);
        return { ...prev, storeWeekOff: updatedDays.join(",") };
      } else {
        // 체크되지 않은 경우, 추가
        return { ...prev, storeWeekOff: [...currentDays, day].join(",") };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await storeApi.updateStore(Number(id), storeData);
      navigate(`/store/${id}`);
    } catch (error) {
      console.error("Failed to update store:", error);
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <Title>수정</Title>

      <Label>상점 이름</Label>
      <Input
        type="text"
        name="store"
        value={storeData.store}
        onChange={handleChange}
      />

      <Label>위치</Label>
      <Input
        type="text"
        name="storeLocation"
        value={storeData.storeLocation}
        onChange={handleChange}
      />

      <Label>상점 이미지</Label>
      <Input
        type="text"
        name="storeImg"
        value={storeData.storeImg}
        onChange={handleChange}
      />

      <Label>상점 소개</Label>
      <Textarea
        name="storeContents"
        value={storeData.storeContents}
        onChange={handleChange}
      />

      <TimeContainer>
        <FormGroup>
          <Label>오픈 시간</Label>
          <Input
            type="time"
            name="storeOpen"
            value={storeData.storeOpen}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Label>마감 시간</Label>
          <Input
            type="time"
            name="storeClose"
            value={storeData.storeClose}
            onChange={handleChange}
          />
        </FormGroup>
      </TimeContainer>

      <FormGroup>
        <Label>휴무일</Label>
        <CheckboxGroup>
          {[
            "월요일",
            "화요일",
            "수요일",
            "목요일",
            "금요일",
            "토요일",
            "일요일",
          ].map((day) => (
            <CheckboxLabel key={day}>
              <CheckboxInput
                type="checkbox"
                checked={
                  storeData.storeWeekOff?.split(",").includes(day) || false
                }
                onChange={() => handleWeekOffChange(day)}
              />
              {day}
            </CheckboxLabel>
          ))}
        </CheckboxGroup>
      </FormGroup>

      <ButtonContainer>
        <Button type="submit">저장</Button>
        <Button type="button" onClick={() => navigate(-1)}>
          취소
        </Button>
      </ButtonContainer>
    </FormContainer>
  );
};

export default StoreUpdate;

const FormContainer = styled.form`
  max-width: 600px;
  margin: 30px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-size: 14px;
  color: #333;
  margin-bottom: 6px;
  display: block;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 8px;
  margin-bottom: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  resize: vertical;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const TimeContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const FormGroup = styled.div`
  flex: 1;
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 14px;
`;

const CheckboxInput = styled.input`
  cursor: pointer;
`;
