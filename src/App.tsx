/** @jsxImportSource @emotion/react */
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import GlobalStyles from '/Users/junoshon/Developments/band9-web/src/styles/global.tsx';
import Home from '/Users/junoshon/Developments/band9-web/src/pages/Home.tsx';
import Reading from '/Users/junoshon/Developments/band9-web/src/pages/Reading.tsx';
import ReadingPractice from '/Users/junoshon/Developments/band9-web/src/pages/ReadingPractice.tsx';
import Writing from '/Users/junoshon/Developments/band9-web/src/pages/Writing.tsx';
import Listening from '/Users/junoshon/Developments/band9-web/src/pages/Listening.tsx';
import Speaking from '/Users/junoshon/Developments/band9-web/src/pages/Speaking.tsx';

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
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <GlobalStyles />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;




