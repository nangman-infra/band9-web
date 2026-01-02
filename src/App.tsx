/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import GlobalStyles from '@/styles/global.tsx';
import Navigation from '@/components/Navigation.tsx';
import PasswordDialog from '@/components/PasswordDialog.tsx';
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
import ReadingAdmin from '@/pages/ReadingAdmin.tsx';
import WritingPractice from '@/pages/WritingPractice.tsx';
import WritingAdmin from '@/pages/WritingAdmin.tsx';

const AUTH_STORAGE_KEY = 'band9_authenticated';

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/reading" element={<Reading />} />
        <Route path="/reading/admin" element={<ReadingAdmin />} />
        <Route path="/reading/:date" element={<ReadingPractice />} />
        <Route path="/writing" element={<Writing />} />
        <Route path="/writing/admin" element={<WritingAdmin />} />
        <Route path="/writing/:date" element={<WritingPractice />} />
        <Route path="/listening" element={<Listening />} />
        <Route path="/speaking" element={<Speaking />} />
        <Route path="/vocabulary" element={<Vocabulary />} />
        <Route path="/vocabulary/:date/input" element={<VocabularyInput />} />
        <Route path="/vocabulary/:date/view" element={<VocabularyView />} />
        <Route path="/vocabulary/:date/practice" element={<VocabularyPractice />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // sessionStorage에서 인증 상태 확인 (탭을 닫으면 자동으로 만료됨)
    const authStatus = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    setIsChecking(false);
  }, []);

  const handleAuthSuccess = () => {
    // sessionStorage에 저장 (브라우저 탭을 닫으면 자동으로 삭제됨)
    sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
    setIsAuthenticated(true);
  };

  // 인증 확인 중이면 아무것도 표시하지 않음
  if (isChecking) {
    return null;
  }

  // 인증되지 않았으면 비밀번호 다이얼로그 표시
  if (!isAuthenticated) {
    return (
      <>
        <GlobalStyles />
        <PasswordDialog isOpen={true} onSuccess={handleAuthSuccess} />
      </>
    );
  }

  // 인증되었으면 정상적으로 앱 표시
  return (
    <BrowserRouter>
      <GlobalStyles />
      <Navigation />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;




