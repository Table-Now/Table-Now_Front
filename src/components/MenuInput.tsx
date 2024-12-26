import React from "react";
import styled from "styled-components";

interface MenuInputProps {
  index: number;
  menu: { name: string; price: string; image: File | null };
  onChange: (
    index: number,
    menu: { name: string; price: string; image: File | null }
  ) => void;
  onRemove: (index: number) => void;
}

export const MenuInput: React.FC<MenuInputProps> = ({
  index,
  menu,
  onChange,
  onRemove,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    onChange(index, { ...menu, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onChange(index, { ...menu, image: e.target.files[0] });
    }
  };

  return (
    <MenuContainer>
      <RemoveButton type="button" onClick={() => onRemove(index)}>
        X
      </RemoveButton>

      <FormGroup>
        <Label>메뉴 이름</Label>
        <Input
          type="text"
          name="name"
          value={menu.name}
          onChange={handleChange}
          placeholder="메뉴 이름"
          required
        />
      </FormGroup>

      <FormGroup>
        <Label>가격</Label>
        <Input
          type="text"
          name="price"
          value={menu.price}
          onChange={handleChange}
          placeholder="가격"
          required
        />
      </FormGroup>

      <FormGroup>
        <Label>메뉴 이미지</Label>
        <FileInput
          type="file"
          id={`menuImg-${index}`}
          accept="image/*"
          onChange={handleImageChange}
        />
        <FileInputLabel htmlFor={`menuImg-${index}`}>
          {menu.image ? "파일 선택됨" : "파일 선택하기"}
        </FileInputLabel>
        {menu.image && <FileName>{menu.image.name}</FileName>}
      </FormGroup>
    </MenuContainer>
  );
};

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  margin-bottom: 24px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #f9f9f9;
  position: relative;
`;

const RemoveButton = styled.button`
  background-color: #d6938c;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 50%;
  font-size: 16px;
  cursor: pointer;
  position: absolute;
  top: 8px;
  right: 8px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #c0392b;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  transition: border-color 0.3s;

  &:focus {
    border-color: #4a90e2;
  }

  &::placeholder {
    color: #aaa;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FileInputLabel = styled.label`
  display: inline-block;
  padding: 10px;
  font-size: 14px;
  color: #4a90e2;
  background-color: #e9f4ff;
  border: 1px solid #4a90e2;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.3s;

  &:hover {
    background-color: #c9e4ff;
  }
`;

const FileName = styled.p`
  font-size: 12px;
  color: #666;
  margin-top: 8px;
`;
