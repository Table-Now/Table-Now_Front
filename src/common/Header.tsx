import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import { KAKAO_AUTH_URL } from "../pages/user/KakaoLogin";

const Header: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    setIsLogin(!!token);

    const interval = setInterval(() => {
      const newToken = sessionStorage.getItem("token");
      if (newToken !== token) {
        setIsLogin(!!newToken);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <FixedHeader>
      <HeaderContent>
        <LeftSection>
          <Button to="/chat">Talk</Button>
        </LeftSection>

        <CenterSection>
          <Logo to="/">TableNow</Logo>
        </CenterSection>

        <RightSection>
          {isLogin ? (
            <>
              <Button to="/mypage">마이페이지</Button>
            </>
          ) : (
            <>
              <a href={KAKAO_AUTH_URL}>
                <StImg src="/img/kakaoLoginImg.png" alt="kakao_login" />
              </a>
            </>
          )}
        </RightSection>
      </HeaderContent>
    </FixedHeader>
  );
};

export default Header;

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
  padding: 5px 20px;
`;

const LeftSection = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-start;
`;

const CenterSection = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
`;

const RightSection = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  color: #333;
`;

const StImg = styled.img`
  width: 50px;
  height: 50px;
`;
