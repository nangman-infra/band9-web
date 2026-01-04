import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { env } from '@/config/env';

const API_BASE_URL = env.apiBaseUrl;

// Axios 인스턴스 생성 (쿠키 자동 전송 설정)
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // 쿠키 자동 전송
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response 인터셉터: 401 에러 시 자동 토큰 갱신
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // /auth/refresh 엔드포인트에서 401이 발생하면 로그인 페이지로 리다이렉트 (무한 루프 방지)
    if (error.config?.url?.includes('/auth/refresh') && error.response?.status === 401) {
      // 현재 경로가 로그인 페이지가 아닐 때만 리다이렉트
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    // /auth/me 엔드포인트는 refresh를 시도하지 않고 그냥 에러 반환 (인증 상태 확인용)
    if (error.config?.url?.includes('/auth/me') && error.response?.status === 401) {
      return Promise.reject(error);
    }

    // 401 에러이고, 아직 재시도하지 않은 요청인 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // 이미 토큰 갱신 중이면 대기
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await authService.refreshToken();
        processQueue(null, null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Refresh 실패 시 로그인 페이지로 리다이렉트 (현재 경로가 로그인 페이지가 아닐 때만)
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const authService = {
  // Google 로그인 시작
  loginWithGoogle: () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  },

  // 현재 사용자 정보 조회
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Access Token 갱신
  refreshToken: async (): Promise<void> => {
    await api.post('/auth/refresh');
  },

  // 로그아웃
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
    // 로그아웃 후 로그인 페이지로 리다이렉트
    window.location.href = '/login';
  },

};

