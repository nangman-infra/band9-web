/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { GoogleLoginButton } from '@/components/GoogleLoginButton';

const containerStyle = css`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F5F7FA;
  padding: 2rem;
`;

const cardStyle = css`
  background: white;
  border-radius: 16px;
  padding: 3rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  text-align: center;
`;

const titleStyle = css`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #004C97;
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
`;

const subtitleStyle = css`
  font-size: 1rem;
  color: #666;
  margin-bottom: 2rem;
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
`;

const buttonContainerStyle = css`
  display: flex;
  justify-content: center;
`;

export const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  // 인증된 상태면 홈으로 리다이렉트
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // 로딩 중이면 아무것도 표시하지 않음
  if (isLoading) {
    return null;
  }

  return (
    <div css={containerStyle}>
      <motion.div
        css={cardStyle}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 css={titleStyle}>Band9</h1>
        <p css={subtitleStyle}>로그인하여 시작하세요</p>
        <div css={buttonContainerStyle}>
          <GoogleLoginButton />
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

