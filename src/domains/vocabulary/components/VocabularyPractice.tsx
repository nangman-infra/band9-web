/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { Word } from '@/domains/vocabulary/types';
import { getWordsByDate } from '@/domains/vocabulary/api';
import { ApiError } from '@/utils/api';
import { PracticeCardSkeleton } from '@/components/PracticeCardSkeleton';

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
  width: 100%;
  padding: 1rem;
  border: 2px dashed #004C97;
  border-radius: 8px;
  font-size: 1.25rem;
  background: #f0f7ff;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #0066CC;
    background: white;
  }
`;

const filledInputStyle = css`
  ${blankInputStyle}
  border: 2px solid #004C97;
  background: white;
`;


const exampleTextStyle = css`
  font-size: 1.125rem;
  line-height: 1.8;
  margin-bottom: 1rem;
  color: #666;
`;

const buttonGroupStyle = css`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const prevButtonStyle = css`
  background: #6c757d;
  border: none;
  border-radius: 8px;
  padding: 1rem 2rem;
  cursor: pointer;
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
  flex: 1;
  transition: background 0.2s;

  &:hover {
    background: #5a6268;
  }

  &:disabled {
    background: #c6c8ca;
    cursor: not-allowed;
    opacity: 0.6;
  }
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
  flex: 1;
  transition: background 0.2s;

  &:hover {
    background: #218838;
  }

  &:disabled {
    background: #c6c8ca;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const passButtonStyle = css`
  background: #ffc107;
  border: none;
  border-radius: 8px;
  padding: 1rem 2rem;
  cursor: pointer;
  font-size: 1.125rem;
  font-weight: 600;
  color: #333;
  flex: 1;
  transition: background 0.2s;

  &:hover {
    background: #e0a800;
  }
`;

const nextButtonStyle = css`
  background: #004C97;
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
    background: #0066CC;
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

const dialogOverlayStyle = css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
`;

const dialogStyle = css`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  text-align: center;
`;

const dialogTitleStyle = css`
  font-size: 1.5rem;
  font-weight: 700;
  color: #004C97;
  margin-bottom: 1rem;
`;

const dialogMessageStyle = css`
  font-size: 1.125rem;
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const dialogButtonStyle = css`
  background: #004C97;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 2rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  transition: background 0.2s;

  &:hover {
    background: #0066CC;
  }
`;


function VocabularyPractice() {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [words, setWords] = useState<Word[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);

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
      }
    } catch (error) {
      console.error('Failed to load words:', error);
      // HTTP 200이어도 응답 파싱 실패 시 에러 처리
      if (error instanceof ApiError) {
        alert(`Failed to load words: ${error.message}`);
      } else if (error instanceof Error) {
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
  // 사용자가 입력한 뜻과 정답 비교 (대소문자 구분 없이, 공백 제거)
  const isCorrect = currentWord 
    ? userAnswer.trim().toLowerCase() === currentWord.meaning.trim().toLowerCase()
    : false;

  const handleBlankInput = (value: string) => {
    setUserAnswer(value);
    setShowResult(false);
  };


  const handleCheck = () => {
    if (!userAnswer.trim()) {
      return; // 입력이 없으면 체크하지 않음
    }
    setShowResult(true);
  };

  const handlePass = () => {
    handleNext();
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setUserAnswer('');
      setShowResult(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setUserAnswer('');
      setShowResult(false);
    } else {
      setShowCompletionDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setShowCompletionDialog(false);
    handleBackClick();
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
          <PracticeCardSkeleton />
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
        {/* MVP: 모드 선택 제거 */}

        <motion.div
          css={practiceCardStyle}
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {/* MVP: 영어 단어 표시 */}
          <div css={questionStyle}>
            Word: {currentWord.word}
            {currentWord.partOfSpeech && ` (${currentWord.partOfSpeech})`}
          </div>

          {/* MVP: 뜻 입력 필드 */}
          <div css={{ marginTop: '2rem', marginBottom: '1rem' }}>
            <label css={{ display: 'block', marginBottom: '0.5rem', fontSize: '1.125rem', fontWeight: 600, color: '#333' }}>
              Meaning:
            </label>
            <input
              css={userAnswer ? filledInputStyle : blankInputStyle}
              type="text"
              value={userAnswer}
              onChange={(e) => handleBlankInput(e.target.value)}
              placeholder="단어의 뜻을 입력하세요"
              disabled={showResult}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !showResult) {
                  handleCheck();
                }
              }}
            />
          </div>

          {/* 예문 표시 (있는 경우) */}
          {currentWord.example && (
            <div css={exampleTextStyle}>
              <strong>Example:</strong> {currentWord.example}
            </div>
          )}

          {showResult && (
            <motion.div
              css={resultStyle(isCorrect)}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {isCorrect ? 'Correct! 🎉' : `Incorrect. Answer: ${currentWord.meaning}`}
            </motion.div>
          )}

          {showResult ? (
            <button
              css={nextButtonStyle}
              onClick={handleNext}
              type="button"
            >
              Next Question
            </button>
          ) : (
            <div css={buttonGroupStyle}>
              <button
                css={prevButtonStyle}
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                type="button"
              >
                Prev
              </button>
              <button
                css={checkButtonStyle}
                onClick={handleCheck}
                disabled={!userAnswer.trim()}
                type="button"
              >
                Check Answer
              </button>
              <button
                css={passButtonStyle}
                onClick={handlePass}
                type="button"
              >
                Pass
              </button>
            </div>
          )}

          <div css={{ marginTop: '1rem', textAlign: 'center', color: '#666' }}>
            {currentIndex + 1} / {words.length}
          </div>
        </motion.div>
      </div>

      {/* 완료 다이얼로그 */}
      <AnimatePresence>
        {showCompletionDialog && (
          <motion.div
            css={dialogOverlayStyle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleCloseDialog}
          >
            <motion.div
              css={dialogStyle}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div css={dialogTitleStyle}>🎉 완료!</div>
              <div css={dialogMessageStyle}>
                모든 단어를 완료했습니다!
                <br />
                총 {words.length}개의 단어를 연습했습니다.
              </div>
              <button css={dialogButtonStyle} onClick={handleCloseDialog} type="button">
                확인
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default VocabularyPractice;

