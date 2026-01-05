/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminApi } from '@/services/adminService';
import type { ReadingPassage, CreateReadingPassageDto } from '@/services/readingService';
import { ApiError } from '@/utils/api';
import { WordCardSkeleton } from '@/components/WordCardSkeleton';
import ReadingPassageForm from '@/components/ReadingPassageForm';
import { ConfirmDeleteDialog } from './ConfirmDeleteDialog';

const contentStyle = css`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
`;

const headerStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const titleStyle = css`
  font-size: 1.5rem;
  font-weight: 700;
  color: #004C97;
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

const passageListStyle = css`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const passageCardStyle = css`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const passageHeaderStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const passageInfoStyle = css`
  flex: 1;
`;

const passageTitleStyle = css`
  font-size: 1.5rem;
  font-weight: 700;
  color: #004C97;
  margin-bottom: 0.5rem;
`;

const passageMetaStyle = css`
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

export const ReadingManagement = () => {
  const [passages, setPassages] = useState<ReadingPassage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPassage, setEditingPassage] = useState<ReadingPassage | null>(null);
  const [deletingPassageId, setDeletingPassageId] = useState<string | null>(null);
  const [deletingPassageTitle, setDeletingPassageTitle] = useState<string>('');

  const loadPassages = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await adminApi.get('/admin/reading/passages');
      const data = response.data?.data || response.data;
      setPassages(data || []);
    } catch (err) {
      console.error('Failed to load passages:', err);
      if (err instanceof ApiError && err.status === 404) {
        setPassages([]);
      } else {
        if (err instanceof ApiError) {
          setError(`지문 목록을 불러오는데 실패했습니다: ${err.message}`);
        } else if (err instanceof Error) {
          setError(`지문 목록을 불러오는데 실패했습니다: ${err.message}`);
        } else {
          setError('지문 목록을 불러오는데 실패했습니다.');
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPassages();
  }, [loadPassages]);

  const handleDeleteClick = (id: string, title: string) => {
    setDeletingPassageId(id);
    setDeletingPassageTitle(title);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingPassageId) return;
    try {
      await adminApi.delete(`/admin/reading/passages/${deletingPassageId}`);
      setDeletingPassageId(null);
      setDeletingPassageTitle('');
      loadPassages();
    } catch (err) {
      console.error('Failed to delete passage:', err);
      alert('삭제에 실패했습니다.');
      setDeletingPassageId(null);
      setDeletingPassageTitle('');
    }
  };

  const handleDeleteCancel = () => {
    setDeletingPassageId(null);
    setDeletingPassageTitle('');
  };

  const handleEdit = (passage: ReadingPassage) => {
    setEditingPassage(passage);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingPassage(null);
    setShowForm(true);
  };

  const handleFormSubmit = async (dto: CreateReadingPassageDto) => {
    try {
      if (editingPassage) {
        await adminApi.put(`/admin/reading/passages/${editingPassage.id}`, dto);
      } else {
        await adminApi.post('/admin/reading/passages', dto);
      }
      setShowForm(false);
      setEditingPassage(null);
      loadPassages();
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
    setEditingPassage(null);
  };

  if (isLoading) {
    return (
      <div css={contentStyle}>
        <div css={passageListStyle}>
          {[...Array(3)].map((_, index) => (
            <WordCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div css={contentStyle}>
        <div css={emptyStateStyle}>{error}</div>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {showForm && (
          <ReadingPassageForm
            passage={editingPassage}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        )}
      </AnimatePresence>
      <ConfirmDeleteDialog
        isOpen={deletingPassageId !== null}
        title="지문 삭제"
        message={`"${deletingPassageTitle}" 지문을 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
      <div css={contentStyle}>
        <div css={headerStyle}>
          <h2 css={titleStyle}>리딩 지문 관리</h2>
          <button css={addButtonStyle} onClick={handleAdd} type="button">
            + 새 지문 추가
          </button>
        </div>
        {passages.length === 0 ? (
          <div css={emptyStateStyle}>
            등록된 지문이 없습니다. "새 지문 추가" 버튼을 클릭하여 지문을 추가하세요.
          </div>
        ) : (
          <div css={passageListStyle}>
            {passages.map((passage) => (
              <motion.div
                key={passage.id}
                css={passageCardStyle}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div css={passageHeaderStyle}>
                  <div css={passageInfoStyle}>
                    <h3 css={passageTitleStyle}>{passage.title}</h3>
                    <div css={passageMetaStyle}>날짜: {passage.date}</div>
                    <div css={passageMetaStyle}>문제 수: {passage.questions.length}개</div>
                  </div>
                  <div css={actionButtonsStyle}>
                    <button
                      css={editButtonStyle}
                      onClick={() => handleEdit(passage)}
                      type="button"
                    >
                      수정
                    </button>
                    <button
                      css={deleteButtonStyle}
                      onClick={() => handleDeleteClick(passage.id, passage.title)}
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
    </>
  );
};
