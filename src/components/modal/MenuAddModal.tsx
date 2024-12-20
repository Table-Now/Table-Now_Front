import React, { useState } from "react";
import styled from "styled-components";

interface MenuAddModalProps {
  onClose: () => void;
  onAdd: (
    menuData: { name: string; price: string },
    image: File | null
  ) => void;
}

const MenuAddModal = ({ onClose, onAdd }: MenuAddModalProps) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (!name || !price) {
      alert("모든 필드를 입력해주세요.");
      return;
    }
    onAdd({ name, price }, image);
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>메뉴 등록</h2>
        <Input
          type="text"
          placeholder="메뉴 이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          type="text"
          placeholder="가격"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <Input type="file" onChange={handleImageChange} />
        <Button onClick={handleSubmit}>등록</Button>
        <Button onClick={onClose}>닫기</Button>
      </ModalContent>
    </ModalOverlay>
  );
};

export default MenuAddModal;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  margin: 5px;
  padding: 10px 15px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;
