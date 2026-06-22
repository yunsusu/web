import styled, { css, keyframes } from 'styled-components';

// ─── Button ───────────────────────────────────────────────────────────────────
export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: ${({ size }) => size === 'sm' ? '6px 14px' : size === 'lg' ? '14px 28px' : '10px 20px'};
  font-size: ${({ size }) => size === 'sm' ? '13px' : size === 'lg' ? '16px' : '14px'};
  font-weight: 600;
  border-radius: ${({ theme }) => theme.radius.md};
  transition: all 0.15s ease;
  white-space: nowrap;

  ${({ variant = 'primary', theme }) => {
    switch (variant) {
      case 'secondary':
        return css`
          background: ${theme.colors.secondary};
          color: ${theme.colors.text};
          &:hover:not(:disabled) { background: ${theme.colors.border}; }
        `;
      case 'ghost':
        return css`
          background: transparent;
          color: ${theme.colors.textMuted};
          &:hover:not(:disabled) { background: ${theme.colors.secondary}; color: ${theme.colors.text}; }
        `;
      case 'danger':
        return css`
          background: ${theme.colors.error};
          color: white;
          &:hover:not(:disabled) { opacity: 0.88; }
        `;
      default:
        return css`
          background: ${theme.colors.primary};
          color: white;
          &:hover:not(:disabled) { background: ${theme.colors.primaryHover}; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(59,91,219,0.3); }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

// ─── Form Elements ─────────────────────────────────────────────────────────────
export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: 0.01em;
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px 14px;
  font-size: 14px;
  background: ${({ theme }) => theme.colors.bgWhite};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.text};
  transition: border-color 0.15s, box-shadow 0.15s;
  outline: none;

  &::placeholder { color: ${({ theme }) => theme.colors.textLight}; }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryLight};
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  padding: 12px 14px;
  font-size: 14px;
  background: ${({ theme }) => theme.colors.bgWhite};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.text};
  transition: border-color 0.15s, box-shadow 0.15s;
  outline: none;
  resize: vertical;
  min-height: 120px;
  line-height: 1.6;

  &::placeholder { color: ${({ theme }) => theme.colors.textLight}; }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryLight};
  }
`;

export const ErrorMessage = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.error};
  background: ${({ theme }) => theme.colors.errorLight};
  padding: 10px 14px;
  border-radius: ${({ theme }) => theme.radius.md};
  border-left: 3px solid ${({ theme }) => theme.colors.error};
`;

// ─── Card ──────────────────────────────────────────────────────────────────────
export const Card = styled.div`
  background: ${({ theme }) => theme.colors.bgWhite};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.sm};
`;

// ─── Layout ────────────────────────────────────────────────────────────────────
export const PageContainer = styled.div`
  max-width: 780px;
  margin: 0 auto;
  padding: 32px 20px;
`;

export const CenterContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

// ─── Divider ───────────────────────────────────────────────────────────────────
export const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin: ${({ my = '20px' }) => `${my} 0`};
`;

// ─── Avatar ────────────────────────────────────────────────────────────────────
export const Avatar = styled.div`
  width: ${({ size = 36 }) => size}px;
  height: ${({ size = 36 }) => size}px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ size = 36 }) => size * 0.38}px;
  font-weight: 700;
  flex-shrink: 0;
  text-transform: uppercase;
`;

// ─── Badge ─────────────────────────────────────────────────────────────────────
export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  font-size: 12px;
  font-weight: 600;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
`;

// ─── Spinner ───────────────────────────────────────────────────────────────────

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const Spinner = styled.div`
  width: ${({ size = 20 }) => size}px;
  height: ${({ size = 20 }) => size}px;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
`;

export const LoadingCenter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 0;
`;
