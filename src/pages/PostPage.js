import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import {
  PageContainer, Card, Button, Textarea, Avatar, Spinner, LoadingCenter, Divider, ErrorMessage
} from '../components/UI';

const PostCard = styled(Card)`
  padding: 32px;
  margin-bottom: 16px;
`;

const PostHeader = styled.div`
  margin-bottom: 24px;
`;

const PostTitle = styled.h1`
  font-size: 24px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.5px;
  margin-bottom: 12px;
  line-height: 1.4;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const AuthorName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const PostDate = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 6px;
`;

const PostContent = styled.div`
  font-size: 15px;
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.text};
  white-space: pre-wrap;
  word-break: break-word;
`;

const CommentsCard = styled(Card)`
  padding: 28px 32px;
`;

const CommentsTitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 20px;

  span {
    font-weight: 400;
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 14px;
    margin-left: 6px;
  }
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const CommentItem = styled.div`
  padding: 16px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};

  &:last-child { border-bottom: none; }
`;

const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const CommentAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CommentName = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const CommentDate = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const CommentContent = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.7;
  margin-left: 32px;
  white-space: pre-wrap;
  word-break: break-word;
`;

const CommentForm = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CommentRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-start;
`;

const CommentInput = styled(Textarea)`
  min-height: 80px;
  flex: 1;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 16px;
  transition: color 0.15s;

  &:hover { color: ${({ theme }) => theme.colors.text}; }
`;

const LoginPrompt = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
  padding: 16px;
  background: ${({ theme }) => theme.colors.bg};
  border-radius: ${({ theme }) => theme.radius.md};

  a { color: ${({ theme }) => theme.colors.primary}; font-weight: 600; }
`;

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return '방금 전';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}일 전`;
  return new Date(dateStr).toLocaleDateString('ko-KR');
}

export default function PostPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchPost = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*, profiles(username)')
      .eq('id', id)
      .single();
    if (error || !data) { navigate('/'); return; }
    setPost(data);
    setLoading(false);
  };

  const fetchComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('*, profiles(username)')
      .eq('post_id', id)
      .order('created_at', { ascending: true });
    setComments(data || []);
  };

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('이 글을 삭제하시겠습니까?')) return;
    await supabase.from('posts').delete().eq('id', id);
    navigate('/');
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;
    setSubmitting(true);
    setError('');
    const { error } = await supabase.from('comments').insert({
      post_id: id,
      user_id: user.id,
      content: commentText.trim(),
    });
    if (error) {
      setError('댓글 등록에 실패했습니다.');
    } else {
      setCommentText('');
      fetchComments();
    }
    setSubmitting(false);
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('이 댓글을 삭제하시겠습니까?')) return;
    await supabase.from('comments').delete().eq('id', commentId);
    fetchComments();
  };

  if (loading) return <LoadingCenter><Spinner size={40} /></LoadingCenter>;

  const username = post.profiles?.username || '알 수 없음';

  return (
    <PageContainer>
      <BackLink to="/">← 목록으로</BackLink>

      <PostCard>
        <PostHeader>
          <PostTitle>{post.title}</PostTitle>
          <MetaRow>
            <AuthorInfo>
              <Avatar size={34}>{username[0]}</Avatar>
              <div>
                <AuthorName>{username}</AuthorName>
                <br />
                <PostDate>{timeAgo(post.created_at)}</PostDate>
              </div>
            </AuthorInfo>
            {user?.id === post.user_id && (
              <ActionButtons>
                <Button size="sm" variant="ghost" onClick={() => navigate(`/edit/${id}`)}>수정</Button>
                <Button size="sm" variant="danger" onClick={handleDelete}>삭제</Button>
              </ActionButtons>
            )}
          </MetaRow>
        </PostHeader>
        <Divider />
        <PostContent>{post.content}</PostContent>
      </PostCard>

      <CommentsCard>
        <CommentsTitle>
          댓글 <span>{comments.length}개</span>
        </CommentsTitle>

        <CommentList>
          {comments.map(comment => (
            <CommentItem key={comment.id}>
              <CommentHeader>
                <CommentAuthor>
                  <Avatar size={26}>{(comment.profiles?.username || '?')[0]}</Avatar>
                  <CommentName>{comment.profiles?.username || '알 수 없음'}</CommentName>
                  <CommentDate>{timeAgo(comment.created_at)}</CommentDate>
                </CommentAuthor>
                {user?.id === comment.user_id && (
                  <Button size="sm" variant="ghost" onClick={() => handleDeleteComment(comment.id)}>삭제</Button>
                )}
              </CommentHeader>
              <CommentContent>{comment.content}</CommentContent>
            </CommentItem>
          ))}
        </CommentList>

        {user ? (
          <CommentForm>
            <Divider my="4px" />
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <CommentRow>
              <Avatar size={34}>{(user.user_metadata?.username || user.email[0]).toUpperCase()}</Avatar>
              <CommentInput
                placeholder="댓글을 입력해주세요..."
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) handleCommentSubmit(); }}
              />
            </CommentRow>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button size="sm" onClick={handleCommentSubmit} disabled={submitting || !commentText.trim()}>
                {submitting ? '등록 중...' : '댓글 등록'}
              </Button>
            </div>
          </CommentForm>
        ) : (
          <LoginPrompt style={{ marginTop: 16 }}>
            댓글을 작성하려면 <Link to="/login">로그인</Link>이 필요합니다.
          </LoginPrompt>
        )}
      </CommentsCard>
    </PageContainer>
  );
}
