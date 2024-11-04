import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Button from "../components/Button";

const Header: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    setIsLogin(!!token);
  }, []);

  return (
    <HeaderContainer>
      <Logo to="/">TableNow</Logo>

      {isLogin ? (
        <Button to="/mypage">마이페이지</Button>
      ) : (
        <ButtonContainer>
          <Button to="/login">로그인</Button>
          <Button to="/join">회원가입</Button>
        </ButtonContainer>
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

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
`;
