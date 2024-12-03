import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_REST_API_KEY}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&response_type=code`;

const KakaoLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = React.useState(true);

  const handleKakaoLogin = async () => {
    const code = new URLSearchParams(location.search).get("code");

    if (code) {
      try {
        // 카카오 로그인 API 호출
        const response = await axios.post(
          "http://localhost:8080/user/kakao/login",
          {
            code,
          }
        );

        sessionStorage.setItem("token", response.data.token);

        navigate("/");
      } catch (error) {
        console.error("카카오 로그인 실패", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    handleKakaoLogin();
  }, [location]);

  if (isLoading) {
    return <div>로그인중</div>;
  }

  return null;
};

export default KakaoLogin;
