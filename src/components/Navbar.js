import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../hooks/useAuth';
import { Avatar, Button } from './UI';

const Nav = styled.nav`
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  position: sticky;
  top: 0;
  z-index: 100;
`;

const NavInner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
`;

const Logo = styled(Link)`
  font-size: 18px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: -0.5px;
  display: flex;
  align-items: center;
  gap: 8px;

  span {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
`;

const NavLink = styled(Link)`
  padding: 6px 14px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme, $active }) => $active ? theme.colors.primary : theme.colors.textMuted};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme, $active }) => $active ? theme.colors.primaryLight : 'transparent'};
  transition: all 0.15s;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.secondary};
  }
`;

const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const UserMenu = styled.div`
  position: relative;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 10px 4px 4px;
  border-radius: ${({ theme }) => theme.radius.full};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bgWhite};
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadow.sm};
  }
`;

const UserName = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: ${({ theme }) => theme.colors.bgWhite};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  min-width: 160px;
  padding: 6px;
  display: ${({ $open }) => $open ? 'block' : 'none'};
  z-index: 200;
`;

const DropdownItem = styled(Link)`
  display: block;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  border-radius: ${({ theme }) => theme.radius.sm};
  transition: background 0.1s;

  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
  }
`;

const DropdownButton = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.radius.sm};
  transition: background 0.1s;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.errorLight};
  }
`;

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const username = user?.user_metadata?.username || user?.email?.split('@')[0] || '?';

  const handleSignOut = async () => {
    await signOut();
    setMenuOpen(false);
    navigate('/login');
  };

  return (
    <Nav>
      <NavInner>
        <Logo to="/" data-cy="gnb-logo">
          Board<span>.</span>
        </Logo>
        <NavLinks>
          <NavLink to="/" $active={location.pathname === '/' ? 1 : 0} data-cy="gnb-board">게시판</NavLink>
          {user && (
            <NavLink to="/write" $active={location.pathname === '/write' ? 1 : 0} data-cy="gnb-write">글쓰기</NavLink>
          )}
        </NavLinks>
        <NavRight>
          {user ? (
            <UserMenu>
              <UserButton onClick={() => setMenuOpen(o => !o)} data-cy="gnb-user-button">
                <Avatar size={28}>{username[0]}</Avatar>
                <UserName>{username}</UserName>
              </UserButton>
              <Dropdown $open={menuOpen}>
                <DropdownItem to="/profile" onClick={() => setMenuOpen(false)} data-cy="gnb-profile">내 정보</DropdownItem>
                <DropdownButton onClick={handleSignOut} data-cy="gnb-logout">로그아웃</DropdownButton>
              </Dropdown>
            </UserMenu>
          ) : (
            <>
              <Button as={Link} to="/login" variant="ghost" size="sm" data-cy="gnb-login">로그인</Button>
              <Button as={Link} to="/signup" size="sm" data-cy="gnb-signup">회원가입</Button>
            </>
          )}
        </NavRight>
      </NavInner>
    </Nav>
  );
}
