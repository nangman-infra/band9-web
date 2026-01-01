import { apiFetch } from '@/utils/api';

export interface Option {
  id: string;
  label: string;
  optionText: string;
  order: number;
}

export interface Question {
  id: string;
  questionType: 'multiple_choice' | 'true_false_not_given' | 'sentence_completion';
  questionText: string;
  order: number;
  correctAnswer: string | null;
  options?: Option[];
}

export interface ReadingPassage {
  id: string;
  title: string;
  content: string;
  date: string;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOptionDto {
  label: string;
  optionText: string;
  order: number;
}

export interface CreateQuestionDto {
  questionType: 'multiple_choice' | 'true_false_not_given' | 'sentence_completion';
  questionText: string;
  order: number;
  correctAnswer?: string | null;
  options?: CreateOptionDto[];
}

export interface CreateReadingPassageDto {
  title: string;
  content: string;
  date: string;
  questions: CreateQuestionDto[];
}

export const readingService = {
  // 날짜별 지문 조회 (사용자)
  getPassageByDate: async (date: string): Promise<ReadingPassage> => {
    const result = await apiFetch<ReadingPassage>(`reading/passages/${date}`);
    if (!result.data) {
      throw new Error('Failed to fetch passage: No data returned');
    }
    return result.data;
  },

  // [어드민] 모든 지문 조회
  getAllPassages: async (): Promise<ReadingPassage[]> => {
    try {
      const result = await apiFetch<ReadingPassage[]>('reading/admin/passages');
      // 빈 배열도 유효한 응답이므로 그대로 반환
      return result.data || [];
    } catch (err) {
      // 404 에러는 빈 배열로 처리 (지문이 없는 경우)
      if (err instanceof Error && 'status' in err && (err as any).status === 404) {
        return [];
      }
      throw err;
    }
  },

  // [어드민] 지문 상세 조회
  getPassageById: async (id: string): Promise<ReadingPassage> => {
    const result = await apiFetch<ReadingPassage>(`reading/admin/passages/${id}`);
    if (!result.data) {
      throw new Error('Failed to fetch passage: No data returned');
    }
    return result.data;
  },

  // [어드민] 지문 생성
  createPassage: async (dto: CreateReadingPassageDto): Promise<ReadingPassage> => {
    const { getApiUrl } = await import('@/config/env');
    const url = getApiUrl('reading/admin/passages');
    console.log('Creating passage - URL:', url);
    console.log('Creating passage - DTO:', JSON.stringify(dto, null, 2));
    
    const result = await apiFetch<ReadingPassage>('reading/admin/passages', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
    
    console.log('Create passage response:', result);
    
    if (!result.data) {
      throw new Error('Failed to create passage: No data returned');
    }
    return result.data;
  },

  // [어드민] 지문 수정
  updatePassage: async (id: string, dto: Partial<CreateReadingPassageDto>): Promise<ReadingPassage> => {
    const result = await apiFetch<ReadingPassage>(`reading/admin/passages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dto),
    });
    if (!result.data) {
      throw new Error('Failed to update passage: No data returned');
    }
    return result.data;
  },

  // [어드민] 지문 삭제
  deletePassage: async (id: string): Promise<void> => {
    await apiFetch(`reading/admin/passages/${id}`, {
      method: 'DELETE',
    });
  },
};

