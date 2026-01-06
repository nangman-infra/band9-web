/** @jsxImportSource @emotion/react */
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import GlobalStyles from '@/styles/global.tsx';
import Navigation from '@/components/Navigation.tsx';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { AdminProvider } from '@/contexts/AdminContext';
import Login from '@/pages/Login.tsx';
import Home from '@/pages/Home.tsx';
import Reading from '@/pages/Reading.tsx';
import ReadingPractice from '@/pages/ReadingPractice.tsx';
import Writing from '@/pages/Writing.tsx';
import Listening from '@/pages/Listening.tsx';
import Speaking from '@/pages/Speaking.tsx';
import Vocabulary from '@/pages/Vocabulary.tsx';
import VocabularyInput from '@/pages/VocabularyInput.tsx';
import VocabularyView from '@/pages/VocabularyView.tsx';
import VocabularyPractice from '@/pages/VocabularyPractice.tsx';
import VocabularyPracticeMode from '@/pages/VocabularyPracticeMode.tsx';
import VocabularyDragDrop from '@/pages/VocabularyDragDrop.tsx';
import VocabularyListening from '@/pages/VocabularyListening.tsx';
import { AdminLogin } from '@/pages/AdminLogin';
import { AdminDashboard } from '@/pages/AdminDashboard';
import WritingPractice from '@/pages/WritingPractice.tsx';
import { ProtectedAdminRoute } from '@/components/ProtectedAdminRoute';
import { css } from '@emotion/react';

const loadingStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-size: 1.2rem;
  color: #666;
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
`;

function AppRoutes() {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  // 로딩 중일 때는 로딩 화면 표시
  if (isLoading) {
    return <div css={loadingStyle}>Loading...</div>;
  }

  // 관리자 페이지는 인증 체크에서 제외 (관리자 인증은 별도로 처리)
  const isAdminPath = location.pathname.startsWith('/admin');

  // 로그인하지 않은 사용자가 /login이 아닌 경로에 접근하려고 하면 /login으로 리다이렉트
  // 단, 관리자 페이지(/admin)는 제외
  if (!isAuthenticated && location.pathname !== '/login' && !isAdminPath) {
    return <Navigate to="/login" replace />;
  }

  // 이미 로그인한 사용자가 /login 페이지에 접근하려고 하면 홈으로 리다이렉트
  if (isAuthenticated && location.pathname === '/login') {
    return <Navigate to="/" replace />;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/reading" element={<Reading />} />
        <Route path="/reading/:date" element={<ReadingPractice />} />
        <Route path="/writing" element={<Writing />} />
        <Route path="/writing/:date" element={<WritingPractice />} />
        <Route path="/listening" element={<Listening />} />
        <Route path="/speaking" element={<Speaking />} />
        <Route path="/vocabulary" element={<Vocabulary />} />
        <Route path="/vocabulary/:date/input" element={<VocabularyInput />} />
        <Route path="/vocabulary/:date/view" element={<VocabularyView />} />
        <Route path="/vocabulary/:date/practice/mode" element={<VocabularyPracticeMode />} />
        <Route path="/vocabulary/:date/practice/quiz" element={<VocabularyPractice />} />
        <Route path="/vocabulary/:date/practice/dragdrop" element={<VocabularyDragDrop />} />
        <Route path="/vocabulary/:date/practice/listening" element={<VocabularyListening />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <BrowserRouter>
          <GlobalStyles />
          <Navigation />
          <AppRoutes />
        </BrowserRouter>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;




