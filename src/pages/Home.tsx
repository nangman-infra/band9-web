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

  const handleTabClick = (path: string) => {
    navigate(path);
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
    </div>
  );
}

export default Home;


