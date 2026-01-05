/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useEffect, useMemo } from 'react';
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
  padding: 1rem;
  padding-top: 6rem;
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;

  @media (min-width: 640px) {
    padding: 2rem;
  }
`;

const headerStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
  flex-wrap: wrap;

  @media (min-width: 640px) {
    margin-bottom: 2rem;
    align-items: center;
    flex-wrap: nowrap;
  }
`;

const titleStyle = css`
  font-size: 1.5rem;
  font-weight: 700;
  color: #004C97;
  margin: 0;

  @media (min-width: 640px) {
    font-size: 2rem;
  }
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
  padding: 0.625rem 1rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  color: #333;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  white-space: nowrap;

  @media (min-width: 640px) {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }

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
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  color: #333;
  margin-bottom: 1.5rem;

  @media (min-width: 640px) {
    padding: 2rem;
  }
`;

const subtitleStyle = css`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #004C97;
  text-align: center;
`;

const playButtonStyle = css`
  background: #004C97;
  border: none;
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  font-size: 3rem;
  color: white;
  width: 100%;
  margin-bottom: 2rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100px;

  &:hover {
    background: #0066CC;
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    background: #c6c8ca;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const inputGroupStyle = css`
  margin-bottom: 1.5rem;
`;

const labelStyle = css`
  display: block;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
`;

const blankInputStyle = css`
  width: 100%;
  padding: 0.75rem;
  border: 2px dashed #004C97;
  border-radius: 8px;
  font-size: 1rem;
  background: #f0f7ff;
  transition: all 0.2s;

  @media (min-width: 640px) {
    padding: 1rem;
    font-size: 1.25rem;
  }

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

const buttonGroupStyle = css`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;

  @media (min-width: 640px) {
    gap: 1rem;
    margin-top: 1.5rem;
    flex-wrap: nowrap;
  }
`;

const prevButtonStyle = css`
  background: #6c757d;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  flex: 1;
  min-width: 80px;
  transition: background 0.2s;

  @media (min-width: 640px) {
    padding: 1rem 2rem;
    font-size: 1.125rem;
    min-width: auto;
  }

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
  padding: 0.75rem 1rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  flex: 1;
  min-width: 80px;
  transition: background 0.2s;

  @media (min-width: 640px) {
    padding: 1rem 2rem;
    font-size: 1.125rem;
    min-width: auto;
  }

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
  padding: 0.75rem 1rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  color: #333;
  flex: 1;
  min-width: 80px;
  transition: background 0.2s;

  @media (min-width: 640px) {
    padding: 1rem 2rem;
    font-size: 1.125rem;
    min-width: auto;
  }

  &:hover {
    background: #e0a800;
  }
`;

const nextButtonStyle = css`
  background: #004C97;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  width: 100%;
  margin-top: 1rem;
  transition: background 0.2s;

  @media (min-width: 640px) {
    padding: 1rem 2rem;
    font-size: 1.125rem;
    margin-top: 1.5rem;
  }

  &:hover {
    background: #0066CC;
  }
`;

const resultStyle = (resultType: 'correct' | 'partial' | 'incorrect') => css`
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 8px;
  background: ${resultType === 'correct' ? '#d4edda' : resultType === 'partial' ? '#fff3cd' : '#f8d7da'};
  color: ${resultType === 'correct' ? '#155724' : resultType === 'partial' ? '#856404' : '#721c24'};
  font-weight: 600;
`;

const dateDisplayStyle = css`
  font-size: 0.875rem;
  font-weight: 500;
  color: #888;
  margin-top: 0.5rem;
  margin-left: 0;

  @media (min-width: 640px) {
    font-size: 1.125rem;
  }
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

function VocabularyListening() {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userSpelling, setUserSpelling] = useState('');
  const [userMeaning, setUserMeaning] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [words, setWords] = useState<Word[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // 배열을 무작위로 섞는 함수 (Fisher-Yates 알고리즘)
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

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
      const shuffledWords = shuffleArray(fetchedWords);
      setWords(shuffledWords);

      if (shuffledWords.length > 0) {
        setCurrentIndex(0);
        setUserSpelling('');
        setUserMeaning('');
        setShowResult(false);
      }
    } catch (error) {
      console.error('Failed to load words:', error);
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
    const date = new Date(year, month - 1, day);
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekday = weekdays[date.getDay()];
    return `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')}, ${weekday}`;
  };

  const currentWord = words[currentIndex];

  // 음성 재생 함수
  const handlePlaySound = () => {
    if (!currentWord || isPlaying) return;

    setIsPlaying(true);
    const utterance = new SpeechSynthesisUtterance(currentWord.word);
    utterance.lang = 'en-US';
    utterance.rate = 0.8; // 약간 느리게
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      alert('음성 재생에 실패했습니다. 브라우저가 음성 합성을 지원하지 않을 수 있습니다.');
    };

    window.speechSynthesis.speak(utterance);
  };

  // 정답 체크 로직
  const checkAnswer = (): 'correct' | 'partial' | 'incorrect' => {
    if (!currentWord) return 'incorrect';

    const spellingCorrect = userSpelling.trim().toLowerCase() === currentWord.word.toLowerCase();
    const meaningCorrect = userMeaning.trim().toLowerCase() === currentWord.meaning.toLowerCase();

    if (spellingCorrect && meaningCorrect) {
      return 'correct';
    } else if (spellingCorrect || meaningCorrect) {
      return 'partial';
    }
    return 'incorrect';
  };

  const answerResult = checkAnswer();
  const isCorrect = answerResult === 'correct';
  const isPartial = answerResult === 'partial';

  const handleSpellingChange = (value: string) => {
    setUserSpelling(value);
    setShowResult(false);
  };

  const handleMeaningChange = (value: string) => {
    setUserMeaning(value);
    setShowResult(false);
  };

  const handleCheck = () => {
    if (!userSpelling.trim() && !userMeaning.trim()) {
      return;
    }
    setShowResult(true);
  };

  const handlePass = () => {
    handleNext();
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setUserSpelling('');
      setUserMeaning('');
      setShowResult(false);
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setUserSpelling('');
      setUserMeaning('');
      setShowResult(false);
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      setShowCompletionDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setShowCompletionDialog(false);
    handleBackClick();
  };

  const handleBackClick = () => {
    window.speechSynthesis.cancel();
    navigate('/vocabulary');
  };

  // 컴포넌트 언마운트 시 음성 중지
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  if (isLoading) {
    return (
      <div css={containerStyle}>
        <div css={headerStyle}>
          <h1 css={titleStyle}>Vocabulary Listening</h1>
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
          <h1 css={titleStyle}>Vocabulary Listening</h1>
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
        <div css={titleContainerStyle}>
          <h1 css={titleStyle}>Vocabulary Listening</h1>
          {date && <div css={dateDisplayStyle}>{formatDate(date)}</div>}
        </div>
        <button css={backButtonStyle} onClick={handleBackClick} type="button">
          ← Calendar
        </button>
      </div>
      <div css={contentStyle}>
        <motion.div
          css={practiceCardStyle}
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div css={subtitleStyle}>Listen and Write</div>

          {/* 음성 재생 버튼 */}
          <button
            css={playButtonStyle}
            onClick={handlePlaySound}
            disabled={isPlaying || showResult}
            type="button"
          >
            {isPlaying ? '🔊 Playing...' : '🔊 Play Sound'}
          </button>

          {/* 스펠링 입력 */}
          <div css={inputGroupStyle}>
            <label css={labelStyle} htmlFor="spelling">
              Spelling (English):
            </label>
            <input
              id="spelling"
              css={userSpelling ? filledInputStyle : blankInputStyle}
              type="text"
              value={userSpelling}
              onChange={(e) => handleSpellingChange(e.target.value)}
              placeholder="들은 단어의 스펠링을 입력하세요"
              disabled={showResult}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !showResult) {
                  handleCheck();
                }
              }}
            />
          </div>

          {/* 뜻 입력 */}
          <div css={inputGroupStyle}>
            <label css={labelStyle} htmlFor="meaning">
              Meaning (Korean):
            </label>
            <input
              id="meaning"
              css={userMeaning ? filledInputStyle : blankInputStyle}
              type="text"
              value={userMeaning}
              onChange={(e) => handleMeaningChange(e.target.value)}
              placeholder="들은 단어의 뜻을 입력하세요"
              disabled={showResult}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !showResult) {
                  handleCheck();
                }
              }}
            />
          </div>

          {showResult && (
            <motion.div
              css={resultStyle(answerResult)}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {isCorrect ? (
                'Perfect! Both spelling and meaning are correct! 🎉'
              ) : isPartial ? (
                <>
                  {userSpelling.trim().toLowerCase() === currentWord.word.toLowerCase() ? (
                    'Spelling is correct! ✓ But meaning is incorrect. '
                  ) : (
                    'Meaning is correct! ✓ But spelling is incorrect. '
                  )}
                  <br />
                  Correct answer: <strong>{currentWord.word}</strong> - {currentWord.meaning}
                </>
              ) : (
                <>
                  Incorrect. 
                  <br />
                  Correct answer: <strong>{currentWord.word}</strong> - {currentWord.meaning}
                </>
              )}
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
                disabled={!userSpelling.trim() && !userMeaning.trim()}
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

export default VocabularyListening;

