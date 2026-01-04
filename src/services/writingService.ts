import { apiFetch } from '@/utils/api';

// 새로운 API 구조에 맞는 타입 정의
export interface WritingQuestion {
  id: string;
  date: string;
  taskType: number; // 1 or 2
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWritingQuestionDto {
  date: string; // YYYY-MM-DD 형식
  taskType: number; // 1 or 2
  content: string;
}

export const writingService = {
  // 날짜별 라이팅 문제 조회 (사용자)
  getQuestionsByDate: async (date: string): Promise<WritingQuestion[]> => {
    try {
      const result = await apiFetch<WritingQuestion[]>(`writing/questions/${date}`);
      return result.data || [];
    } catch (err) {
      if (err instanceof Error && 'status' in err && (err as any).status === 404) {
        return [];
      }
      throw err;
    }
  },

  // [어드민] 모든 라이팅 문제 조회
  getAllQuestions: async (): Promise<WritingQuestion[]> => {
    try {
      const result = await apiFetch<WritingQuestion[]>('writing/admin/questions');
      return result.data || [];
    } catch (err) {
      if (err instanceof Error && 'status' in err && (err as any).status === 404) {
        return [];
      }
      throw err;
    }
  },

  // [어드민] 라이팅 문제 상세 조회
  getQuestionById: async (id: string): Promise<WritingQuestion> => {
    const result = await apiFetch<WritingQuestion>(`writing/admin/questions/${id}`);
    if (!result.data) {
      throw new Error('Failed to fetch question: No data returned');
    }
    return result.data;
  },

  // [어드민] 라이팅 문제 생성
  createQuestion: async (dto: CreateWritingQuestionDto): Promise<WritingQuestion> => {
    const result = await apiFetch<WritingQuestion>('writing/admin/questions', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
    
    if (!result.data) {
      throw new Error('Failed to create question: No data returned');
    }
    return result.data;
  },

  // [어드민] 라이팅 문제 삭제
  deleteQuestion: async (id: string): Promise<void> => {
    await apiFetch(`writing/admin/questions/${id}`, {
      method: 'DELETE',
    });
  },
};





