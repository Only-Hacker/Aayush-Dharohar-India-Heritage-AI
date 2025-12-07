import React from 'react';
import { ViewState } from '../types';

interface HeaderProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: ViewState.HOME, label: 'Home' },
    { id: ViewState.IDENTIFY, label: 'AI Eye' },
    { id: ViewState.QUIZ, label: 'Heritage Quiz' },
    { id: ViewState.LEADERBOARD, label: 'Leaderboard' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => setView(ViewState.HOME)}>
            <span className="text-3xl mr-2">🛕</span>
            <span className="font-serif font-bold text-2xl bg-gradient-to-r from-orange-600 via-yellow-600 to-green-700 bg-clip-text text-transparent">
              Dharohar
            </span>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  currentView === item.id
                    ? 'text-orange-600 bg-orange-50'
                    : 'text-gray-600 hover:text-orange-500 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Mobile Nav Toggle (Simplified for this demo) */}
          <div className="md:hidden flex items-center">
            <div className="flex space-x-2">
               {navItems.map((item) => (
                 <button
                   key={item.id}
                   onClick={() => setView(item.id)}
                   className={`p-2 rounded-full ${currentView === item.id ? 'bg-orange-100 text-orange-600' : 'text-gray-500'}`}
                   aria-label={item.label}
                 >
                   {/* Simple Icons based on label first letter/concept */}
                   {item.id === ViewState.HOME && '🏠'}
                   {item.id === ViewState.IDENTIFY && '👁️'}
                   {item.id === ViewState.QUIZ && '🧠'}
                   {item.id === ViewState.LEADERBOARD && '🏆'}
                 </button>
               ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;