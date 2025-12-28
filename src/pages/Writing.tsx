/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const containerStyle = css`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #F5F7FA;
  padding: 2rem;
  padding-top: 6rem; /* 네비게이션 높이만큼 여백 추가 */
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
`;

const titleStyle = css`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
  color: #004C97;
`;

const backButtonStyle = css`
  background: #004C97;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  margin-top: 2rem;
  box-shadow: 0 2px 4px rgba(0, 76, 151, 0.2);
  transition: all 0.2s;

  &:hover {
    background: #0066CC;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 76, 151, 0.3);
  }
`;

const contentStyle = css`
  text-align: center;
  font-size: 1.25rem;
  color: #666666;
`;

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

function Writing() {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <motion.div
      css={containerStyle}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.2 }}
    >
      <h1 css={titleStyle}>Writing Practice</h1>
      <p css={contentStyle}>Writing practice page.</p>
      <button css={backButtonStyle} onClick={handleBackClick} type="button">
        Back to Home
      </button>
    </motion.div>
  );
}

export default Writing;

