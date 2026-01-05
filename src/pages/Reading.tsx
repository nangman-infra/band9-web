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

const adminButtonStyle = css`
  background: #6c757d;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  box-shadow: 0 2px 4px rgba(108, 117, 125, 0.2);
  transition: all 0.2s;

  &:hover {
    background: #5a6268;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(108, 117, 125, 0.3);
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

  const handleDateSelect = (date: string) => {
    navigate(`/reading/${date}`);
  };

  const handleAdminClick = () => {
    navigate('/reading/admin');
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
        <h1 css={titleStyle}>Reading Practice</h1>
        <button
          css={adminButtonStyle}
          onClick={handleAdminClick}
          type="button"
          style={{ position: 'absolute', right: 0 }}
        >
          Admin
        </button>
      </div>
      <Calendar onDateSelect={handleDateSelect} />
      <motion.button
        css={adminButtonStyle}
        onClick={handleAdminClick}
        type="button"
        style={{
          marginTop: '2rem',
          maxWidth: '800px',
          width: '100%',
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        📝 지문 관리 (Admin)
      </motion.button>
    </motion.div>
  );
}

export default Reading;

