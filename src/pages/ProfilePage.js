import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  Avatar,
  Button,
  Card,
  ErrorMessage,
  FormGroup,
  Input,
  Label,
  LoadingCenter,
  PageContainer,
  Spinner,
} from "../components/UI";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";

const Grid = styled.div`
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 20px;
  align-items: start;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const ProfileCard = styled(Card)`
  padding: 28px 24px;
  text-align: center;
`;

const BigAvatar = styled(Avatar)`
  margin: 0 auto 16px;
`;

const ProfileName = styled.h2`
  font-size: 18px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.3px;
`;

const ProfileEmail = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 4px;
`;

const StatRow = styled.div`
  display: flex;
  gap: 0;
  margin-top: 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
`;

const Stat = styled.div`
  flex: 1;
  padding: 12px 8px;
  text-align: center;
  border-right: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-right: none;
  }
`;

const StatValue = styled.div`
  font-size: 20px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
`;

const StatLabel = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 2px;
`;

const MainCard = styled(Card)`
  padding: 28px 28px;
`;

const SectionTitle = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 18px;
`;

const EditForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;

const SuccessMsg = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.success};
  font-weight: 600;
`;

const MyPostList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: ${({ theme }) => theme.colors.border};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
`;

const MyPostItem = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: ${({ theme }) => theme.colors.bgWhite};
  transition: background 0.12s;

  &:hover {
    background: ${({ theme }) => theme.colors.bg};
  }
`;

const PostTitle = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  margin-right: 12px;
`;

const PostDate = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: nowrap;
`;

const EmptyText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
  padding: 24px 0;
`;

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 86400) return `${Math.floor(diff / 3600) || 1}시간 전`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}일 전`;
  return new Date(dateStr).toLocaleDateString("ko-KR");
}

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [myPosts, setMyPosts] = useState([]);
  const [myComments, setMyComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const load = async () => {
      const [{ data: prof }, { data: posts }, { data: coms }] =
        await Promise.all([
          supabase.from("profiles").select("*").eq("id", user.id).single(),
          supabase
            .from("posts")
            .select("id, title, created_at")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(10),
          supabase.from("comments").select("id").eq("user_id", user.id),
        ]);
      setProfile(prof);
      setUsername(prof?.username || "");
      setMyPosts(posts || []);
      setMyComments(coms || []);
      setLoading(false);
    };
    load();
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (username.trim().length < 2)
      return setError("닉네임은 2자 이상이어야 합니다.");
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await updateProfile({ username: username.trim() });
      await supabase.auth.updateUser({ data: { username: username.trim() } });
      setSuccess("프로필이 저장되었습니다.");
    } catch (err) {
      setError("저장에 실패했습니다: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <LoadingCenter>
        <Spinner size={40} />
      </LoadingCenter>
    );

  return (
    <PageContainer>
      <Grid>
        <ProfileCard>
          <BigAvatar size={72}>{(username || "?")[0]}</BigAvatar>
          <ProfileName>{profile?.username || "이름 없음"}</ProfileName>
          <ProfileEmail>{user?.email}</ProfileEmail>
          <StatRow>
            <Stat>
              <StatValue>{myPosts.length}</StatValue>
              <StatLabel>작성글</StatLabel>
            </Stat>
            <Stat>
              <StatValue>{myComments.length}</StatValue>
              <StatLabel>댓글</StatLabel>
            </Stat>
          </StatRow>
        </ProfileCard>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <MainCard>
            <SectionTitle>프로필 편집</SectionTitle>
            <EditForm onSubmit={handleSave}>
              {error && <ErrorMessage>{error}</ErrorMessage>}
              {success && <SuccessMsg>✅ {success}</SuccessMsg>}
              <FormGroup>
                <Label>이메일</Label>
                <Input value={user?.email} disabled style={{ opacity: 0.6 }} />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="username">닉네임</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="닉네임을 입력하세요"
                />
              </FormGroup>
              <ButtonRow>
                <Button type="submit" disabled={saving} size="sm">
                  {saving ? "저장 중..." : "저장"}
                </Button>
              </ButtonRow>
            </EditForm>
          </MainCard>

          <MainCard>
            <SectionTitle>내가 쓴 글 ({myPosts.length})</SectionTitle>
            {myPosts.length === 0 ? (
              <EmptyText>아직 작성한 글이 없습니다.</EmptyText>
            ) : (
              <MyPostList>
                {myPosts.map((post) => (
                  <MyPostItem key={post.id} to={`/post/${post.id}`}>
                    <PostTitle>{post.title}</PostTitle>
                    <PostDate>{timeAgo(post.created_at)}</PostDate>
                  </MyPostItem>
                ))}
              </MyPostList>
            )}
          </MainCard>
        </div>
      </Grid>
    </PageContainer>
  );
}
