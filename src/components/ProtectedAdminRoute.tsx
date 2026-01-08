/** @jsxImportSource @emotion/react */
import { Navigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
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

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

export const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ children }) => {
  const { isAdminAuthenticated, isLoading } = useAdmin();

  if (isLoading) {
    return <div css={loadingStyle}>Loading...</div>;
  }

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};



