/** @jsxImportSource @emotion/react */
import { useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { ReadingManagement } from '@/components/admin/ReadingManagement';
import { WritingManagement } from '@/components/admin/WritingManagement';
import { css } from '@emotion/react';
import { motion } from 'framer-motion';

const containerStyle = css`
  min-height: 100vh;
  background: #F5F7FA;
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
`;

const headerStyle = css`
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const headerContentStyle = css`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const titleStyle = css`
  font-size: 1.5rem;
  font-weight: 700;
  color: #004C97;
`;

const logoutButtonStyle = css`
  padding: 0.5rem 1.5rem;
  background: #dc3545;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #c82333;
  }
`;

const contentStyle = css`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const tabsStyle = css`
  border-bottom: 2px solid #e0e0e0;
  margin-bottom: 2rem;
`;

const tabNavStyle = css`
  display: flex;
  gap: 0;
`;

const tabButtonStyle = (isActive: boolean) => css`
  padding: 1rem 2rem;
  border: none;
  background: transparent;
  font-size: 1rem;
  font-weight: 600;
  color: ${isActive ? '#004C97' : '#666'};
  cursor: pointer;
  border-bottom: 3px solid ${isActive ? '#004C97' : 'transparent'};
  transition: color 0.2s;

  &:hover {
    color: #004C97;
  }
`;

export const AdminDashboard = () => {
  const { logout } = useAdmin();
  const [activeTab, setActiveTab] = useState<'reading' | 'writing'>('reading');

  return (
    <div css={containerStyle}>
      <header css={headerStyle}>
        <div css={headerContentStyle}>
          <h1 css={titleStyle}>관리자 대시보드</h1>
          <button css={logoutButtonStyle} onClick={logout} type="button">
            로그아웃
          </button>
        </div>
      </header>

      <div css={contentStyle}>
        <div css={tabsStyle}>
          <nav css={tabNavStyle}>
            <button
              css={tabButtonStyle(activeTab === 'reading')}
              onClick={() => setActiveTab('reading')}
              type="button"
            >
              리딩 관리
            </button>
            <button
              css={tabButtonStyle(activeTab === 'writing')}
              onClick={() => setActiveTab('writing')}
              type="button"
            >
              라이팅 관리
            </button>
          </nav>
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'reading' && <ReadingManagement />}
          {activeTab === 'writing' && <WritingManagement />}
        </motion.div>
      </div>
    </div>
  );
};


