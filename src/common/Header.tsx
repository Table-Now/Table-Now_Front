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

    // 세션스토리지 변경 감지
    const interval = setInterval(() => {
      const newToken = sessionStorage.getItem("token");
      if (newToken !== token) {
        setIsLogin(!!newToken);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <HeaderContainer>
      <Logo to="/">TableNow</Logo>

      {isLogin ? (
        <Button to="/mypage">마이페이지</Button>
      ) : (
        <>
          {/* <ButtonContainer>      
        <Button to="/login">로그인</Button>
        <Button to="/join">회원가입</Button>
      </ButtonContainer> */}
          <a href={KAKAO_AUTH_URL}>
            <img src="/img/kakao_login_small.png" alt="kakao_login" />
          </a>
        </>
      )}
    </HeaderContainer>
  );
};

export default Header;

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #f8f8f8;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  color: #333;
`;
