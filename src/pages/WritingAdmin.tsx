/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { writingService } from '@/services/writingService';
import type { WritingTask, CreateWritingTaskDto } from '@/domains/writing/types';
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
`;

function WritingAdmin() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<WritingTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<WritingTask | null>(null);

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await writingService.getAllTasks();
      setTasks(data || []);
    } catch (err) {
      console.error('Failed to load tasks:', err);
      if (err instanceof ApiError && err.status === 404) {
        setTasks([]);
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
    loadTasks();
  }, [loadTasks]);

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await writingService.deleteTask(id);
      loadTasks();
    } catch (err) {
      console.error('Failed to delete task:', err);
      alert('삭제에 실패했습니다.');
    }
  };

  const handleEdit = (task: WritingTask) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const handleFormSubmit = async (dto: CreateWritingTaskDto) => {
    try {
      if (editingTask) {
        await writingService.updateTask(editingTask.id, dto);
      } else {
        await writingService.createTask(dto);
      }
      setShowForm(false);
      setEditingTask(null);
      loadTasks();
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
    setEditingTask(null);
  };

  const getTaskTypeLabel = (task: WritingTask) => {
    if (task.taskType === 'task1') {
      return `Task 1 (${task.task1Type === 'academic' ? 'Academic' : 'General'})`;
    }
    return 'Task 2';
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
            task={editingTask}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        )}
      </AnimatePresence>
      <div css={contentStyle}>
        {tasks.length === 0 ? (
          <div css={emptyStateStyle}>
            등록된 문제가 없습니다. "새 문제 추가" 버튼을 클릭하여 문제를 추가하세요.
          </div>
        ) : (
          <div css={taskListStyle}>
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                css={taskCardStyle}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div css={taskHeaderStyle}>
                  <div css={taskInfoStyle}>
                    <h3 css={taskTitleStyle}>{task.title}</h3>
                    <div css={taskMetaStyle}>날짜: {task.date}</div>
                    <div css={taskMetaStyle}>유형: {getTaskTypeLabel(task)}</div>
                  </div>
                  <div css={actionButtonsStyle}>
                    <button
                      css={editButtonStyle}
                      onClick={() => handleEdit(task)}
                      type="button"
                    >
                      수정
                    </button>
                    <button
                      css={deleteButtonStyle}
                      onClick={() => handleDelete(task.id)}
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


