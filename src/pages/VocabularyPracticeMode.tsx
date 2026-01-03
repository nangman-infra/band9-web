/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const containerStyle = css`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #F5F7FA;
  padding: 2rem;
  padding-top: 6rem;
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
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
  font-size: 2rem;
  font-weight: 700;
  color: #004C97;
  margin: 0;
`;

const titleContainerStyle = css`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
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

const contentStyle = css`
  max-width: 800px;
  width: 100%;
`;

const dateDisplayStyle = css`
  font-size: 1.125rem;
  font-weight: 500;
  color: #888;
  margin-top: 0.5rem;
  margin-left: 0;
`;

const modeCardStyle = css`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
  }
`;

const modeTitleStyle = css`
  font-size: 1.5rem;
  font-weight: 700;
  color: #004C97;
  margin-bottom: 0.5rem;
`;

const modeDescriptionStyle = css`
  font-size: 1rem;
  color: #666;
  line-height: 1.6;
`;

const formatDate = (dateString: string) => {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weekday = weekdays[date.getDay()];
  return `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')}, ${weekday}`;
};

function VocabularyPracticeMode() {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/vocabulary');
  };

  const handleModeSelect = (mode: 'quiz' | 'dragdrop') => {
    if (date) {
      navigate(`/vocabulary/${date}/practice/${mode}`);
    }
  };

  if (!date) {
    return null;
  }

  return (
    <motion.div
      css={containerStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div css={headerStyle}>
        <div css={titleContainerStyle}>
          <h1 css={titleStyle}>Practice Mode</h1>
          <div css={dateDisplayStyle}>{formatDate(date)}</div>
        </div>
        <button css={backButtonStyle} onClick={handleBackClick} type="button">
          ← Calendar
        </button>
      </div>
      <div css={contentStyle}>
        <motion.div
          css={modeCardStyle}
          onClick={() => handleModeSelect('quiz')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div css={modeTitleStyle}>📝 Vocabulary Quiz</div>
          <div css={modeDescriptionStyle}>
            단어를 보고 뜻을 입력하는 퀴즈 모드입니다. 단어의 뜻을 직접 입력하여 정답을 맞춰보세요.
          </div>
        </motion.div>

        <motion.div
          css={modeCardStyle}
          onClick={() => handleModeSelect('dragdrop')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div css={modeTitleStyle}>🎯 Drag & Drop</div>
          <div css={modeDescriptionStyle}>
            단어와 뜻을 드래그 앤 드롭으로 매칭하는 모드입니다. 단어를 뜻에 맞게 드래그하여 연결해보세요.
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default VocabularyPracticeMode;

