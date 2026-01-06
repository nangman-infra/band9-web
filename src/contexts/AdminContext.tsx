/** @jsxImportSource @emotion/react */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminService, adminApi } from '@/services/adminService';

interface AdminContextType {
  isAdminAuthenticated: boolean;
  isLoading: boolean;
  login: (password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAdminStatus: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 인증 상태 확인
  const checkAdminStatus = async () => {
    try {
      setIsLoading(true);
      // 간단한 API 호출로 인증 상태 확인
      await adminApi.get('/admin/reading/passages');
      setIsAdminAuthenticated(true);
    } catch (error: any) {
      if (error.response?.status === 401) {
        setIsAdminAuthenticated(false);
      } else {
        // 다른 에러도 인증되지 않은 것으로 처리
        setIsAdminAuthenticated(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 관리자 페이지에 있을 때만 인증 상태 확인
  useEffect(() => {
    const checkPath = () => {
      const currentPath = window.location.pathname;
      const isAdminPath = currentPath.startsWith('/admin');
      if (isAdminPath) {
        checkAdminStatus();
      } else {
        // 관리자 페이지가 아니면 인증 상태를 false로 설정하고 로딩 완료
        setIsAdminAuthenticated(false);
        setIsLoading(false);
      }
    };

    // 초기 체크
    checkPath();

    // 경로 변경 감지를 위한 이벤트 리스너
    const handlePopState = () => {
      checkPath();
    };

    window.addEventListener('popstate', handlePopState);

    // 주기적으로 경로 확인 (pushState/replaceState는 popstate 이벤트를 발생시키지 않음)
    const intervalId = setInterval(() => {
      checkPath();
    }, 100);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      clearInterval(intervalId);
    };
  }, []);

  const login = async (password: string) => {
    await adminService.login(password);
    setIsAdminAuthenticated(true);
  };

  const logout = async () => {
    try {
      await adminService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsAdminAuthenticated(false);
      window.location.href = '/admin';
    }
  };

  return (
    <AdminContext.Provider
      value={{ isAdminAuthenticated, isLoading, login, logout, checkAdminStatus }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};


