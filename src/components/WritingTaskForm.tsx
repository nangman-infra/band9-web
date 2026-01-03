/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { WritingTask, CreateWritingTaskDto } from '@/domains/writing/types';

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
  task?: WritingTask | null;
  onSubmit: (dto: CreateWritingTaskDto) => void;
  onCancel: () => void;
}

function WritingTaskForm({ task, onSubmit, onCancel }: WritingTaskFormProps) {
  const [date, setDate] = useState('');
  const [taskType, setTaskType] = useState<'task1' | 'task2'>('task1');
  const [task1Type, setTask1Type] = useState<'academic' | 'general'>('academic');
  const [title, setTitle] = useState('');
  const [instruction, setInstruction] = useState('');

  useEffect(() => {
    if (task) {
      setDate(task.date);
      setTaskType(task.taskType);
      setTask1Type(task.task1Type || 'academic');
      setTitle(task.title);
      setInstruction(task.instruction);
    } else {
      setDate(new Date().toISOString().split('T')[0]);
      setTaskType('task1');
      setTask1Type('academic');
      setTitle('');
      setInstruction('');
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date.trim() || !title.trim() || !instruction.trim()) {
      alert('날짜, 제목, 지시사항을 모두 입력해주세요.');
      return;
    }

    onSubmit({
      date: date.trim(),
      taskType,
      task1Type: taskType === 'task1' ? task1Type : undefined,
      title: title.trim(),
      instruction: instruction.trim(),
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
            {task ? 'Writing 문제 수정' : '새 Writing 문제 추가'}
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
              onChange={(e) => setTaskType(e.target.value as 'task1' | 'task2')}
              required
            >
              <option value="task1">Task 1</option>
              <option value="task2">Task 2</option>
            </select>
          </div>

          {taskType === 'task1' && (
            <div css={formGroupStyle}>
              <label css={labelStyle} htmlFor="task1Type">
                Task 1 유형 *
              </label>
              <select
                id="task1Type"
                css={selectStyle}
                value={task1Type}
                onChange={(e) => setTask1Type(e.target.value as 'academic' | 'general')}
                required
              >
                <option value="academic">Academic (차트/그래프/표 설명)</option>
                <option value="general">General (편지 작성)</option>
              </select>
            </div>
          )}

          <div css={formGroupStyle}>
            <label css={labelStyle} htmlFor="title">
              제목 *
            </label>
            <input
              id="title"
              css={inputStyle}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="문제 제목을 입력하세요"
              required
            />
          </div>

          <div css={formGroupStyle}>
            <label css={labelStyle} htmlFor="instruction">
              지시사항 (Instruction) *
            </label>
            <textarea
              id="instruction"
              css={textareaStyle}
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="Writing 지시사항을 입력하세요"
              required
            />
          </div>

          <button css={submitButtonStyle} type="submit">
            {task ? '수정하기' : '저장하기'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default WritingTaskForm;


