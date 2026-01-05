/** @jsxImportSource @emotion/react */
import { useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { useNavigate } from 'react-router-dom';
import { css } from '@emotion/react';
import { motion } from 'framer-motion';

const containerStyle = css`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F5F7FA;
  padding: 2rem;
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
`;

const cardStyle = css`
  width: 100%;
  max-width: 400px;
  padding: 3rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const titleStyle = css`
  font-size: 2rem;
  font-weight: 700;
  color: #004C97;
  text-align: center;
  margin-bottom: 2rem;
`;

const formStyle = css`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const labelStyle = css`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
`;

const inputStyle = css`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #004C97;
  }

  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
`;

const errorStyle = css`
  color: #dc3545;
  font-size: 0.875rem;
  text-align: center;
`;

const buttonStyle = css`
  width: 100%;
  padding: 0.75rem 1.5rem;
  background: #004C97;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: #0066CC;
  }

  &:disabled {
    background: #999;
    cursor: not-allowed;
  }
`;

export const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || '로그인에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div css={containerStyle}>
      <motion.div
        css={cardStyle}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 css={titleStyle}>관리자 로그인</h1>
        <form onSubmit={handleSubmit} css={formStyle}>
          <div>
            <label htmlFor="password" css={labelStyle}>
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              css={inputStyle}
              placeholder="비밀번호를 입력하세요"
              required
              disabled={isLoading}
            />
          </div>
          {error && <div css={errorStyle}>{error}</div>}
          <button type="submit" disabled={isLoading} css={buttonStyle}>
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
