import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";

const Header: React.FC = () => {
  const navigate = useNavigate();
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

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      alert("로그인을 진행해주세요");
      navigate("/login");
      e.preventDefault();
    }
  };

  return (
    <FixedHeader>
      <HeaderContent>
        <LeftSection>
          <a href="/chat" onClick={handleClick}>
            <StImg src="/img/talk.png" alt="Talk" />
          </a>
        </LeftSection>

        <CenterSection>
          {/* <Logo to="/">TableNow</Logo> */}
          <a href="/">
            <StImg src="/img/logo.png" alt="logo" />
          </a>
        </CenterSection>

        <RightSection>
          {isLogin ? (
            <>
              <a href="/mypage">
                <StImg src="/img/my.png" alt="myPage" />
              </a>
            </>
          ) : (
            <>
              {/* <a href={KAKAO_AUTH_URL}>
                <StImg src="/img/kakaoLoginImg.png" alt="kakao_login" />
              </a> */}
              <Button to="/login">로그인</Button>
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
  transform: translateX(-51%);
  width: 100%;
  max-width: 750px;
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
