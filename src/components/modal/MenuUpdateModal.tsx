import React, { useState } from "react";
import styled from "styled-components";
import Button from "../Button";
import { MenuItem, MenuUpdateProps } from "../../types/menu/Menu";

interface MenuUpdateModalProps {
  menu: MenuItem;
  onClose: () => void;
  onUpdate: (
    menuId: number | undefined,
    data: MenuUpdateProps,
    image: File | null
  ) => Promise<void>;
}

const MenuUpdateModal: React.FC<MenuUpdateModalProps> = ({
  menu,
  onClose,
  onUpdate,
}) => {
  const [menuData, setMenuData] = useState<MenuUpdateProps>({
    name: menu.name,
    price: menu.price,
  });
  const [menuImage, setMenuImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | undefined>(
    menu.image
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMenuData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMenuImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onUpdate(menu.id, menuData, menuImage);
      onClose();
    } catch (error) {
      console.error("메뉴 수정 실패:", error);
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <h2>메뉴 수정</h2>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>
          <ImageContainer>
            <PreviewImage src={previewImage} alt="메뉴 이미지" />
            <FileInputLabel>
              이미지 변경
              <FileInput
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </FileInputLabel>
          </ImageContainer>

          <FormGroup>
            <Label>메뉴명</Label>
            <Input
              type="text"
              name="name"
              value={menuData.name}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>가격</Label>
            <Input
              type="text"
              name="price"
              value={menuData.price}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <ButtonContainer>
            <Button type="submit">저장</Button>
            <Button type="button" onClick={onClose}>
              취소
            </Button>
            <Button>매진</Button>
          </ButtonContainer>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default MenuUpdateModal;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    margin: 0;
    font-size: 1.5rem;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 5px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 500;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const PreviewImage = styled.img`
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
`;

const FileInput = styled.input`
  display: none;
`;

const FileInputLabel = styled.label`
  background-color: #f0f0f0;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;
