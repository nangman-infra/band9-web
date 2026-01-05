/** @jsxImportSource @emotion/react */
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import GlobalStyles from '@/styles/global.tsx';
import Navigation from '@/components/Navigation.tsx';
import { AuthProvider } from '@/contexts/AuthContext';
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
import ReadingAdmin from '@/pages/ReadingAdmin.tsx';
import WritingPractice from '@/pages/WritingPractice.tsx';
import WritingAdmin from '@/pages/WritingAdmin.tsx';

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<Login />} />
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
        <Route path="/vocabulary/:date/practice/mode" element={<VocabularyPracticeMode />} />
        <Route path="/vocabulary/:date/practice/quiz" element={<VocabularyPractice />} />
        <Route path="/vocabulary/:date/practice/dragdrop" element={<VocabularyDragDrop />} />
        <Route path="/vocabulary/:date/practice/listening" element={<VocabularyListening />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <GlobalStyles />
        <Navigation />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;




