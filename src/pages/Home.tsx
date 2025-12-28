/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchTestMessage, ApiError } from '@/utils/api';

const containerStyle = css`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #F5F7FA;
  padding: 2rem;
  padding-top: 6rem; /* 네비게이션 높이만큼 여백 추가 */
`;

const titleStyle = css`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 3rem;
  text-align: center;
  color: #004C97;
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
`;

const tabsContainerStyle = css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 1000px;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const tabButtonStyle = css`
  background: white;
  border: 2px solid #004C97;
  border-radius: 16px;
  padding: 3rem 2rem;
  cursor: pointer;
  font-size: 1.5rem;
  font-weight: 600;
  color: #004C97;
  box-shadow: 0 4px 6px rgba(0, 76, 151, 0.1);
  transition: all 0.2s;
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;

  &:hover {
    background: #004C97;
    color: white;
    transform: translateY(-4px);
    box-shadow: 0 8px 12px rgba(0, 76, 151, 0.2);
  }

  &:active {
    transform: translateY(-2px);
  }
`;

const testButtonStyle = css`
  background: #28A745;
  border: none;
  border-radius: 12px;
  padding: 1rem 2rem;
  cursor: pointer;
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
  margin-top: 2rem;

  &:hover {
    background: #218838;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
    transform: none;
  }
`;

const messageStyle = css`
  margin-top: 1.5rem;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
  max-width: 600px;
  text-align: center;
`;

const successMessageStyle = css`
  ${messageStyle}
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
`;

const errorMessageStyle = css`
  ${messageStyle}
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
`;

const loadingMessageStyle = css`
  ${messageStyle}
  background: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
`;

const tabVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
    },
  }),
};

const SKILL_TABS = [
  { id: 'reading', label: 'Reading', path: '/reading' },
  { id: 'writing', label: 'Writing', path: '/writing' },
  { id: 'listening', label: 'Listening', path: '/listening' },
  { id: 'speaking', label: 'Speaking', path: '/speaking' },
  { id: 'vocabulary', label: 'Vocabulary', path: '/vocabulary' },
] as const;

function Home() {
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTabClick = (path: string) => {
    navigate(path);
  };

  const handleTestClick = async () => {
    setLoading(true);
    setMessage('');
    setError(null);

    try {
      const result = await fetchTestMessage();
      if (result.success && result.data) {
        setMessage(result.data.message);
      } else {
        setError(result.error?.message || 'Unknown error occurred');
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || 'API call failed');
      } else {
        setError('Failed to fetch data. Please check if the backend server is running.');
      }
      console.error('API call failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div css={containerStyle}>
      <h1 css={titleStyle}>For Band9</h1>
      <div css={tabsContainerStyle}>
        {SKILL_TABS.map((tab, index) => (
          <motion.button
            key={tab.id}
            css={tabButtonStyle}
            onClick={() => handleTabClick(tab.path)}
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            custom={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {tab.label}
          </motion.button>
        ))}
      </div>
      <motion.button
        css={testButtonStyle}
        onClick={handleTestClick}
        disabled={loading}
        type="button"
        whileHover={{ scale: loading ? 1 : 1.02 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
      >
        {loading ? 'Loading...' : 'Test API Connection'}
      </motion.button>
      {loading && (
        <div css={loadingMessageStyle}>
          Connecting to backend...
        </div>
      )}
      {message && (
        <motion.div
          css={successMessageStyle}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <strong>Success:</strong> {message}
        </motion.div>
      )}
      {error && (
        <motion.div
          css={errorMessageStyle}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <strong>Error:</strong> {error}
        </motion.div>
      )}
    </div>
  );
}

export default Home;


