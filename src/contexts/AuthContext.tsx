/** @jsxImportSource @emotion/react */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, api } from '@/services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 인증 상태 확인
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // 인증된 사용자 정보를 조회하는 API 호출
      // 이 호출은 인터셉터에서 refresh를 시도하지 않도록 설정됨
      await api.get('/auth/me');
      setIsAuthenticated(true);
    } catch (error: any) {
      // 401 에러는 인증되지 않은 상태로 처리 (정상적인 경우)
      // 쿠키가 없거나 만료된 경우이므로 로그인 페이지로 리다이렉트하지 않음
      if (error.response?.status === 401) {
        setIsAuthenticated(false);
      } else {
        // 다른 에러는 그대로 전파
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = () => {
    authService.loginWithGoogle();
  };

  const logout = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
      // 에러가 발생해도 로그아웃 상태로 변경
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
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

