/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const containerStyle = css`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #F5F7FA;
  padding: 2rem;
  padding-top: 6rem; /* 네비게이션 높이만큼 여백 추가 */
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
`;

const headerStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const titleStyle = css`
  font-size: 2rem;
  font-weight: 700;
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
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
`;

const generateButtonStyle = css`
  background: white;
  border: none;
  border-radius: 12px;
  padding: 1rem 2rem;
  cursor: pointer;
  font-size: 1.25rem;
  font-weight: 600;
  color: #004C97;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  margin-bottom: 2rem;
  width: 100%;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;

const passagesContainerStyle = css`
  display: grid;
  gap: 1.5rem;
`;

const passageCardStyle = css`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  color: #333;
`;

const passageTitleStyle = css`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #004C97;
`;

const passageTextStyle = css`
  font-size: 1rem;
  line-height: 1.8;
  margin-bottom: 1.5rem;
  white-space: pre-wrap;
`;

const sectionTitleStyle = css`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
  border-bottom: 2px solid #004C97;
  padding-bottom: 0.5rem;
`;

const answerStyle = css`
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 8px;
`;

const explanationStyle = css`
  font-size: 1rem;
  line-height: 1.6;
  padding: 1rem;
  background: #f0f7ff;
  border-radius: 8px;
  border-left: 4px solid #004C97;
`;

const emptyStateStyle = css`
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 16px;
  color: #666;
`;

const emptyStateTextStyle = css`
  font-size: 1.25rem;
  margin-bottom: 1rem;
`;

const dateDisplayStyle = css`
  font-size: 1rem;
  opacity: 0.9;
  margin-top: 0.5rem;
`;

const ANIMATION_DURATION_MS = 300;

function ReadingPractice() {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const [passages, setPassages] = useState<
    Array<{
      id: number;
      title: string;
      text: string;
      answer: string;
      explanation: string;
    }>
  >([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return `${month}/${day}/${year}`;
  };

  const handleGenerateClick = async () => {
    setIsGenerating(true);
    // TODO: 백엔드 API 호출
    // 임시로 더미 데이터 표시
    setTimeout(() => {
      setPassages([
        {
          id: 1,
          title: 'Passage 1',
          text: 'Passage content will be displayed here. The passage received from the backend will be shown here.',
          answer: 'Answer: A',
          explanation: 'Explanation: This question is about...',
        },
      ]);
      setIsGenerating(false);
    }, ANIMATION_DURATION_MS);
  };

  const handleBackClick = () => {
    navigate('/reading');
  };

  return (
    <motion.div
      css={containerStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div css={headerStyle}>
        <div>
          <h1 css={titleStyle}>Reading Practice</h1>
          {date && <div css={dateDisplayStyle}>{formatDate(date)}</div>}
        </div>
        <button css={backButtonStyle} onClick={handleBackClick} type="button">
          ← Calendar
        </button>
      </div>
      <div css={contentStyle}>
        <motion.button
          css={generateButtonStyle}
          onClick={handleGenerateClick}
          type="button"
          disabled={isGenerating}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isGenerating ? 'Generating...' : 'Generate Passage'}
        </motion.button>

        {passages.length === 0 ? (
          <motion.div
            css={emptyStateStyle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p css={emptyStateTextStyle}>
              Click the "Generate Passage" button above to create a passage.
            </p>
          </motion.div>
        ) : (
          <div css={passagesContainerStyle}>
            {passages.map((passage, index) => (
              <motion.div
                key={passage.id}
                css={passageCardStyle}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <h2 css={passageTitleStyle}>{passage.title}</h2>
                <div css={passageTextStyle}>{passage.text}</div>
                <h3 css={sectionTitleStyle}>Answer</h3>
                <div css={answerStyle}>{passage.answer}</div>
                <h3 css={sectionTitleStyle}>Explanation</h3>
                <div css={explanationStyle}>{passage.explanation}</div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default ReadingPractice;

