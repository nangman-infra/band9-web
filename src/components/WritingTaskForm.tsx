/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { WritingQuestion, CreateWritingQuestionDto } from '@/services/writingService';

const formOverlayStyle = css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
`;

const formContainerStyle = css`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
`;

const formHeaderStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const formTitleStyle = css`
  font-size: 1.5rem;
  font-weight: 700;
  color: #004C97;
`;

const closeButtonStyle = css`
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

const formGroupStyle = css`
  margin-bottom: 1.5rem;
`;

const labelStyle = css`
  display: block;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
`;

const wordRequirementStyle = css`
  font-size: 0.875rem;
  color: #666;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: #E6F2FF;
  border-radius: 6px;
`;

const inputStyle = css`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #004C97;
  }
`;

const textareaStyle = css`
  ${inputStyle}
  min-height: 200px;
  resize: vertical;
  font-family: inherit;
`;

const selectStyle = css`
  ${inputStyle}
`;

const submitButtonStyle = css`
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

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

interface WritingTaskFormProps {
  question?: WritingQuestion | null;
  onSubmit: (dto: CreateWritingQuestionDto) => void;
  onCancel: () => void;
}

function WritingTaskForm({ question, onSubmit, onCancel }: WritingTaskFormProps) {
  const [date, setDate] = useState('');
  const [taskType, setTaskType] = useState<number>(1);
  const [content, setContent] = useState('');

  useEffect(() => {
    if (question) {
      setDate(question.date);
      setTaskType(question.taskType);
      setContent(question.content);
    } else {
      setDate(new Date().toISOString().split('T')[0]);
      setTaskType(1);
      setContent('');
    }
  }, [question]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date.trim() || !content.trim()) {
      alert('날짜와 문제 내용을 모두 입력해주세요.');
      return;
    }

    if (taskType !== 1 && taskType !== 2) {
      alert('Task 유형은 1 또는 2여야 합니다.');
      return;
    }

    onSubmit({
      date: date.trim(),
      taskType,
      content: content.trim(),
    });
  };

  return (
    <motion.div
      css={formOverlayStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onCancel}
    >
      <motion.div
        css={formContainerStyle}
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div css={formHeaderStyle}>
          <h2 css={formTitleStyle}>
            {question ? 'Writing 문제 수정' : '새 Writing 문제 추가'}
          </h2>
          <button css={closeButtonStyle} onClick={onCancel} type="button">
            닫기
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div css={formGroupStyle}>
            <label css={labelStyle} htmlFor="date">
              날짜 (YYYY-MM-DD) *
            </label>
            <input
              id="date"
              css={inputStyle}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div css={formGroupStyle}>
            <label css={labelStyle} htmlFor="taskType">
              Task 유형 *
            </label>
            <select
              id="taskType"
              css={selectStyle}
              value={taskType}
              onChange={(e) => setTaskType(Number(e.target.value))}
              required
            >
              <option value={1}>Task 1</option>
              <option value={2}>Task 2</option>
            </select>
            {taskType === 1 && (
              <div css={wordRequirementStyle}>
                ⚠ Task 1은 150단어 이상 작성해야 합니다.
              </div>
            )}
          </div>

          <div css={formGroupStyle}>
            <label css={labelStyle} htmlFor="content">
              문제 내용 *
            </label>
            <textarea
              id="content"
              css={textareaStyle}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="라이팅 문제 내용을 입력하세요..."
              required
            />
          </div>

          <button css={submitButtonStyle} type="submit">
            {question ? '수정하기' : '저장하기'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default WritingTaskForm;




