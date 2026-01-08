/** @jsxImportSource @emotion/react */
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { css } from '@emotion/react';

const loadingStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-size: 1.2rem;
  color: #666;
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
`;

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div css={loadingStyle}>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};











