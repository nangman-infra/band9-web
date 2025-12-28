/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Word } from '/Users/junoshon/Developments/band9-web/src/domains/vocabulary/types.ts';
import { getWordsByDate } from '/Users/junoshon/Developments/band9-web/src/domains/vocabulary/api';
import { ApiError } from '/Users/junoshon/Developments/band9-web/src/utils/api';

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
  color: #004C97;
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
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
`;

const modeSelectorStyle = css`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  background: white;
  border-radius: 12px;
  padding: 0.5rem;
`;

const modeButtonStyle = (isActive: boolean) => css`
  flex: 1;
  background: ${isActive ? '#004C97' : 'transparent'};
  border: none;
  border-radius: 8px;
  padding: 0.75rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  color: ${isActive ? 'white' : '#333'};
  transition: all 0.2s;

  &:hover {
    background: ${isActive ? '#0066CC' : '#f0f0f0'};
  }
`;

const practiceCardStyle = css`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  color: #333;
  margin-bottom: 1.5rem;
`;

const questionStyle = css`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #004C97;
`;

const blankInputStyle = css`
  display: inline-block;
  min-width: 200px;
  padding: 0.5rem 1rem;
  border: 2px dashed #004C97;
  border-radius: 8px;
  margin: 0 0.5rem;
  font-size: 1.25rem;
  text-align: center;
  background: #f0f7ff;
`;

const filledInputStyle = css`
  ${blankInputStyle}
  border: 2px solid #004C97;
  background: white;
`;

const optionsContainerStyle = css`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 2rem;
`;

const optionButtonStyle = (isUsed: boolean) => css`
  background: ${isUsed ? '#e0e0e0' : '#004C97'};
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  cursor: ${isUsed ? 'not-allowed' : 'pointer'};
  font-size: 1rem;
  font-weight: 600;
  color: ${isUsed ? '#999' : 'white'};
  transition: all 0.2s;
  opacity: ${isUsed ? 0.5 : 1};

  &:hover {
    background: ${isUsed ? '#e0e0e0' : '#0066CC'};
    transform: ${isUsed ? 'none' : 'translateY(-2px)'};
  }
`;

const dragOptionStyle = (isDragging: boolean) => css`
  ${optionButtonStyle(false)}
  cursor: ${isDragging ? 'grabbing' : 'grab'};
  background: ${isDragging ? '#0066CC' : '#004C97'};
`;

const exampleTextStyle = css`
  font-size: 1.125rem;
  line-height: 1.8;
  margin-bottom: 1rem;
  color: #666;
`;

const checkButtonStyle = css`
  background: #28a745;
  border: none;
  border-radius: 8px;
  padding: 1rem 2rem;
  cursor: pointer;
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
  width: 100%;
  margin-top: 1.5rem;
  transition: background 0.2s;

  &:hover {
    background: #218838;
  }
`;

const resultStyle = (isCorrect: boolean) => css`
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 8px;
  background: ${isCorrect ? '#d4edda' : '#f8d7da'};
  color: ${isCorrect ? '#155724' : '#721c24'};
  font-weight: 600;
`;

const dateDisplayStyle = css`
  font-size: 1rem;
  opacity: 0.9;
  margin-top: 0.5rem;
`;

type PracticeMode = 'blank' | 'drag';

function VocabularyPractice() {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const [mode, setMode] = useState<PracticeMode>('blank');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [usedOptions, setUsedOptions] = useState<Set<string>>(new Set());
  const [words, setWords] = useState<Word[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (date) {
      loadWords();
    }
  }, [date]);

  const loadWords = async () => {
    if (!date) return;

    try {
      setIsLoading(true);
      const fetchedWords = await getWordsByDate(date);
      setWords(fetchedWords);

      // 빈 배열은 정상적인 응답이므로 에러로 처리하지 않음
      // 단어가 없어도 연습 페이지는 표시하되, 사용자에게 알림
      if (fetchedWords.length > 0) {
        setCurrentIndex(0);
        setUserAnswer('');
        setShowResult(false);
        setUsedOptions(new Set());
      }
    } catch (error) {
      console.error('Failed to load words:', error);
      // HTTP 200이어도 응답 파싱 실패 시 에러 처리
      if (error instanceof ApiError) {
        alert(`Failed to load words: ${error.message}`);
      } else {
        alert('Failed to load words: Unknown error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return `${month}/${day}/${year}`;
  };

  const currentWord = words[currentIndex];
  const isCorrect = userAnswer.toLowerCase() === currentWord?.word.toLowerCase();

  const handleBlankInput = (value: string) => {
    setUserAnswer(value);
    setShowResult(false);
  };

  const handleDragOptionClick = (option: string) => {
    if (!usedOptions.has(option)) {
      setUserAnswer(option);
      setUsedOptions((prev) => new Set([...prev, option]));
      setShowResult(false);
    }
  };

  const handleCheck = () => {
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setUserAnswer('');
      setShowResult(false);
      setUsedOptions(new Set());
    } else {
      alert('All words completed!');
    }
  };

  const handleBackClick = () => {
    navigate('/vocabulary');
  };

  if (isLoading) {
    return (
      <div css={containerStyle}>
        <div css={headerStyle}>
          <h1 css={titleStyle}>Vocabulary Practice</h1>
          <button css={backButtonStyle} onClick={handleBackClick} type="button">
            ← Calendar
          </button>
        </div>
        <div css={contentStyle}>
          <div css={practiceCardStyle}>
            <p style={{ textAlign: 'center', color: '#666' }}>Loading words...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentWord || words.length === 0) {
    return (
      <div css={containerStyle}>
        <div css={headerStyle}>
          <h1 css={titleStyle}>Vocabulary Practice</h1>
          <button css={backButtonStyle} onClick={handleBackClick} type="button">
            ← Calendar
          </button>
        </div>
        <div css={contentStyle}>
          <div css={practiceCardStyle}>
            <p>No words available. Please input words first.</p>
          </div>
        </div>
      </div>
    );
  }

  const exampleWithBlank = currentWord.example
    ? currentWord.example.replace(currentWord.word, '______')
    : `The word is ${currentWord.word}.`;

  const allOptions = [
    currentWord.word,
    ...currentWord.synonyms,
    ...words
      .filter((w) => w.id !== currentWord.id)
      .map((w) => w.word)
      .slice(0, 2),
  ].sort(() => Math.random() - 0.5);

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
          <h1 css={titleStyle}>Vocabulary Practice</h1>
          {date && <div css={dateDisplayStyle}>{formatDate(date)}</div>}
        </div>
          <button css={backButtonStyle} onClick={handleBackClick} type="button">
            ← Calendar
          </button>
      </div>
      <div css={contentStyle}>
        <div css={modeSelectorStyle}>
          <button
            css={modeButtonStyle(mode === 'blank')}
            onClick={() => {
              setMode('blank');
              setUserAnswer('');
              setShowResult(false);
              setUsedOptions(new Set());
            }}
            type="button"
          >
            Fill in the Blank
          </button>
          <button
            css={modeButtonStyle(mode === 'drag')}
            onClick={() => {
              setMode('drag');
              setUserAnswer('');
              setShowResult(false);
              setUsedOptions(new Set());
            }}
            type="button"
          >
            Drag & Drop
          </button>
        </div>

        <motion.div
          css={practiceCardStyle}
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div css={questionStyle}>
            Meaning: {currentWord.meaning}
            {currentWord.partOfSpeech && ` (${currentWord.partOfSpeech})`}
          </div>

          {mode === 'blank' ? (
            <>
              <div css={exampleTextStyle}>
                {exampleWithBlank.split('______').map((part, index, array) => (
                  <span key={index}>
                    {part}
                    {index < array.length - 1 && (
                      <input
                        css={userAnswer ? filledInputStyle : blankInputStyle}
                        type="text"
                        value={userAnswer}
                        onChange={(e) => handleBlankInput(e.target.value)}
                        placeholder="Enter word"
                      />
                    )}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <>
              <div css={exampleTextStyle}>
                {exampleWithBlank.split('______').map((part, index, array) => (
                  <span key={index}>
                    {part}
                    {index < array.length - 1 && (
                      <span css={userAnswer ? filledInputStyle : blankInputStyle}>
                        {userAnswer || 'Drag here'}
                      </span>
                    )}
                  </span>
                ))}
              </div>
              <div css={optionsContainerStyle}>
                {allOptions.map((option) => {
                  const isUsed = usedOptions.has(option);
                  return (
                    <motion.button
                      key={option}
                      css={dragOptionStyle(false)}
                      onClick={() => handleDragOptionClick(option)}
                      type="button"
                      disabled={isUsed}
                      whileHover={{ scale: isUsed ? 1 : 1.05 }}
                      whileTap={{ scale: isUsed ? 1 : 0.95 }}
                    >
                      {option}
                    </motion.button>
                  );
                })}
              </div>
            </>
          )}

          {showResult && (
            <motion.div
              css={resultStyle(isCorrect)}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {isCorrect ? 'Correct! 🎉' : `Incorrect. Answer: ${currentWord.word}`}
            </motion.div>
          )}

          <button
            css={checkButtonStyle}
            onClick={showResult ? handleNext : handleCheck}
            type="button"
            disabled={!userAnswer && !showResult}
          >
            {showResult ? 'Next Question' : 'Check Answer'}
          </button>

          <div css={{ marginTop: '1rem', textAlign: 'center', color: '#666' }}>
            {currentIndex + 1} / {words.length}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default VocabularyPractice;

