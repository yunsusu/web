import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme, GlobalStyle } from './styles/theme';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import BoardPage from './pages/BoardPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import WritePage from './pages/WritePage';
import PostPage from './pages/PostPage';
import ProfilePage from './pages/ProfilePage';
import { LoadingCenter, Spinner } from './components/UI';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingCenter><Spinner size={36} /></LoadingCenter>;
  return user ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { loading } = useAuth();
  if (loading) return <LoadingCenter style={{ minHeight: '100vh' }}><Spinner size={40} /></LoadingCenter>;

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<BoardPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/post/:id" element={<PostPage />} />
        <Route path="/write" element={<ProtectedRoute><WritePage /></ProtectedRoute>} />
        <Route path="/edit/:id" element={<ProtectedRoute><WritePage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
