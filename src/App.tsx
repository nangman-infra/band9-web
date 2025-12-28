/** @jsxImportSource @emotion/react */
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import GlobalStyles from '@/styles/global.tsx';
import Navigation from '@/components/Navigation.tsx';
import Home from '@/pages/Home.tsx';
import Reading from '@/pages/Reading.tsx';
import ReadingPractice from '@/pages/ReadingPractice.tsx';
import Writing from '@/pages/Writing.tsx';
import Listening from '@/pages/Listening.tsx';
import Speaking from '@/pages/Speaking.tsx';
import Vocabulary from '@/pages/Vocabulary.tsx';
import VocabularyInput from '@/pages/VocabularyInput.tsx';
import VocabularyPractice from '@/pages/VocabularyPractice.tsx';

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/reading" element={<Reading />} />
        <Route path="/reading/:date" element={<ReadingPractice />} />
        <Route path="/writing" element={<Writing />} />
        <Route path="/listening" element={<Listening />} />
        <Route path="/speaking" element={<Speaking />} />
        <Route path="/vocabulary" element={<Vocabulary />} />
        <Route path="/vocabulary/:date/input" element={<VocabularyInput />} />
        <Route path="/vocabulary/:date/practice" element={<VocabularyPractice />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <GlobalStyles />
      <Navigation />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;




