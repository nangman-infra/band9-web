/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { Word } from '@/domains/vocabulary/types';
import { getWordsByDate } from '@/domains/vocabulary/api';
import { ApiError } from '@/utils/api';
import { PracticeCardSkeleton } from '@/components/PracticeCardSkeleton';
import Toast from '@/components/Toast';

const containerStyle = css`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #F5F7FA;
  padding: 2rem;
  padding-top: 6rem;
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
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
`;

const dateDisplayStyle = css`
  font-size: 1rem;
  opacity: 0.9;
  margin-top: 0.5rem;
`;

const practiceCardStyle = css`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  color: #333;
  margin-bottom: 1.5rem;
`;

const subtitleStyle = css`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #004C97;
  text-align: center;
`;

const dragDropContainerStyle = css`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const columnStyle = css`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const columnTitleStyle = css`
  font-size: 1.25rem;
  font-weight: 700;
  color: #004C97;
  margin-bottom: 1rem;
  text-align: center;
`;

const dropZoneStyle = css`
  min-height: 400px;
  border: 2px dashed #e0e0e0;
  border-radius: 12px;
  padding: 1rem;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: all 0.2s;
`;

const dropZoneActiveStyle = css`
  ${dropZoneStyle}
  border-color: #004C97;
  background: #E6F2FF;
`;

const wordItemStyle = (isDragging: boolean, isMatched: boolean, isCorrect: boolean) => css`
  background: ${isCorrect ? '#d4edda' : isMatched ? '#d4edda' : isDragging ? '#cce5ff' : 'white'};
  border: 2px solid ${isCorrect ? '#28a745' : isMatched ? '#28a745' : isDragging ? '#004C97' : '#e0e0e0'};
  border-radius: 8px;
  padding: 1rem;
  cursor: ${isMatched ? 'default' : 'grab'};
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  transition: all 0.2s;
  user-select: none;

  &:hover {
    ${!isMatched && !isDragging && `
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    `}
  }

  &:active {
    cursor: grabbing;
  }
`;

const meaningItemStyle = (isDragging: boolean, isMatched: boolean, isCorrect: boolean) => css`
  ${wordItemStyle(isDragging, isMatched, isCorrect)}
  background: ${isCorrect ? '#d4edda' : isMatched ? '#d4edda' : isDragging ? '#cce5ff' : 'white'};
`;

const buttonGroupStyle = css`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  justify-content: center;
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
  transition: background 0.2s;

  &:hover {
    background: #218838;
  }

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

const resetButtonStyle = css`
  background: #6c757d;
  border: none;
  border-radius: 8px;
  padding: 1rem 2rem;
  cursor: pointer;
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
  transition: background 0.2s;

  &:hover {
    background: #5a6268;
  }
`;

const resultStyle = (isCorrect: boolean) => css`
  margin-top: 1.5rem;
  padding: 1rem;
  border-radius: 8px;
  background: ${isCorrect ? '#d4edda' : '#f8d7da'};
  color: ${isCorrect ? '#155724' : '#721c24'};
  font-weight: 600;
  text-align: center;
`;

const emptyStateStyle = css`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 16px;
  color: #666;
  font-size: 1.125rem;
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

const paginationStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

const paginationButtonStyle = (isActive: boolean) => css`
  background: ${isActive ? '#004C97' : 'white'};
  border: 2px solid #004C97;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  color: ${isActive ? 'white' : '#004C97'};
  transition: all 0.2s;

  &:hover {
    background: ${isActive ? '#0066CC' : '#E6F2FF'};
    border-color: ${isActive ? '#0066CC' : '#004C97'};
  }
`;

const ITEMS_PER_PAGE = 6;

interface Match {
  wordId: string;
  meaningId: string;
}

function VocabularyDragDrop() {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const [words, setWords] = useState<Word[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [matches, setMatches] = useState<Match[]>([]);
  const [draggedWord, setDraggedWord] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [showToast, setShowToast] = useState(false);
  const [correctMatches, setCorrectMatches] = useState<Set<string>>(new Set());

  // 배열을 무작위로 섞는 함수
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const loadWords = useCallback(async () => {
    if (!date) return;

    try {
      setIsLoading(true);
      const fetchedWords = await getWordsByDate(date);
      setWords(fetchedWords);
      setMatches([]);
      setShowResult(false);
      setCorrectMatches(new Set());
      setCurrentPage(1);
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
  }, [date]);

  useEffect(() => {
    loadWords();
  }, [loadWords]);

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return `${month}/${day}/${year}`;
  };

  const handleDragStart = (e: React.DragEvent, wordId: string) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', wordId);
    setDraggedWord(wordId);
  };

  const handleDragEnd = () => {
    setDraggedWord(null);
  };

  const handleDrop = (meaningId: string) => {
    if (!draggedWord) return;

    // 즉시 정답 체크
    const isAnswerCorrect = isCorrect(draggedWord, meaningId);

    if (isAnswerCorrect) {
      // 정답인 경우: 매칭 추가하고 초록색 표시
      const existingMatchForMeaning = matches.find(m => m.meaningId === meaningId);
      if (existingMatchForMeaning) {
        setMatches(matches.filter(m => m.meaningId !== meaningId));
        setCorrectMatches(prev => {
          const newSet = new Set(prev);
          newSet.delete(`${existingMatchForMeaning.wordId}-${meaningId}`);
          return newSet;
        });
      }

      const existingMatchForWord = matches.find(m => m.wordId === draggedWord);
      if (existingMatchForWord) {
        setMatches(matches.filter(m => m.wordId !== draggedWord));
        setCorrectMatches(prev => {
          const newSet = new Set(prev);
          newSet.delete(`${draggedWord}-${existingMatchForWord.meaningId}`);
          return newSet;
        });
      }

      // 새 매칭 추가
      setMatches([...matches.filter(m => m.wordId !== draggedWord && m.meaningId !== meaningId), { wordId: draggedWord, meaningId }]);
      setCorrectMatches(prev => new Set(prev).add(`${draggedWord}-${meaningId}`));
    } else {
      // 오답인 경우: 매칭하지 않고 토스트 메시지 표시
      setToastMessage('틀렸습니다! 다시 시도해주세요.');
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 2000);
    }

    setDraggedWord(null);
  };

  const handleCheck = () => {
    setShowResult(true);
    
    // 모든 단어가 매칭되었는지 확인
    const allMatched = words.length > 0 && matches.length === words.length;
    if (allMatched) {
      setTimeout(() => {
        setShowCompletionDialog(true);
      }, 500);
    }
  };

  const handleReset = () => {
    setMatches([]);
    setShowResult(false);
    setDraggedWord(null);
    setCurrentPage(1);
    setCorrectMatches(new Set());
  };

  const handleCloseDialog = () => {
    setShowCompletionDialog(false);
    handleBackClick();
  };

  const handleBackClick = () => {
    navigate('/vocabulary');
  };

  const isCorrect = (wordId: string, meaningId: string) => {
    // wordId와 meaningId가 같으면 정답 (같은 단어의 뜻이므로)
    return wordId === meaningId;
  };

  const calculateScore = () => {
    let correct = 0;
    matches.forEach(match => {
      if (isCorrect(match.wordId, match.meaningId)) {
        correct++;
      }
    });
    return correct;
  };

  const getMatchedMeaningId = useCallback((wordId: string) => {
    const match = matches.find(m => m.wordId === wordId);
    return match?.meaningId || null;
  }, [matches]);

  const getMatchedWordId = useCallback((meaningId: string) => {
    const match = matches.find(m => m.meaningId === meaningId);
    return match?.wordId || null;
  }, [matches]);

  // 단어와 뜻을 쌍으로 묶어서 무작위로 섞기 (한 번만 실행되도록 useMemo 사용)
  const shuffledPairs = useMemo(() => {
    if (words.length === 0) return [];
    const wordMeaningPairs = words.map(w => ({
      word: w,
      meaning: { id: w.id, meaning: w.meaning }
    }));
    return shuffleArray(wordMeaningPairs);
  }, [words]);

  // Meanings를 별도로 섞기 (Words와 다른 순서로 표시하기 위해)
  const shuffledMeanings = useMemo(() => {
    if (words.length === 0) return [];
    const meanings = words.map(w => ({ id: w.id, meaning: w.meaning }));
    return shuffleArray(meanings);
  }, [words]);

  // 페이지네이션 계산
  const totalPages = Math.ceil(words.length / ITEMS_PER_PAGE);
  const showPagination = words.length >= ITEMS_PER_PAGE;
  
  // 현재 페이지에 표시할 단어-뜻 쌍
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPagePairs = useMemo(() => {
    return shuffledPairs.slice(startIndex, endIndex);
  }, [shuffledPairs, startIndex, endIndex]);

  // 현재 페이지의 단어들 (매칭되지 않은 것만)
  const currentPageWords = useMemo(() => {
    return currentPagePairs
      .map(pair => pair.word)
      .filter(word => !getMatchedMeaningId(word.id));
  }, [currentPagePairs, getMatchedMeaningId]);

  // 현재 페이지의 뜻들 (매칭되지 않은 것만) - 별도로 섞인 Meanings에서 가져옴
  const currentPageMeanings = useMemo(() => {
    // 현재 페이지에 있는 단어들의 ID 목록
    const currentPageWordIds = new Set(currentPagePairs.map(pair => pair.word.id));
    // 현재 페이지에 해당하는 뜻들만 필터링 (별도로 섞인 Meanings에서)
    return shuffledMeanings
      .filter(meaning => currentPageWordIds.has(meaning.id))
      .filter(meaning => !getMatchedWordId(meaning.id));
  }, [shuffledMeanings, currentPagePairs, getMatchedWordId]);

  // 매칭된 단어-뜻 쌍 (현재 페이지에 해당하는 것만)
  const matchedPairs = useMemo(() => {
    return matches
      .map(match => {
        const word = words.find(w => w.id === match.wordId);
        const meaning = words.find(w => w.id === match.meaningId);
        const matchKey = `${match.wordId}-${match.meaningId}`;
        return { 
          word, 
          meaning, 
          isCorrect: correctMatches.has(matchKey),
          matchKey
        };
      })
      .filter(pair => {
        if (!pair.word || !pair.meaning) return false;
        // 현재 페이지에 해당하는 쌍인지 확인
        return currentPagePairs.some(p => p.word.id === pair.word?.id);
      });
  }, [matches, words, correctMatches, currentPagePairs]);

  if (isLoading) {
    return (
      <div css={containerStyle}>
        <div css={headerStyle}>
          <div>
            <h1 css={titleStyle}>Drag & Drop</h1>
            {date && <div css={dateDisplayStyle}>{formatDate(date)}</div>}
          </div>
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

  if (words.length === 0) {
    return (
      <div css={containerStyle}>
        <div css={headerStyle}>
          <div>
            <h1 css={titleStyle}>Drag & Drop</h1>
            {date && <div css={dateDisplayStyle}>{formatDate(date)}</div>}
          </div>
          <button css={backButtonStyle} onClick={handleBackClick} type="button">
            ← Calendar
          </button>
        </div>
        <div css={contentStyle}>
          <div css={emptyStateStyle}>
            No words available. Please input words first.
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
          <h1 css={titleStyle}>Drag & Drop</h1>
          {date && <div css={dateDisplayStyle}>{formatDate(date)}</div>}
        </div>
        <button css={backButtonStyle} onClick={handleBackClick} type="button">
          ← Calendar
        </button>
      </div>
      <div css={contentStyle}>
        <div css={practiceCardStyle}>
          <div css={subtitleStyle}>Vocabulary Drag & Drop</div>

          <div css={dragDropContainerStyle}>
            {/* 왼쪽: 단어들 */}
            <div css={columnStyle}>
              <div css={columnTitleStyle}>Words</div>
              <div css={dropZoneStyle}>
                {currentPageWords.map((word) => {
                  const isDragging = draggedWord === word.id;
                  const matchedMeaningId = getMatchedMeaningId(word.id);
                  const isMatched = !!matchedMeaningId;
                  const matchKey = matchedMeaningId ? `${word.id}-${matchedMeaningId}` : '';
                  const isCorrect = matchedMeaningId ? correctMatches.has(matchKey) : false;

                  return (
                    <div
                      key={word.id}
                      css={wordItemStyle(isDragging, isMatched, isCorrect)}
                      draggable={!isMatched && !showResult}
                      onDragStart={(e) => handleDragStart(e, word.id)}
                      onDragEnd={handleDragEnd}
                    >
                      {word.word}
                      {word.partOfSpeech && ` (${word.partOfSpeech})`}
                    </div>
                  );
                })}
                {currentPageWords.length === 0 && (
                  <div css={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
                    All words matched!
                  </div>
                )}
              </div>
            </div>

            {/* 오른쪽: 뜻들 */}
            <div css={columnStyle}>
              <div css={columnTitleStyle}>Meanings</div>
              <div
                css={draggedWord ? dropZoneActiveStyle : dropZoneStyle}
                onDragOver={(e) => {
                  e.preventDefault();
                }}
              >
                {/* 매칭된 쌍들 표시 */}
                {matchedPairs.map((pair) => {
                  const isDragging = draggedWord === pair.word?.id;

                  return (
                    <div
                      key={`matched-${pair.word?.id}`}
                      css={meaningItemStyle(isDragging, true, pair.isCorrect)}
                    >
                      <strong>{pair.word?.word}</strong>
                      {pair.word?.partOfSpeech && ` (${pair.word.partOfSpeech})`} - {pair.meaning?.meaning}
                    </div>
                  );
                })}

                {/* 매칭되지 않은 뜻들 표시 */}
                {currentPageMeanings
                  .filter(meaningItem => !getMatchedWordId(meaningItem.id))
                  .map((meaningItem) => {
                    const isDragging = draggedWord !== null;
                    const matchedWordId = getMatchedWordId(meaningItem.id);
                    const isMatched = !!matchedWordId;
                    const matchKey = matchedWordId ? `${matchedWordId}-${meaningItem.id}` : '';
                    const isCorrect = matchedWordId ? correctMatches.has(matchKey) : false;

                    return (
                      <div
                        key={meaningItem.id}
                        css={meaningItemStyle(isDragging, isMatched, isCorrect)}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDrop(meaningItem.id);
                        }}
                      >
                        {meaningItem.meaning}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* 페이지네이션 */}
          {showPagination && (
            <div css={paginationStyle}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  css={paginationButtonStyle(currentPage === page)}
                  onClick={() => setCurrentPage(page)}
                  type="button"
                >
                  {page}
                </button>
              ))}
            </div>
          )}

          {showResult && (
            <motion.div
              css={resultStyle(calculateScore() === words.length)}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Score: {calculateScore()} / {words.length}
            </motion.div>
          )}

          <div css={buttonGroupStyle}>
            <button
              css={checkButtonStyle}
              onClick={handleCheck}
              disabled={matches.length !== words.length || showResult}
              type="button"
            >
              Check Answers
            </button>
            <button
              css={resetButtonStyle}
              onClick={handleReset}
              type="button"
            >
              Reset
            </button>
          </div>
        </div>
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
                점수: {calculateScore()} / {words.length}
              </div>
              <button css={dialogButtonStyle} onClick={handleCloseDialog} type="button">
                확인
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 토스트 메시지 */}
      <Toast
        message={toastMessage}
        isVisible={showToast}
        type="error"
      />
    </motion.div>
  );
}

export default VocabularyDragDrop;

