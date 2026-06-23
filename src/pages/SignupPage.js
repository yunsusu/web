import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  Button,
  Card,
  CenterContainer,
  ErrorMessage,
  FormGroup,
  Input,
  Label,
} from "../components/UI";
import { useAuth } from "../hooks/useAuth";

const Wrapper = styled(CenterContainer)`
  background: ${({ theme }) => theme.colors.bg};
`;

const SignupCard = styled(Card)`
  width: 100%;
  max-width: 420px;
  padding: 40px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 4px;
  letter-spacing: -0.5px;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 32px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const SuccessBox = styled.div`
  padding: 16px;
  background: #ecfdf5;
  border: 1px solid #10b981;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 14px;
  color: #065f46;
  text-align: center;
`;

const Footer = styled.p`
  text-align: center;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 24px;

  a {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Accent = styled.span`
  color: ${({ theme }) => theme.colors.accent};
`;

const HintText = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textLight};
  margin-top: 2px;
`;

export default function SignupPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    username: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.passwordConfirm) {
      return setError("비밀번호가 일치하지 않습니다.");
    }
    if (form.password.length < 6) {
      return setError("비밀번호는 최소 6자 이상이어야 합니다.");
    }
    if (form.username.trim().length < 2) {
      return setError("닉네임은 최소 2자 이상이어야 합니다.");
    }

    setLoading(true);
    try {
      await signUp(form.email, form.password, form.username.trim());
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.message || "회원가입에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <SignupCard>
        <Title>
          Board<Accent>.</Accent> 회원가입
        </Title>
        <Subtitle>새 계정을 만들어 커뮤니티에 참여하세요</Subtitle>

        {success ? (
          <SuccessBox>
            ✅ 가입 완료! 이메일을 확인하여 계정을 인증해주세요.
            <br />
            <small style={{ opacity: 0.8 }}>
              3초 후 로그인 페이지로 이동합니다.
            </small>
          </SuccessBox>
        ) : (
          <Form onSubmit={handleSubmit}>
            {error && <ErrorMessage data-cy="error">{error}</ErrorMessage>}
            <FormGroup>
              <Label htmlFor="username">닉네임</Label>
              <Input
                id="username"
                name="username"
                placeholder="커뮤니티에서 사용할 이름"
                value={form.username}
                onChange={handleChange}
                required
                data-cy="nickname"
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="example@email.com"
                value={form.email}
                onChange={handleChange}
                required
                data-cy="email"
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                data-cy="password"
              />
              <HintText>6자 이상 입력해주세요</HintText>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="passwordConfirm">비밀번호 확인</Label>
              <Input
                id="passwordConfirm"
                name="passwordConfirm"
                type="password"
                placeholder="••••••••"
                value={form.passwordConfirm}
                onChange={handleChange}
                required
                data-cy="passwordConfirm"
              />
            </FormGroup>
            <Button
              type="submit"
              disabled={loading}
              style={{ marginTop: 4 }}
              data-cy="submit"
            >
              {loading ? "가입 중..." : "회원가입"}
            </Button>
          </Form>
        )}

        <Footer>
          이미 계정이 있으신가요? <Link to="/login">로그인</Link>
        </Footer>
      </SignupCard>
    </Wrapper>
  );
}
