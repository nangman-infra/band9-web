/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { writingService, type WritingQuestion, type CreateWritingQuestionDto } from '@/services/writingService';
import { ApiError } from '@/utils/api';
import { WordCardSkeleton } from '@/components/WordCardSkeleton';
import WritingTaskForm from '@/components/WritingTaskForm';

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

const addButtonStyle = css`
  background: #004C97;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background 0.2s;

  &:hover {
    background: #0066CC;
  }
`;

const contentStyle = css`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
`;

const taskListStyle = css`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const taskCardStyle = css`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const taskHeaderStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const taskInfoStyle = css`
  flex: 1;
`;

const taskTitleStyle = css`
  font-size: 1.5rem;
  font-weight: 700;
  color: #004C97;
  margin-bottom: 0.5rem;
`;

const taskMetaStyle = css`
  font-size: 0.875rem;
  color: #666;
  margin-top: 0.25rem;
`;

const taskContentStyle = css`
  font-size: 1rem;
  color: #333;
  line-height: 1.6;
  margin-top: 0.75rem;
  white-space: pre-wrap;
  word-break: break-word;
`;

const taskBadgeStyle = (taskType: number) => css`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-right: 0.5rem;
  background: ${taskType === 1 ? '#E3F2FD' : '#E8F5E9'};
  color: ${taskType === 1 ? '#1976D2' : '#388E3C'};
`;

const actionButtonsStyle = css`
  display: flex;
  gap: 0.5rem;
`;

const editButtonStyle = css`
  background: #FFC107;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  color: #333;
  transition: background 0.2s;

  &:hover {
    background: #FFD54F;
  }
`;

const deleteButtonStyle = css`
  background: #dc3545;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.875rem;
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

function WritingAdmin() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<WritingQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<WritingQuestion | null>(null);

  const loadQuestions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await writingService.getAllQuestions();
      // 날짜 내림차순으로 정렬
      const sorted = (data || []).sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      setQuestions(sorted);
    } catch (err) {
      console.error('Failed to load questions:', err);
      if (err instanceof ApiError && err.status === 404) {
        setQuestions([]);
      } else {
        if (err instanceof ApiError) {
          setError(`문제 목록을 불러오는데 실패했습니다: ${err.message}`);
        } else if (err instanceof Error) {
          setError(`문제 목록을 불러오는데 실패했습니다: ${err.message}`);
        } else {
          setError('문제 목록을 불러오는데 실패했습니다.');
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await writingService.deleteQuestion(id);
      loadQuestions();
    } catch (err) {
      console.error('Failed to delete question:', err);
      alert('삭제에 실패했습니다.');
    }
  };

  const handleAdd = () => {
    setEditingQuestion(null);
    setShowForm(true);
  };

  const handleFormSubmit = async (dto: CreateWritingQuestionDto) => {
    try {
      await writingService.createQuestion(dto);
      setShowForm(false);
      setEditingQuestion(null);
      loadQuestions();
    } catch (err) {
      console.error('저장 실패:', err);
      let errorMessage = '저장에 실패했습니다.';
      if (err instanceof ApiError) {
        errorMessage = `저장에 실패했습니다: ${err.message} (상태 코드: ${err.status || 'unknown'})`;
        console.error('API Error Details:', {
          status: err.status,
          message: err.message,
          response: err.response,
        });
      } else if (err instanceof Error) {
        errorMessage = `저장에 실패했습니다: ${err.message}`;
      }
      alert(errorMessage);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingQuestion(null);
  };

  if (isLoading) {
    return (
      <div css={containerStyle}>
        <div css={headerStyle}>
          <h1 css={titleStyle}>IELTS Writing 문제 관리</h1>
          <button css={backButtonStyle} onClick={() => navigate('/writing')} type="button">
            ← Writing
          </button>
        </div>
        <div css={contentStyle}>
          <div css={taskListStyle}>
            {[...Array(3)].map((_, index) => (
              <WordCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div css={containerStyle}>
        <div css={headerStyle}>
          <h1 css={titleStyle}>IELTS Writing 문제 관리</h1>
          <button css={backButtonStyle} onClick={() => navigate('/writing')} type="button">
            ← Writing
          </button>
        </div>
        <div css={contentStyle}>
          <div css={emptyStateStyle}>{error}</div>
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
        <h1 css={titleStyle}>IELTS Writing 문제 관리</h1>
        <div css={actionButtonsStyle}>
          <button css={addButtonStyle} onClick={handleAdd} type="button">
            + 새 문제 추가
          </button>
          <button css={backButtonStyle} onClick={() => navigate('/writing')} type="button">
            ← Writing
          </button>
        </div>
      </div>
      <AnimatePresence>
        {showForm && (
          <WritingTaskForm
            question={editingQuestion}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        )}
      </AnimatePresence>
      <div css={contentStyle}>
        {questions.length === 0 ? (
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
            <div css={emptyTitleStyle}>등록된 문제가 없습니다</div>
            <div css={emptyMessageStyle}>
              "새 문제 추가" 버튼을 클릭하여 첫 번째 Writing 문제를 추가해보세요.
            </div>
          </motion.div>
        ) : (
          <div css={taskListStyle}>
            {questions.map((question) => (
              <motion.div
                key={question.id}
                css={taskCardStyle}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div css={taskHeaderStyle}>
                  <div css={taskInfoStyle}>
                    <div css={css`display: flex; align-items: center; margin-bottom: 0.5rem;`}>
                      <span css={taskBadgeStyle(question.taskType)}>
                        Task {question.taskType}
                      </span>
                      <span css={taskMetaStyle}>{question.date}</span>
                    </div>
                    <div css={taskContentStyle}>{question.content}</div>
                    <div css={css`${taskMetaStyle}; margin-top: 0.75rem;`}>
                      생성일: {new Date(question.createdAt).toLocaleString('ko-KR')}
                    </div>
                  </div>
                  <div css={actionButtonsStyle}>
                    <button
                      css={deleteButtonStyle}
                      onClick={() => handleDelete(question.id)}
                      type="button"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default WritingAdmin;


