import React, { useEffect, useState } from 'react';
import { ViewState, DailyFact } from '../types';
import { getDailyFact } from '../services/gemini';

interface HeroProps {
  setView: (view: ViewState) => void;
}

const Hero: React.FC<HeroProps> = ({ setView }) => {
  const [dailyFact, setDailyFact] = useState<DailyFact | null>(null);

  useEffect(() => {
    const fetchFact = async () => {
      const fact = await getDailyFact();
      setDailyFact(fact);
    };
    fetchFact();
  }, []);

  return (
    <div className="relative isolate overflow-hidden min-h-[calc(100vh-80px)]">
      {/* Background Image and Overlays */}
      <div className="absolute inset-0 -z-10">
        <img
            src="https://images.unsplash.com/photo-1598598965453-69022409f485?q=80&w=2070&auto=format&fit=crop"
            alt="Hawa Mahal"
            className="h-full w-full object-cover object-center scale-105 animate-pulse-slow" 
            style={{ animationDuration: '20s' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/50 to-stone-900/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-royalMaroon/40 to-transparent mix-blend-multiply" />
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40 items-center">
        
        {/* Left Content */}
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8 animate-slide-up">
          <div className="mt-12 sm:mt-24 lg:mt-0">
            <div className="inline-flex items-center rounded-full bg-orange-400/20 px-4 py-1.5 text-sm font-medium text-orange-200 ring-1 ring-inset ring-orange-400/30 backdrop-blur-md mb-6">
              ✨ Discover Incredible India
            </div>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl font-serif leading-tight">
            Preserving <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron via-yellow-200 to-green-400">
              Our Dharohar
            </span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-200 font-light max-w-lg">
            Immerse yourself in the tapestry of India's heritage. Use AI to identify monuments, explore history, and challenge your knowledge.
          </p>
          
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button
              onClick={() => setView(ViewState.IDENTIFY)}
              className="rounded-full bg-gradient-to-r from-orange-600 to-red-700 px-8 py-4 text-sm font-bold text-white shadow-lg hover:shadow-orange-500/40 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
            >
              <span>📷</span> Identify Monument
            </button>
            <button
              onClick={() => setView(ViewState.EXPLORE)}
              className="rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-8 py-4 text-sm font-bold text-white hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
            >
               <span>🔍</span> Search History
            </button>
          </div>
        </div>

        {/* Right Content - Daily Fact Card */}
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mt-0 lg:mr-0 lg:max-w-none lg:flex-none xl:ml-32 items-center justify-center">
          <div className="max-w-md flex-none sm:max-w-5xl lg:max-w-none w-full animate-float">
            <div className="rounded-3xl glass-card p-8 md:p-10 shadow-2xl relative overflow-hidden border-t border-white/40">
               {/* Decorative elements */}
               <div className="absolute top-0 right-0 -mr-12 -mt-12 w-32 h-32 rounded-full bg-orange-500/30 blur-2xl"></div>
               <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-32 h-32 rounded-full bg-green-500/30 blur-2xl"></div>

               <h3 className="text-orange-700 font-serif font-bold text-2xl mb-3 flex items-center gap-3">
                 <span>🕉️</span> {dailyFact ? dailyFact.topic : "Loading wisdom..."}
               </h3>
               <div className="h-1 w-20 bg-gradient-to-r from-orange-500 to-transparent mb-6 rounded-full"></div>
               
               {dailyFact ? (
                 <p className="text-gray-900 text-xl leading-relaxed font-medium font-serif italic">
                   "{dailyFact.fact}"
                 </p>
               ) : (
                 <div className="space-y-4 animate-pulse">
                   <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                   <div className="h-4 bg-gray-300 rounded w-full"></div>
                   <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                 </div>
               )}
               
               <div className="mt-8 flex justify-between items-center border-t border-gray-200/50 pt-4">
                 <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Daily Insight</span>
                 <button onClick={() => setView(ViewState.QUIZ)} className="text-sm font-bold text-royalMaroon hover:text-orange-600 transition-colors">
                    Test your knowledge &rarr;
                 </button>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Hero;