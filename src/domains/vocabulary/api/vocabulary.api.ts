import { apiFetch } from '@/utils/api';
import type { Word, WordCreateRequest } from '@/domains/vocabulary/types';

// 어휘 저장
export async function createWords(
  date: string,
  words: WordCreateRequest[],
): Promise<Word[]> {
  const result = await apiFetch<Word[]>(`vocabulary/${date}/words`, {
    method: 'POST',
    body: JSON.stringify({ words }),
  });
  if (!result.data) {
    throw new Error('Failed to create words: No data returned');
  }
  return result.data;
}

// 날짜별 어휘 조회
export async function getWordsByDate(date: string): Promise<Word[]> {
  const result = await apiFetch<Word[]>(`vocabulary/${date}/words`);
  if (!result.data) {
    throw new Error('Failed to fetch words: No data returned');
  }
  return result.data;
}

// 어휘 수정
export async function updateWord(
  id: string,
  wordData: Partial<WordCreateRequest>,
): Promise<Word> {
  const result = await apiFetch<Word>(`vocabulary/words/${id}`, {
    method: 'PUT',
    body: JSON.stringify(wordData),
  });
  if (!result.data) {
    throw new Error('Failed to update word: No data returned');
  }
  return result.data;
}

// 어휘 삭제
export async function deleteWord(id: string): Promise<void> {
  await apiFetch(`vocabulary/words/${id}`, {
    method: 'DELETE',
  });
}

