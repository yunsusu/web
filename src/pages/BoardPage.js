import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  Avatar,
  Button,
  LoadingCenter,
  PageContainer,
  Spinner,
} from "../components/UI";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 22px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.5px;
`;

const PostCount = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 400;
  margin-left: 8px;
`;

const PostList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: ${({ theme }) => theme.colors.border};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
`;

const PostItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: ${({ theme }) => theme.colors.bgWhite};
  transition: background 0.12s;

  &:hover {
    background: ${({ theme }) => theme.colors.bg};
  }
`;

const PostInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const PostTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
`;

const PostMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const MetaDot = styled.span`
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.textLight};
`;

const CommentCount = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: nowrap;
`;

const EmptyState = styled.div`
  padding: 60px 20px;
  text-align: center;
  background: ${({ theme }) => theme.colors.bgWhite};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};

  p {
    font-size: 15px;
    color: ${({ theme }) => theme.colors.textMuted};
    margin-bottom: 16px;
  }
`;

const EmptyIcon = styled.div`
  font-size: 36px;
  margin-bottom: 12px;
`;

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return "방금 전";
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}일 전`;
  return new Date(dateStr).toLocaleDateString("ko-KR");
}

export default function BoardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
          id, title, created_at,
          profiles ( username ),
          comments ( count )
        `
        )
        .order("created_at", { ascending: false });

      if (!error) setPosts(data || []);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  return (
    <PageContainer>
      <Header>
        <Title>
          전체 게시글
          <PostCount>{!loading && `${posts.length}개`}</PostCount>
        </Title>
        {user && (
          <Button onClick={() => navigate("/write")} size="sm">
            ✏️ 글쓰기
          </Button>
        )}
      </Header>

      {loading ? (
        <LoadingCenter>
          <Spinner size={32} />
        </LoadingCenter>
      ) : posts.length === 0 ? (
        <EmptyState>
          <EmptyIcon>📝</EmptyIcon>
          <p>아직 작성된 글이 없어요.</p>
          {user ? (
            <Button onClick={() => navigate("/write")}>첫 글 작성하기</Button>
          ) : (
            <Button onClick={() => navigate("/login")}>로그인 후 글쓰기</Button>
          )}
        </EmptyState>
      ) : (
        <PostList>
          {posts.map((post, idx) => (
            <PostItem key={post.id} to={`/post/${post.id}`}>
              <Avatar size={36}>{(post.profiles?.username || "?")[0]}</Avatar>
              <PostInfo>
                <PostTitle>{post.title}</PostTitle>
                <PostMeta>
                  <span>{post.profiles?.username || "알 수 없음"}</span>
                  <MetaDot />
                  <span>{timeAgo(post.created_at)}</span>
                </PostMeta>
              </PostInfo>
              <CommentCount>💬 {post.comments?.[0]?.count ?? 0}</CommentCount>
            </PostItem>
          ))}
        </PostList>
      )}
    </PageContainer>
  );
}
