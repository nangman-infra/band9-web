import axios, { AxiosInstance } from 'axios';
import { env } from '@/config/env';

const API_BASE_URL = env.apiBaseUrl;

// Axios 인스턴스 생성 (쿠키 자동 전송 설정)
export const adminApi: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // 쿠키 자동 전송
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response 인터셉터: 401 에러 시 로그인 페이지로 리다이렉트
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && error.config?.url?.includes('/admin')) {
      // Admin 인증 실패 시 관리자 로그인 페이지로 리다이렉트
      // 단, 현재 경로가 이미 /admin으로 시작하는 경우에만 리다이렉트
      // (일반 사용자가 다른 페이지에 있을 때는 리다이렉트하지 않음)
      const currentPath = window.location.pathname;
      // /admin 로그인 페이지가 아니고, /admin/dashboard 같은 보호된 경로에서만 리다이렉트
      if (currentPath.startsWith('/admin') && currentPath !== '/admin' && currentPath !== '/admin/') {
        // 이미 리다이렉트 중이 아닌 경우에만 리다이렉트
        if (!currentPath.includes('redirecting')) {
          window.location.href = '/admin';
        }
      }
    }
    return Promise.reject(error);
  }
);

export const adminService = {
  // 관리자 로그인
  login: async (password: string): Promise<void> => {
    await adminApi.post('/admin/login', { password });
  },

  // 관리자 로그아웃
  logout: async (): Promise<void> => {
    await adminApi.post('/admin/logout');
  },
};
