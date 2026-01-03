import { getApiUrl } from '@/config/env';

// API Response Types
export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  error: string;
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
  
  console.log(`[API] ${options?.method || 'GET'} ${url}`);
  if (options?.body) {
    console.log('[API] Request body:', options.body);
  }
  
  const response = await fetch(url, {
    ...options,
    credentials: 'include', // 쿠키 자동 전송 (withCredentials와 동일)
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  console.log(`[API] Response status: ${response.status} ${response.statusText}`);

  const data: ApiResponse<T> = await response.json();
  console.log('[API] Response data:', data);

  // HTTP 상태 코드 확인
  if (!response.ok) {
    const errorMessage = data.error?.message || `HTTP error! status: ${response.status}`;
    console.error('[API] Error:', errorMessage, data);
    throw new ApiError(
      errorMessage,
      response.status,
      data,
    );
  }

  // 응답 본문의 success 필드 확인 (추가 안전장치)
  if (!data.success) {
    const errorMessage = data.error?.message || 'API request failed';
    console.error('[API] Success false:', errorMessage, data);
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

