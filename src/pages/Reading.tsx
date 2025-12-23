/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar } from '@/domains/reading';

const containerStyle = css`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
`;

const headerStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 800px;
  margin-bottom: 2rem;
`;

const titleStyle = css`
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
`;

const backButtonStyle = css`
  background: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const TRANSITION_DURATION = 0.2;

function Reading() {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/');
  };

  const handleDateSelect = (date: string) => {
    navigate(`/reading/${date}`);
  };

  return (
    <motion.div
      css={containerStyle}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: TRANSITION_DURATION }}
    >
      <div css={headerStyle}>
        <button css={backButtonStyle} onClick={handleBackClick} type="button">
          ← 홈으로
        </button>
        <h1 css={titleStyle}>리딩 연습</h1>
        <div style={{ width: '120px' }} />
      </div>
      <Calendar onDateSelect={handleDateSelect} />
    </motion.div>
  );
}

export default Reading;

