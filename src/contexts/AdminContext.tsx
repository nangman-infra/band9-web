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
        // 401 에러는 정상적인 경우 (로그인하지 않은 상태)이므로 에러를 던지지 않음
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
      const isAdminLoginPage = currentPath === '/admin' || currentPath === '/admin/';
      
      if (isAdminPath && !isAdminLoginPage) {
        // /admin/dashboard 같은 보호된 경로에서만 인증 상태 확인
        checkAdminStatus();
      } else {
        // 관리자 페이지가 아니거나 로그인 페이지면 인증 상태를 false로 설정하고 로딩 완료
        setIsAdminAuthenticated(false);
        setIsLoading(false);
      }
    };

    // 초기 체크
    checkPath();

    // 경로 변경 감지를 위한 이벤트 리스너
    const handlePopState = () => {
      // 약간의 지연을 두어 리다이렉트가 완료된 후 체크
      setTimeout(() => {
        checkPath();
      }, 100);
    };

    window.addEventListener('popstate', handlePopState);

    // pushState/replaceState 감지를 위한 커스텀 이벤트 리스너
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      setTimeout(() => {
        checkPath();
      }, 100);
    };

    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      setTimeout(() => {
        checkPath();
      }, 100);
    };

    return () => {
      window.removeEventListener('popstate', handlePopState);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
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


