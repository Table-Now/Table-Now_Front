import React, { useState } from "react";
import styled from "styled-components";
import { userApi } from "../../api/user";
import { RegisterFormData } from "../../types/users/join";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";

const Join: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
    user: "",
    password: "",
    email: "",
    phone: "",
  });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phone") {
      // 하이픈을 자동으로 추가하는 로직
      const formattedValue = value
        .replace(/[^0-9]/g, "") // 숫자만 남기고 모두 제거
        .replace(/^(\d{3})(\d{4})(\d{4})$/, "$1-$2-$3"); // 010-1234-1234 형태로 변환

      setFormData((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  const validatePhone = (phone: string) => {
    const phonePattern = /^010-\d{4}-\d{4}$/; // 010-1234-1234 형태로 검증
    return phonePattern.test(phone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validatePhone(formData.phone)) {
      setError("휴대폰 번호는 010-1234-1234 형식으로 입력해야 합니다.");
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
        <Announce>
          매장을 운영하시는 분은
          <Mail>jominuk1025@naver.com</Mail>으로 사업자 등록증을 보내주시면
          감사하겠습니다.
        </Announce>
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

const Announce = styled.div`
  text-align: center;
  margin: 5px 0;
  font-size: 12px;
`;

const Mail = styled.div`
  color: blue;
`;
