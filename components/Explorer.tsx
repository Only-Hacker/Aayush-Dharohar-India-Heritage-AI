import React, { useState } from 'react';
import { searchHeritage } from '../services/gemini';
import { ExplorerResult } from '../types';

const Explorer: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<ExplorerResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await searchHeritage(query);
      setResult(data);
    } catch (err) {
      setError("Unable to find information. Please try a different landmark or keyword.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12 animate-fade-in">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-royalMaroon mb-4">Heritage Explorer</h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Ask our AI historian about any monument, dance form, festival, or artifact.
        </p>
      </div>

      <div className="max-w-2xl mx-auto mb-16 relative z-10">
        <form onSubmit={handleSearch} className="relative group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., Sun Temple Konark, Kathakali, Qutub Minar..."
            className="w-full px-6 py-5 rounded-full text-lg border-2 border-orange-100 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none shadow-lg transition-all pl-14"
          />
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
          <button 
            type="submit" 
            disabled={loading || !query}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-3 rounded-full font-bold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
          >
            {loading ? 'Searching...' : 'Explore'}
          </button>
        </form>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-600 mb-4"></div>
          <p className="text-gray-500 font-serif italic">Unearthing ancient secrets...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-100 text-center mx-auto max-w-xl animate-fade-in">
          <p className="font-bold">{error}</p>
        </div>
      )}

      {result && !loading && (
        <div className="animate-slide-up">
           {/* Main Card */}
           <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-orange-100 mb-8">
              <div className="bg-gradient-to-r from-royalMaroon to-purple-900 p-8 md:p-12 text-white relative overflow-hidden">
                 <div className="absolute top-0 right-0 opacity-10 text-9xl transform translate-x-10 -translate-y-10">🏛️</div>
                 <h3 className="text-3xl md:text-5xl font-serif font-bold mb-4 relative z-10">{result.name}</h3>
                 <div className="flex flex-wrap gap-4 text-sm font-medium opacity-90 relative z-10">
                    {result.location && <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">📍 {result.location}</span>}
                    {result.year && <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">📅 {result.year}</span>}
                    {result.architecturalStyle && <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">🏗️ {result.architecturalStyle}</span>}
                 </div>
              </div>
              
              <div className="p-8 md:p-12">
                <p className="text-gray-700 text-lg leading-relaxed mb-8 font-light">{result.description}</p>
                
                {result.builtBy && (
                   <div className="flex items-center gap-4 mb-8 p-4 bg-orange-50 rounded-xl border border-orange-100">
                      <div className="bg-orange-200 p-2 rounded-lg">👑</div>
                      <div>
                        <span className="text-xs font-bold text-orange-800 uppercase tracking-wide block">Commissioned By</span>
                        <span className="font-serif font-bold text-gray-900 text-lg">{result.builtBy}</span>
                      </div>
                   </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                   {result.interestingFacts.map((fact, idx) => (
                      <div key={idx} className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow relative">
                         <span className="absolute -top-3 -left-2 bg-royalGold text-white text-xs font-bold px-2 py-1 rounded shadow-sm">Fact {idx + 1}</span>
                         <p className="text-gray-600 mt-2">{fact}</p>
                      </div>
                   ))}
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Explorer;