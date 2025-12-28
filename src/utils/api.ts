import { getApiUrl } from '@/config/env';

// API Response Types
export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  path: string;
  timestamp: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T | null;
  error: ApiErrorResponse | null;
}

export interface TestApiData {
  message: string;
}

// API Error Class
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: ApiResponse,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Base API fetch function
export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<ApiResponse<T>> {
  const url = getApiUrl(endpoint);
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  const data: ApiResponse<T> = await response.json();

  // HTTP 상태 코드 확인
  if (!response.ok) {
    const errorMessage = data.error?.message || `HTTP error! status: ${response.status}`;
    throw new ApiError(
      errorMessage,
      response.status,
      data,
    );
  }

  // 응답 본문의 success 필드 확인 (추가 안전장치)
  if (!data.success) {
    const errorMessage = data.error?.message || 'API request failed';
    throw new ApiError(
      errorMessage,
      response.status,
      data,
    );
  }

  return data;
}

// Test API function
export async function fetchTestMessage(): Promise<ApiResponse<TestApiData>> {
  return apiFetch<TestApiData>('test');
}

