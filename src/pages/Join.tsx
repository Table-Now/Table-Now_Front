import React, { useState } from "react";
import styled from "styled-components";
import { userApi } from "../api/user";
import { RegisterFormData } from "../types/users/join";
import Input from "../components/Input";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

const Join: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
    user: "",
    name: "",
    password: "",
    email: "",
    phone: "",
  });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validatePhone = (phone: string) => {
    const phonePattern = /^010\d{8}$/;
    return phonePattern.test(phone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validatePhone(formData.phone)) {
      setError(
        "휴대폰 번호는 010으로 시작하고 뒤에 8자리 숫자를 입력해야 합니다."
      );
      return;
    }

    setLoading(true);

    try {
      await userApi.register(formData);
      alert("회원가입이 완료되었습니다. 이메일 인증을 진행해주세요.");
      navigate("/login");
    } catch (err: any) {
      setError(
        err.response?.data || "회원가입에 실패했습니다. 다시 시도해주세요."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <FormWrapper>
        <Title>회원가입</Title>
        <Form onSubmit={handleSubmit}>
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
            type="text"
            id="name"
            name="name"
            label="이름"
            value={formData.name}
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
          <Input
            type="email"
            id="email"
            name="email"
            label="이메일"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            type="tel"
            id="phone"
            name="phone"
            label="휴대폰 번호"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <ButtonBox>
            <Button type="submit" disabled={loading}>
              {loading ? "처리중..." : "가입하기"}
            </Button>

            <Button type="button" to="/login">
              로그인
            </Button>
          </ButtonBox>
        </Form>
      </FormWrapper>
    </Container>
  );
};

export default Join;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
`;
const FormWrapper = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ButtonBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const ErrorMessage = styled.p`
  color: #ff0033;
  font-size: 0.9rem;
  margin: 0.5rem 0;
`;
