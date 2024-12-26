import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import Button from "./Button";

interface DetailFooterProps {
  isReserved: boolean;
  handleReservationAction: () => void;
  handleReservationApproval: () => void;
  handleLikeToggle: () => void;
  isLiked: boolean;
}

const DetailFooter: React.FC<DetailFooterProps> = ({
  isReserved,
  handleReservationAction,
  handleReservationApproval,
  handleLikeToggle,
  isLiked,
}) => {
  const { role } = useUser();
  const navigate = useNavigate();

  return (
    <FixedHeader>
      <HeaderContent>
        <LeftSection>
          {sessionStorage.getItem("token") &&
            (role === "USER" || role == null) && (
              <>
                {!isReserved && (
                  <FullWidthButtonWrapper>
                    <Button onClick={handleReservationAction}>
                      원격줄서기
                    </Button>
                  </FullWidthButtonWrapper>
                )}

                {isReserved && (
                  <FullWidthButtonWrapper>
                    <Button onClick={handleReservationApproval}>
                      확정하기
                    </Button>
                  </FullWidthButtonWrapper>
                )}

                <FullWidthButtonWrapper>
                  <Button onClick={() => navigate("/cart/list")}>
                    포장하기
                  </Button>
                </FullWidthButtonWrapper>
              </>
            )}
        </LeftSection>

        <RightSection>
          {sessionStorage.getItem("token") && role === "USER" && (
            <LikeButton onClick={handleLikeToggle}>
              <LikeIcon
                src={isLiked ? "/img/cart.png" : "/img/uncart.png"}
                alt="Like"
              />
            </LikeButton>
          )}
        </RightSection>
      </HeaderContent>
    </FixedHeader>
  );
};

export default DetailFooter;

const FixedHeader = styled.footer`
  display: flex;
  justify-content: center;
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-51.2%);
  max-width: 730px;
  /* box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1); */
  z-index: 1000;
  width: 95%;
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 60px;
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

const FullWidthButtonWrapper = styled.div`
  width: 100%;
  button {
    width: 90%;
  }
`;

const LikeButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }

  &:focus {
    outline: none;
  }
`;
const LikeIcon = styled.img`
  width: 40px;
  height: 40px;
`;
