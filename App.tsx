import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Explorer from './components/Explorer';
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
      case ViewState.EXPLORE:
        return <Explorer />;
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
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans text-gray-900 pattern-overlay">
      <Header currentView={currentView} setView={setView} />
      <main className="flex-grow">
        {renderView()}
      </main>
      <footer className="bg-white border-t border-gray-200 py-10 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="mb-4">
             <span className="text-2xl">🕉️</span>
          </div>
          <p className="text-gray-500 font-serif">© {new Date().getFullYear()} Dharohar. Celebrating Indian Heritage.</p>
          <p className="mt-2 text-xs text-gray-400">Powered by Google Gemini • Netlify Ready</p>
        </div>
      </footer>
    </div>
  );
}

export default App;