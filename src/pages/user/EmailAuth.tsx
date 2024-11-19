import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { userApi } from "../../api/user";

const EmailAuth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<{
    message: string;
    success: boolean;
    loading: boolean;
  }>({
    message: "",
    success: false,
    loading: true,
  });

  useEffect(() => {
    const verifyEmail = async () => {
      const user = searchParams.get("user");
      const key = searchParams.get("key");

      if (!user || !key) {
        setStatus({
          message: "유효하지 않은 인증 링크입니다.",
          success: false,
          loading: false,
        });
        return;
      }

      try {
        const response = await userApi.verifyEmail(user, key);

        setStatus({
          message: response.message || "이메일 인증이 완료되었습니다.",
          success: response.success,
          loading: false,
        });

        if (response.success) {
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        }
      } catch (error) {
        setStatus({
          message: "이메일 인증 중 오류가 발생했습니다.",
          success: false,
          loading: false,
        });
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <Container>
      <Card>
        <CardHeader>
          <Title>이메일 인증</Title>
        </CardHeader>
        <CardContent>
          {status.loading ? (
            <>
              <LoadingSpinner />
              <LoadingText>인증 처리 중입니다...</LoadingText>
            </>
          ) : (
            <StatusContainer>
              <StatusMessage>
                이메일 인증이 완료되 었습니다. <br />
                잠시 후 로그인 페이지로 이동합니다...
              </StatusMessage>
              <Button onClick={() => navigate("/login")}>
                로그인 페이지로 이동
              </Button>
            </StatusContainer>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default EmailAuth;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f3f4f6;
`;

const Card = styled.div`
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
`;

const CardHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: #111827;
`;

const CardContent = styled.div`
  padding: 1rem 0;
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const LoadingSpinner = styled.div`
  width: 3rem;
  height: 3rem;
  border: 2px solid #f3f4f6;
  border-bottom: 2px solid #111827;
  border-radius: 50%;
  animation: ${rotate} 1s linear infinite;
  margin: 0 auto;
`;

const LoadingText = styled.p`
  margin-top: 1rem;
  color: #6b7280;
  text-align: center;
`;

const StatusContainer = styled.div`
  text-align: center;
  padding: 2rem 0;
`;

const StatusIcon = styled.div<{ success: boolean }>`
  font-size: 3.5rem;
  margin-bottom: 1rem;
  color: ${(props) => (props.success ? "#10B981" : "#EF4444")};
`;

const StatusMessage = styled.div`
  font-size: 1.125rem;
  color: "#059669";
  margin-bottom: 1rem;
`;

const RedirectMessage = styled.p`
  color: #6b7280;
  margin-top: 1rem;
`;

const Button = styled.button`
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 1rem;

  &:hover {
    background-color: #2563eb;
  }

  &:focus {
    outline: none;
  }
`;
