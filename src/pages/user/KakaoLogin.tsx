import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { userApi } from "../../api/user";

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
        const userId = response.email.split("@")[0];
        sessionStorage.setItem("token", response.accessToken);
        sessionStorage.setItem("email", userId);
        navigate("/");
      } catch (error) {
        console.error("Error during Kakao login:", error);
        alert("로그인 중 오류가 발생했습니다. 다시 시도해 주세요.");
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
  }, [location.search, navigate, isRequesting]); // 의존성 배열에서 handleKakaoLogin 제거

  if (isLoading) {
    return <div>로그인 중...</div>;
  }

  return null;
};

export default KakaoCallback;
