import { useState } from "react";
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

const LoginCard = styled(Card)`
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

export default function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
      navigate("/");
    } catch (err) {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <LoginCard>
        <Title>
          Board<Accent>.</Accent> 로그인
        </Title>
        <Subtitle>계정에 로그인하여 커뮤니티에 참여하세요</Subtitle>
        <Form onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <FormGroup>
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              data-cy="loginEmail"
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              data-cy="loginPass"
            />
          </FormGroup>
          <Button
            type="submit"
            disabled={loading}
            style={{ marginTop: 4 }}
            data-cy="loginSubmit"
          >
            {loading ? "로그인 중..." : "로그인"}
          </Button>
        </Form>
        <Footer>
          계정이 없으신가요? <Link to="/signup">회원가입</Link>
        </Footer>
      </LoginCard>
    </Wrapper>
  );
}
