/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar } from '@/domains/writing';

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

const headerStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 800px;
  margin-bottom: 2rem;
  position: relative;
`;

const titleStyle = css`
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  color: #004C97;
`;

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const TRANSITION_DURATION = 0.2;

function Writing() {
  const navigate = useNavigate();

  const handleDateSelect = (date: string) => {
    navigate(`/writing/${date}`);
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
        <h1 css={titleStyle}>Writing Practice</h1>
      </div>
      <Calendar onDateSelect={handleDateSelect} />
    </motion.div>
  );
}

export default Writing;

