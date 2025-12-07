import React, { useEffect, useState } from 'react';
import { QuizResult } from '../types';

const Leaderboard: React.FC = () => {
  const [history, setHistory] = useState<QuizResult[]>([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('quiz_history') || '[]');
    // Sort by score (desc) then date (desc)
    const sorted = data.sort((a: QuizResult, b: QuizResult) => b.score - a.score || new Date(b.date).getTime() - new Date(a.date).getTime());
    setHistory(sorted);
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-serif font-bold text-gray-900">Your Heritage Journey</h2>
        <p className="text-gray-500 mt-2">A record of your knowledge and discoveries.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Mode</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {history.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    No quizzes taken yet. Start your journey today!
                  </td>
                </tr>
              ) : (
                history.map((entry, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {idx === 0 && <span className="text-xl mr-2">🥇</span>}
                        {idx === 1 && <span className="text-xl mr-2">🥈</span>}
                        {idx === 2 && <span className="text-xl mr-2">🥉</span>}
                        <span className={`font-medium ${idx < 3 ? 'text-gray-900' : 'text-gray-500'}`}>#{idx + 1}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${entry.mode === 'daily' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                        {entry.mode === 'daily' ? 'Daily Challenge' : 'Endless Mode'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="font-bold text-gray-900">{entry.score}</span>
                      <span className="text-gray-400 text-sm">/{entry.total}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;