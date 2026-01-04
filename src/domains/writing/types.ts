export type WritingTaskType = 'task1' | 'task2';
export type Task1Type = 'academic' | 'general';

export interface WritingTask {
  id: string;
  date: string;
  taskType: WritingTaskType;
  task1Type?: Task1Type;
  title: string;
  instruction: string;
  content?: string; // 사용자가 작성한 내용 (선택적)
  createdAt: string;
  updatedAt: string;
}

export interface CreateWritingTaskDto {
  date: string;
  taskType: WritingTaskType;
  task1Type?: Task1Type;
  title: string;
  instruction: string;
}

export interface UpdateWritingTaskDto {
  title?: string;
  instruction?: string;
  content?: string;
}






