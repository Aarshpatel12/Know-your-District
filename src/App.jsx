import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DirectoryPage from './pages/DirectoryPage';
import GlobalHeader from './components/GlobalHeader';

function App() {
  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans">
      <GlobalHeader />
      <div className="flex-1 overflow-hidden flex flex-col">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/directory/:category" element={<DirectoryPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;