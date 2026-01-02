/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { writingService } from '@/services/writingService';
import type { WritingTask } from '@/domains/writing/types';
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

function WritingPractice() {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<WritingTask | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return `${month}/${day}/${year}`;
  };

  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const getMinWords = () => {
    if (!task) return 0;
    return task.taskType === 'task1' ? 150 : 250;
  };

  const loadTask = useCallback(async () => {
    if (!date) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await writingService.getTaskByDate(date);
      if (data) {
        setTask(data);
        setContent(data.content || '');
      } else {
        setError('해당 날짜의 Writing 문제가 없습니다.');
      }
    } catch (err) {
      console.error('Failed to load task:', err);
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
      loadTask();
    }
  }, [date, loadTask]);

  const handleSave = async () => {
    if (!date) return;
    
    setIsSaving(true);
    try {
      await writingService.saveContent(date, content);
      alert('저장되었습니다.');
    } catch (err) {
      console.error('Failed to save content:', err);
      alert('저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClear = () => {
    if (confirm('작성한 내용을 모두 지우시겠습니까?')) {
      setContent('');
    }
  };

  const handleBackClick = () => {
    navigate('/writing');
  };

  const wordCount = countWords(content);
  const minWords = getMinWords();
  const isEnoughWords = wordCount >= minWords;

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
          <div css={emptyStateStyle}>
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!task) {
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
          <div css={emptyStateStyle}>
            해당 날짜의 Writing 문제가 없습니다.
          </div>
        </div>
      </div>
    );
  }

  const taskTypeLabel = task.taskType === 'task1' 
    ? `Task 1 (${task.task1Type === 'academic' ? 'Academic' : 'General'})`
    : 'Task 2';

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
        <div css={taskCardStyle}>
          <div css={taskHeaderStyle}>
            <div>
              <h2 css={taskTitleStyle}>{task.title}</h2>
              <div css={taskTypeStyle}>{taskTypeLabel}</div>
            </div>
            <div css={wordCountStyle}>
              {wordCount} words
            </div>
          </div>
          
          <div css={instructionStyle}>{task.instruction}</div>
          
          <textarea
            css={textareaStyle}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="여기에 작성하세요..."
          />
          
          <div css={minWordsStyle(isEnoughWords)}>
            최소 단어 수: {minWords} words {isEnoughWords ? '✓' : `(${minWords - wordCount} words more needed)`}
          </div>
          
          <div css={buttonGroupStyle}>
            <button
              css={saveButtonStyle}
              onClick={handleSave}
              disabled={isSaving}
              type="button"
            >
              {isSaving ? '저장 중...' : '저장하기'}
            </button>
            <button
              css={clearButtonStyle}
              onClick={handleClear}
              type="button"
            >
              모두 지우기
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default WritingPractice;

