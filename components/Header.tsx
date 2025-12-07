import React from 'react';
import { ViewState } from '../types';

interface HeaderProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: ViewState.HOME, label: 'Home', icon: '🏠' },
    { id: ViewState.EXPLORE, label: 'Search', icon: '🔍' },
    { id: ViewState.IDENTIFY, label: 'AI Eye', icon: '📷' },
    { id: ViewState.QUIZ, label: 'Quiz', icon: '🧠' },
    { id: ViewState.LEADERBOARD, label: 'Rankings', icon: '🏆' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-orange-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center cursor-pointer group" onClick={() => setView(ViewState.HOME)}>
            <span className="text-4xl mr-2 transform group-hover:scale-110 transition-transform duration-200">🛕</span>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-2xl bg-gradient-to-r from-orange-600 via-royalMaroon to-indiaGreen bg-clip-text text-transparent">
                Dharohar
              </span>
              <span className="text-[10px] text-gray-500 font-sans tracking-widest uppercase">Heritage AI</span>
            </div>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-1 p-1 bg-orange-50/50 rounded-full border border-orange-100">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  currentView === item.id
                    ? 'text-white bg-gradient-to-r from-orange-500 to-red-600 shadow-md transform scale-105'
                    : 'text-gray-600 hover:text-orange-600 hover:bg-orange-100/50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Mobile Nav */}
          <div className="md:hidden flex items-center">
            <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border border-gray-100">
               {navItems.map((item) => (
                 <button
                   key={item.id}
                   onClick={() => setView(item.id)}
                   className={`p-3 rounded-lg transition-colors ${
                     currentView === item.id 
                       ? 'bg-orange-100 text-orange-600 shadow-inner' 
                       : 'text-gray-400 hover:bg-gray-50'
                   }`}
                   aria-label={item.label}
                 >
                   <span className="text-xl">{item.icon}</span>
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