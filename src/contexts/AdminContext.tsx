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

  // 컴포넌트 마운트 시 인증 상태 확인
  useEffect(() => {
    checkAdminStatus();
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
