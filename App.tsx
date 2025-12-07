import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ImageIdentifier from './components/ImageIdentifier';
import Quiz from './components/Quiz';
import Leaderboard from './components/Leaderboard';
import { ViewState } from './types';

function App() {
  const [currentView, setView] = useState<ViewState>(ViewState.HOME);

  const renderView = () => {
    switch (currentView) {
      case ViewState.HOME:
        return <Hero setView={setView} />;
      case ViewState.IDENTIFY:
        return <ImageIdentifier />;
      case ViewState.QUIZ:
        return <Quiz />;
      case ViewState.LEADERBOARD:
        return <Leaderboard />;
      default:
        return <Hero setView={setView} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-900">
      <Header currentView={currentView} setView={setView} />
      <main className="flex-grow">
        {renderView()}
      </main>
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Dharohar. Celebrating Indian Heritage.</p>
          <p className="mt-2">Powered by Google Gemini 2.5</p>
        </div>
      </footer>
    </div>
  );
}

export default App;