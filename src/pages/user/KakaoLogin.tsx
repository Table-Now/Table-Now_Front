import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { userApi } from "../../api/user";
import styled from "styled-components";

export const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_REST_API_KEY}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&response_type=code`;

const KakaoCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    const handleKakaoLogin = async (code: string) => {
      if (isRequesting) return;
      setIsRequesting(true);

      try {
        const response = await userApi.kakaoLogin(code);
        sessionStorage.setItem("kakaoAccessToken", response.kakaoAccessToken);
        sessionStorage.setItem("token", response.jwtToken);
        navigate("/");
      } catch (error: any) {
        // alert(error.response?.data?.message);
        alert("탈퇴한 계정입니다. 다른 계정으로 로그인 해주세요");
        navigate("/login");
      } finally {
        setIsRequesting(false);
        setIsLoading(false);
      }
    };

    const code = new URLSearchParams(location.search).get("code");
    if (code) {
      handleKakaoLogin(code); // handleKakaoLogin 함수 호출
    } else {
      console.error("No authorization code found");
      navigate("/login");
    }
  }, [location.search, navigate, isRequesting]);

  if (isLoading) {
    return (
      <LoadingWrapper>
        <Spinner />
        <LoadingText>로그인 중...</LoadingText>
      </LoadingWrapper>
    );
  }

  return null;
};

export default KakaoCallback;

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f7f9fc;
`;

const Spinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  margin-top: 16px;
  font-size: 18px;
  color: #555;
`;
