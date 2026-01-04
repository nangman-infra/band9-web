/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { writingService, type WritingQuestion } from '@/services/writingService';
import { ApiError } from '@/utils/api';
import { PracticeCardSkeleton } from '@/components/PracticeCardSkeleton';

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

const taskCardStyle = css`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const taskHeaderStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e0e0e0;
`;

const taskTitleStyle = css`
  font-size: 1.75rem;
  font-weight: 700;
  color: #004C97;
  margin-bottom: 0.5rem;
`;

const taskTypeStyle = css`
  font-size: 1rem;
  color: #666;
  font-weight: 600;
`;

const wordCountStyle = css`
  background: #E6F2FF;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #004C97;
`;

const instructionStyle = css`
  font-size: 1.125rem;
  line-height: 1.8;
  color: #333;
  margin-bottom: 1.5rem;
  white-space: pre-wrap;
`;

const textareaStyle = css`
  width: 100%;
  min-height: 400px;
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  line-height: 1.6;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #004C97;
  }
`;

const buttonGroupStyle = css`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const saveButtonStyle = css`
  background: #28a745;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-size: 1rem;
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

const clearButtonStyle = css`
  background: #dc3545;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  transition: background 0.2s;

  &:hover {
    background: #c82333;
  }
`;

const emptyStateStyle = css`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 16px;
  color: #666;
  font-size: 1.125rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const emptyIconStyle = css`
  width: 120px;
  height: 120px;
  margin-bottom: 1.5rem;
  opacity: 0.6;
  color: #9CA3AF;
`;

const errorIconStyle = css`
  width: 120px;
  height: 120px;
  margin-bottom: 1.5rem;
  opacity: 0.6;
  color: #EF4444;
`;

const emptyTitleStyle = css`
  font-size: 1.5rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.75rem;
`;

const emptyMessageStyle = css`
  font-size: 1rem;
  color: #6B7280;
  line-height: 1.6;
  max-width: 400px;
`;

const errorTitleStyle = css`
  font-size: 1.5rem;
  font-weight: 600;
  color: #DC2626;
  margin-bottom: 0.75rem;
`;

const errorMessageStyle = css`
  font-size: 1rem;
  color: #991B1B;
  line-height: 1.6;
  max-width: 400px;
`;

const dateDisplayStyle = css`
  font-size: 1rem;
  opacity: 0.9;
  margin-top: 0.5rem;
`;

const minWordsStyle = (isEnough: boolean) => css`
  font-size: 0.875rem;
  margin-top: 0.5rem;
  color: ${isEnough ? '#28a745' : '#dc3545'};
  font-weight: 600;
`;

const wordCountModalOverlayStyle = css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
`;

const wordCountModalStyle = css`
  background: white;
  border-radius: 16px;
  padding: 2.5rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  text-align: center;
`;

const wordCountModalTitleStyle = css`
  font-size: 1.5rem;
  font-weight: 700;
  color: #004C97;
  margin-bottom: 1rem;
`;

const wordCountResultStyle = css`
  font-size: 1.25rem;
  margin: 1.5rem 0;
  padding: 1rem;
  border-radius: 8px;
  background: #E6F2FF;
`;

const wordCountNumberStyle = css`
  font-size: 2rem;
  font-weight: 700;
  color: #004C97;
  margin: 0.5rem 0;
`;

const wordCountStatusStyle = (isEnough: boolean) => css`
  font-size: 1rem;
  color: ${isEnough ? '#28a745' : '#dc3545'};
  font-weight: 600;
  margin-top: 0.5rem;
`;

const wordCountModalButtonStyle = css`
  background: #004C97;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 2rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  transition: background 0.2s;
  margin-top: 1rem;
  width: 100%;

  &:hover {
    background: #0066CC;
  }
`;

function WritingPractice() {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<WritingQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userContent, setUserContent] = useState<{ [taskId: string]: string }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [showWordCountModal, setShowWordCountModal] = useState(false);
  const [savedWordCount, setSavedWordCount] = useState(0);
  const [savedTaskType, setSavedTaskType] = useState<number>(1);
  const [savingTaskId, setSavingTaskId] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return `${month}/${day}/${year}`;
  };

  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const getMinWords = (taskType: number) => {
    return taskType === 1 ? 150 : 250;
  };

  const loadQuestions = useCallback(async () => {
    if (!date) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await writingService.getQuestionsByDate(date);
      if (data && data.length > 0) {
        setQuestions(data);
        // 로컬 스토리지에서 저장된 사용자 작성 내용 불러오기
        const savedContent: { [taskId: string]: string } = {};
        data.forEach((q) => {
          const saved = localStorage.getItem(`writing_${q.id}`);
          if (saved) {
            savedContent[q.id] = saved;
          }
        });
        setUserContent(savedContent);
      } else {
        setQuestions([]);
        setError('해당 날짜의 Writing 문제가 없습니다.');
      }
    } catch (err) {
      console.error('Failed to load questions:', err);
      if (err instanceof ApiError) {
        if (err.status === 404) {
          setError('해당 날짜의 Writing 문제가 없습니다.');
        } else {
          setError(`문제를 불러오는데 실패했습니다: ${err.message}`);
        }
      } else if (err instanceof Error) {
        setError(`문제를 불러오는데 실패했습니다: ${err.message}`);
      } else {
        setError('문제를 불러오는데 실패했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [date]);

  useEffect(() => {
    if (date) {
      loadQuestions();
    }
  }, [date, loadQuestions]);

  const handleSave = async (taskId: string, content: string, taskType: number) => {
    if (!date) return;
    
    const currentWordCount = countWords(content);
    const minWords = getMinWords(taskType);
    const isEnough = currentWordCount >= minWords;
    
    setIsSaving(true);
    setSavingTaskId(taskId);
    try {
      // 로컬 스토리지에 저장 (새 API에는 사용자 작성 내용 저장 기능이 없으므로)
      localStorage.setItem(`writing_${taskId}`, content);
      setUserContent(prev => ({ ...prev, [taskId]: content }));
      setSavedWordCount(currentWordCount);
      setSavedTaskType(taskType);
      setShowWordCountModal(true);
    } catch (err) {
      console.error('Failed to save content:', err);
      alert('저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
      setSavingTaskId(null);
    }
  };

  const handleClear = (taskId: string) => {
    if (confirm('작성한 내용을 모두 지우시겠습니까?')) {
      setUserContent(prev => {
        const newContent = { ...prev };
        delete newContent[taskId];
        return newContent;
      });
      localStorage.removeItem(`writing_${taskId}`);
    }
  };

  const handleBackClick = () => {
    navigate('/writing');
  };

  // Task 1과 Task 2로 분리
  const task1Questions = questions.filter((q) => q.taskType === 1);
  const task2Questions = questions.filter((q) => q.taskType === 2);

  if (isLoading) {
    return (
      <div css={containerStyle}>
        <div css={headerStyle}>
          <div>
            <h1 css={titleStyle}>Writing Practice</h1>
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

  if (error) {
    return (
      <div css={containerStyle}>
        <div css={headerStyle}>
          <div>
            <h1 css={titleStyle}>Writing Practice</h1>
            {date && <div css={dateDisplayStyle}>{formatDate(date)}</div>}
          </div>
          <button css={backButtonStyle} onClick={handleBackClick} type="button">
            ← Calendar
          </button>
        </div>
        <div css={contentStyle}>
          <motion.div
            css={emptyStateStyle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              css={errorIconStyle}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.6 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </motion.div>
            <div css={errorTitleStyle}>문제를 불러올 수 없습니다</div>
            <div css={errorMessageStyle}>{error}</div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (questions.length === 0 && !error) {
    return (
      <div css={containerStyle}>
        <div css={headerStyle}>
          <div>
            <h1 css={titleStyle}>Writing Practice</h1>
            {date && <div css={dateDisplayStyle}>{formatDate(date)}</div>}
          </div>
          <button css={backButtonStyle} onClick={handleBackClick} type="button">
            ← Calendar
          </button>
        </div>
        <div css={contentStyle}>
          <motion.div
            css={emptyStateStyle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              css={emptyIconStyle}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.6 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </motion.div>
            <div css={emptyTitleStyle}>해당 날짜의 Writing 문제가 없습니다</div>
            <div css={emptyMessageStyle}>
              다른 날짜를 선택하거나 관리자에게 문의해주세요.
            </div>
          </motion.div>
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
          <h1 css={titleStyle}>Writing Practice</h1>
          {date && <div css={dateDisplayStyle}>{formatDate(date)}</div>}
        </div>
        <button css={backButtonStyle} onClick={handleBackClick} type="button">
          ← Calendar
        </button>
      </div>
      <div css={contentStyle}>
        {task1Questions.length > 0 && (
          <div css={css`margin-bottom: 2rem;`}>
            <h2 css={css`font-size: 1.5rem; font-weight: 700; color: #004C97; margin-bottom: 1rem;`}>
              Task 1
            </h2>
            {task1Questions.map((question) => {
              const content = userContent[question.id] || '';
              const wordCount = countWords(content);
              const minWords = getMinWords(question.taskType);
              const isEnoughWords = wordCount >= minWords;
              
              return (
                <div key={question.id} css={taskCardStyle}>
                  <div css={taskHeaderStyle}>
                    <div>
                      <div css={taskTypeStyle}>Task 1</div>
                    </div>
                    <div css={wordCountStyle}>
                      {wordCount} words
                    </div>
                  </div>
                  
                  <div css={instructionStyle}>{question.content}</div>
                  
                  <textarea
                    css={textareaStyle}
                    value={content}
                    onChange={(e) => setUserContent(prev => ({ ...prev, [question.id]: e.target.value }))}
                    placeholder="여기에 작성하세요..."
                  />
                  
                  <div css={minWordsStyle(isEnoughWords)}>
                    최소 단어 수: {minWords} words {isEnoughWords ? '✓' : `(${minWords - wordCount} words more needed)`}
                  </div>
                  
                  <div css={buttonGroupStyle}>
                    <button
                      css={saveButtonStyle}
                      onClick={() => handleSave(question.id, content, question.taskType)}
                      disabled={isSaving && savingTaskId === question.id}
                      type="button"
                    >
                      {isSaving && savingTaskId === question.id ? '저장 중...' : '저장하기'}
                    </button>
                    <button
                      css={clearButtonStyle}
                      onClick={() => handleClear(question.id)}
                      type="button"
                    >
                      모두 지우기
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {task2Questions.length > 0 && (
          <div>
            <h2 css={css`font-size: 1.5rem; font-weight: 700; color: #004C97; margin-bottom: 1rem;`}>
              Task 2
            </h2>
            {task2Questions.map((question) => {
              const content = userContent[question.id] || '';
              const wordCount = countWords(content);
              const minWords = getMinWords(question.taskType);
              const isEnoughWords = wordCount >= minWords;
              
              return (
                <div key={question.id} css={taskCardStyle}>
                  <div css={taskHeaderStyle}>
                    <div>
                      <div css={taskTypeStyle}>Task 2</div>
                    </div>
                    <div css={wordCountStyle}>
                      {wordCount} words
                    </div>
                  </div>
                  
                  <div css={instructionStyle}>{question.content}</div>
                  
                  <textarea
                    css={textareaStyle}
                    value={content}
                    onChange={(e) => setUserContent(prev => ({ ...prev, [question.id]: e.target.value }))}
                    placeholder="여기에 작성하세요..."
                  />
                  
                  <div css={minWordsStyle(isEnoughWords)}>
                    최소 단어 수: {minWords} words {isEnoughWords ? '✓' : `(${minWords - wordCount} words more needed)`}
                  </div>
                  
                  <div css={buttonGroupStyle}>
                    <button
                      css={saveButtonStyle}
                      onClick={() => handleSave(question.id, content, question.taskType)}
                      disabled={isSaving && savingTaskId === question.id}
                      type="button"
                    >
                      {isSaving && savingTaskId === question.id ? '저장 중...' : '저장하기'}
                    </button>
                    <button
                      css={clearButtonStyle}
                      onClick={() => handleClear(question.id)}
                      type="button"
                    >
                      모두 지우기
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <AnimatePresence>
        {showWordCountModal && (
          <motion.div
            css={wordCountModalOverlayStyle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowWordCountModal(false)}
          >
            <motion.div
              css={wordCountModalStyle}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div css={wordCountModalTitleStyle}>작성 완료</div>
              <div css={wordCountResultStyle}>
                <div>총 단어 수</div>
                <div css={wordCountNumberStyle}>{savedWordCount} words</div>
                <div css={wordCountStatusStyle(savedWordCount >= getMinWords(savedTaskType))}>
                  {savedWordCount >= getMinWords(savedTaskType)
                    ? `✓ 최소 단어 수(${getMinWords(savedTaskType)} words)를 충족했습니다.`
                    : `⚠ 최소 단어 수(${getMinWords(savedTaskType)} words)보다 ${getMinWords(savedTaskType) - savedWordCount} words 부족합니다.`}
                </div>
              </div>
              <button
                css={wordCountModalButtonStyle}
                onClick={() => setShowWordCountModal(false)}
                type="button"
              >
                확인
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default WritingPractice;

