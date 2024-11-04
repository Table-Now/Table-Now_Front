import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { userApi } from "../api/user";
import Input from "../components/Input";
import { LoginFormData } from "../types/users/login";
import Button from "../components/Button";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    user: "",
    password: "",
  });
  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await userApi.login(formData);
      sessionStorage.setItem("token", response.token);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data || "로그인에 실패했습니다.");
    }
  };

  return (
    <LoginContainer>
      <LoginForm onSubmit={handleSubmit}>
        <Title>로그인</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Input
          type="text"
          id="user"
          name="user"
          label="아이디"
          value={formData.user}
          onChange={handleChange}
          required
        />
        <Input
          type="password"
          id="password"
          name="password"
          label="비밀번호"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <ButtonBox>
          <Button type="submit">로그인</Button>
          <Button to="/join">회원가입</Button>
        </ButtonBox>
      </LoginForm>
    </LoginContainer>
  );
};

export default Login;

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const LoginForm = styled.form`
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.div`
  color: #ff0033;
  text-align: center;
  font-size: 0.9rem;
  padding: 0.5rem;
  background-color: #fff0f0;
  border-radius: 4px;
`;

const ButtonBox = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;
