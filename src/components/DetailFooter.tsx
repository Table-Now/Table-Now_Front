import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const DetailFooter: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <FixedHeader>
      <HeaderContent>
        <LeftSection>
          <BackButton onClick={handleGoBack}>
            <BackIcon src="/img/move.png" alt="뒤로가기" />
          </BackButton>
        </LeftSection>

        <RightSection>
          <StImg src="/img/bookmark.png" alt="즐겨찾기" />
        </RightSection>
      </HeaderContent>
    </FixedHeader>
  );
};

export default DetailFooter;

const FixedHeader = styled.footer`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 768px;
  background-color: #f8f8f8;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  width: 100%;
`;

const LeftSection = styled.div`
  display: flex;
  justify-content: flex-start;
  flex: 1;
`;

const RightSection = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
`;

const BackIcon = styled.img`
  width: 24px;
  height: 24px;
`;

const StImg = styled.img`
  width: 40px;
  height: 40px;
`;
