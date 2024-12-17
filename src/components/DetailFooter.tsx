import React from "react";
import styled from "styled-components";

const DetailFooter: React.FC = () => {
  return (
    <FixedHeader>
      <HeaderContent>
        <RightSection>
          <StImg src="/img/bookmark.png" />
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
`;

const RightSection = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
`;

const StImg = styled.img`
  width: 40px;
  height: 40px;
`;
