import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import {
  Button,
  Card,
  ErrorMessage,
  FormGroup,
  Input,
  Label,
  PageContainer,
  Textarea,
} from "../components/UI";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";

const WriteCard = styled(Card)`
  padding: 32px;
`;

const PageTitle = styled.h1`
  font-size: 20px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.5px;
  margin-bottom: 28px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 8px;
`;

const ContentArea = styled(Textarea)`
  min-height: 280px;
`;

export default function WritePage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (isEdit) {
      supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single()
        .then(({ data, error }) => {
          if (error || !data) {
            navigate("/");
            return;
          }
          if (data.user_id !== user.id) {
            navigate("/");
            return;
          }
          setTitle(data.title);
          setContent(data.content);
        });
    }
  }, [id, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!title.trim()) return setError("제목을 입력해주세요.");
    if (!content.trim()) return setError("내용을 입력해주세요.");

    setLoading(true);
    try {
      if (isEdit) {
        const { error } = await supabase
          .from("posts")
          .update({ title: title.trim(), content: content.trim() })
          .eq("id", id);
        if (error) throw error;
        navigate(`/post/${id}`);
      } else {
        const { data, error } = await supabase
          .from("posts")
          .insert({
            title: title.trim(),
            content: content.trim(),
            user_id: user.id,
          })
          .select()
          .single();
        if (error) throw error;
        navigate(`/post/${data.id}`);
      }
    } catch (err) {
      setError("저장에 실패했습니다: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <WriteCard>
        <PageTitle>{isEdit ? "글 수정" : "새 글 작성"}</PageTitle>
        <Form onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <FormGroup>
            <Label htmlFor="title">제목</Label>
            <Input
              id="title"
              placeholder="제목을 입력해주세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              required
              data-cy="writeTitle"
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="content">내용</Label>
            <ContentArea
              id="content"
              placeholder="내용을 입력해주세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              data-cy="writeContent"
            />
          </FormGroup>
          <ButtonRow>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(-1)}
              data-cy="writeBack"
            >
              취소
            </Button>
            <Button type="submit" disabled={loading} data-cy="writeSubmit">
              {loading ? "저장 중..." : isEdit ? "수정 완료" : "글 등록"}
            </Button>
          </ButtonRow>
        </Form>
      </WriteCard>
    </PageContainer>
  );
}
