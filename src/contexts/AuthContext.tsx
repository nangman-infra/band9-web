/** @jsxImportSource @emotion/react */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, api } from '@/services/authService';

interface User {
  id: number;
  email: string;
  name: string;
  googleId?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: () => void;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // 인증 상태 확인
  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      // 인증된 사용자 정보를 조회하는 API 호출
      // 이 호출은 인터셉터에서 refresh를 시도하지 않도록 설정됨
      const response = await api.get('/auth/me');
      setIsAuthenticated(true);
      // API 응답 형식에 따라 user 데이터 설정
      // response.data.data 또는 response.data 형식일 수 있음
      const userData = response.data?.data || response.data;
      setUser(userData);
    } catch (error: any) {
      // 401 에러는 인증되지 않은 상태로 처리 (정상적인 경우)
      // 쿠키가 없거나 만료된 경우이므로 로그인 페이지로 리다이렉트하지 않음
      if (error.response?.status === 401) {
        setIsAuthenticated(false);
        setUser(null);
      } else {
        // 다른 에러는 그대로 전파
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 인증 상태 확인
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = () => {
    authService.loginWithGoogle();
  };

  const logout = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // 에러가 발생해도 상태는 초기화
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

