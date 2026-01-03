import { apiFetch } from '@/utils/api';
import type { WritingTask, CreateWritingTaskDto, UpdateWritingTaskDto } from '@/domains/writing/types';

export const writingService = {
  // 날짜별 Writing Task 조회 (사용자)
  getTaskByDate: async (date: string): Promise<WritingTask | null> => {
    try {
      const result = await apiFetch<WritingTask>(`writing/tasks/${date}`);
      return result.data;
    } catch (err) {
      if (err instanceof Error && 'status' in err && (err as any).status === 404) {
        return null;
      }
      throw err;
    }
  },

  // [어드민] 모든 Writing Task 조회
  getAllTasks: async (): Promise<WritingTask[]> => {
    try {
      const result = await apiFetch<WritingTask[]>('writing/admin/tasks');
      return result.data || [];
    } catch (err) {
      if (err instanceof Error && 'status' in err && (err as any).status === 404) {
        return [];
      }
      throw err;
    }
  },

  // [어드민] Writing Task 상세 조회
  getTaskById: async (id: string): Promise<WritingTask> => {
    const result = await apiFetch<WritingTask>(`writing/admin/tasks/${id}`);
    if (!result.data) {
      throw new Error('Failed to fetch task: No data returned');
    }
    return result.data;
  },

  // [어드민] Writing Task 생성
  createTask: async (dto: CreateWritingTaskDto): Promise<WritingTask> => {
    const result = await apiFetch<WritingTask>('writing/admin/tasks', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
    
    if (!result.data) {
      throw new Error('Failed to create task: No data returned');
    }
    return result.data;
  },

  // [어드민] Writing Task 수정
  updateTask: async (id: string, dto: UpdateWritingTaskDto): Promise<WritingTask> => {
    const result = await apiFetch<WritingTask>(`writing/admin/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dto),
    });
    if (!result.data) {
      throw new Error('Failed to update task: No data returned');
    }
    return result.data;
  },

  // [어드민] Writing Task 삭제
  deleteTask: async (id: string): Promise<void> => {
    await apiFetch(`writing/admin/tasks/${id}`, {
      method: 'DELETE',
    });
  },

  // 사용자 작성 내용 저장
  saveContent: async (date: string, content: string): Promise<WritingTask> => {
    const result = await apiFetch<WritingTask>(`writing/tasks/${date}/content`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
    if (!result.data) {
      throw new Error('Failed to save content: No data returned');
    }
    return result.data;
  },
};


