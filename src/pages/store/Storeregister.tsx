import React, { useState } from "react";
import styled from "styled-components";
import { storeApi } from "../../api/store";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { useUser } from "../../hooks/useUser";
import { MenuInput } from "../../components/MenuInput";

const StoreRegister: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const [formData, setFormData] = useState({
    user: "",
    store: "",
    storeLocation: "",
    storeImg: "",
    storeContents: "",
    storeOpen: "",
    storeClose: "",
    storeWeekOff: "",
  });

  const [storeImg, setStoreImg] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [menus, setMenus] = useState<
    { name: string; price: string; image: File | null }[]
  >([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMenuChange = (
    index: number,
    menu: { name: string; price: string; image: File | null }
  ) => {
    const updatedMenus = [...menus];
    updatedMenus[index] = menu;
    setMenus(updatedMenus);
  };

  const handleAddMenu = () => {
    setMenus([...menus, { name: "", price: "", image: null }]);
  };

  const handleWeekOffChange = (day: string) => {
    setFormData((prev) => {
      const currentDays = prev.storeWeekOff.split(",").filter(Boolean);
      if (currentDays.includes(day)) {
        const updatedDays = currentDays.filter((d) => d !== day);
        return { ...prev, storeWeekOff: updatedDays.join(",") };
      } else {
        return { ...prev, storeWeekOff: [...currentDays, day].join(",") };
      }
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setStoreImg(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formDataToSend = new FormData();

      const storeData = {
        ...formData,
        user: user || "",
      };

      // storeDto를 JSON으로 추가
      formDataToSend.append(
        "storeDto",
        new Blob([JSON.stringify(storeData)], {
          type: "application/json",
        })
      );

      // 매장 이미지 추가
      if (storeImg) {
        formDataToSend.append("image", storeImg);
      }

      // 메뉴 데이터를 JSON 문자열로 추가
      const menuDtosJson = JSON.stringify(
        menus.map((menu) => ({
          name: menu.name,
          price: menu.price,
          // 다른 필요한 필드들
        }))
      );
      formDataToSend.append("menuDtos", menuDtosJson);

      // 메뉴 이미지 추가
      menus.forEach((menu, index) => {
        if (menu.image) {
          formDataToSend.append("menuImages", menu.image);
        }
      });

      await storeApi.registerStore(formDataToSend);
      navigate("/");
    } catch (error: any) {
      setError(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>매장 등록</Title>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>상점 이름</Label>
          <Input
            type="text"
            name="store"
            value={formData.store}
            onChange={handleChange}
            required
            placeholder="상점 이름을 입력하세요"
          />
        </FormGroup>

        <FormGroup>
          <Label>위치</Label>
          <Input
            type="text"
            name="storeLocation"
            value={formData.storeLocation}
            onChange={handleChange}
            required
            placeholder="상점 주소를 입력하세요"
          />
        </FormGroup>

        <FormGroup>
          <Label>상점 이미지</Label>
          <FileInput
            type="file"
            id="storeImg"
            accept="image/*"
            onChange={handleImageChange}
          />
          <FileInputLabel htmlFor="storeImg">
            {storeImg ? "파일 선택됨" : "파일 선택하기"}
          </FileInputLabel>
          {storeImg && <FileName>{storeImg.name}</FileName>}
        </FormGroup>

        <FormGroup>
          <Label>상점 소개</Label>
          <TextArea
            name="storeContents"
            value={formData.storeContents}
            onChange={handleChange}
            required
            placeholder="상점 소개를 입력하세요"
          />
        </FormGroup>

        <TimeContainer>
          <FormGroup>
            <Label>오픈 시간</Label>
            <Input
              type="time"
              name="storeOpen"
              value={formData.storeOpen}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>마감 시간</Label>
            <Input
              type="time"
              name="storeClose"
              value={formData.storeClose}
              onChange={handleChange}
              required
            />
          </FormGroup>
        </TimeContainer>

        <FormGroup>
          <Label>쉬는 날</Label>
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
                  checked={formData.storeWeekOff.split(",").includes(day)}
                  onChange={() => handleWeekOffChange(day)}
                />
                {day}
              </CheckboxLabel>
            ))}
          </CheckboxGroup>
        </FormGroup>

        <ButtonBox>
          {menus.map((menu, index) => (
            <MenuInput
              key={index}
              index={index}
              menu={menu}
              onChange={handleMenuChange}
            />
          ))}

          <Button type="button" onClick={handleAddMenu}>
            메뉴 추가
          </Button>

          <Button type="submit" disabled={loading}>
            {loading ? "등록 중..." : "상점 등록"}
          </Button>
        </ButtonBox>

        {error && <ErrorMessage>{error}</ErrorMessage>}
      </Form>
    </Container>
  );
};

export default StoreRegister;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 600;
`;

const FileInput = styled.input`
  display: none;
`;

const FileInputLabel = styled.label`
  display: inline-block;
  padding: 10px 20px;
  background-color: #ff5733;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #ff3508;
  }
`;

const FileName = styled.span`
  margin-left: 10px;
  font-size: 0.9rem;
  color: #666;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const TimeContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  margin-right: 20px;
`;

const CheckboxInput = styled.input`
  margin-right: 8px;
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  margin-bottom: 1rem;
  text-align: center;
`;

const ButtonBox = styled.div`
  display: flex;
  flex-direction: column; // 버튼을 세로로 배치
  gap: 16px; // 버튼 간 간격
`;
