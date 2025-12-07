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
    <div className="relative isolate overflow-hidden">
      {/* Background Image and Overlays */}
      <div className="absolute inset-0 -z-10">
        <img
            src="https://images.unsplash.com/photo-1598598965453-69022409f485?q=80&w=2070&auto=format&fit=crop"
            alt="Hawa Mahal"
            className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/50 to-stone-900/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-royalMaroon/30 to-transparent mix-blend-multiply" />
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        
        {/* Left Content */}
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8 animate-slide-up">
          <div className="mt-24 sm:mt-32 lg:mt-16">
            <div className="inline-flex items-center rounded-full bg-orange-400/10 px-3 py-1 text-sm font-medium text-orange-400 ring-1 ring-inset ring-orange-400/20 backdrop-blur-sm">
              ✨ Discover Incredible India
            </div>
          </div>
          <h1 className="mt-10 text-5xl font-extrabold tracking-tight text-white sm:text-7xl font-serif">
            Preserving <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron via-yellow-200 to-green-400">
              Our Dharohar
            </span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-200 font-light">
            Journey through the tapestry of India's rich cultural heritage. Identify ancient monuments with AI, challenge your history knowledge, and celebrate the stories that define us.
          </p>
          
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <button
              onClick={() => setView(ViewState.IDENTIFY)}
              className="rounded-full bg-gradient-to-r from-orange-600 to-red-700 px-6 py-3.5 text-sm font-semibold text-white shadow-lg hover:shadow-orange-500/30 hover:-translate-y-1 transition-all duration-300"
            >
              📷 AI Monument ID
            </button>
            <button
              onClick={() => setView(ViewState.QUIZ)}
              className="group text-sm font-semibold leading-6 text-white hover:text-orange-300 transition-colors flex items-center gap-2"
            >
              Take the Daily Quiz <span aria-hidden="true" className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </div>

        {/* Right Content - Daily Fact Card */}
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mt-0 lg:mr-0 lg:max-w-none lg:flex-none xl:ml-32 items-center justify-center">
          <div className="max-w-md flex-none sm:max-w-5xl lg:max-w-none w-full animate-float">
            <div className="rounded-2xl glass-card p-6 md:p-8 shadow-2xl relative overflow-hidden">
               {/* Decorative elements */}
               <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 rounded-full bg-orange-500/20 blur-xl"></div>
               <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full bg-green-500/20 blur-xl"></div>

               <h3 className="text-orange-600 font-serif font-bold text-xl mb-2 flex items-center gap-2">
                 <span>🕉️</span> {dailyFact ? dailyFact.topic : "Loading wisdom..."}
               </h3>
               <div className="h-px w-20 bg-gradient-to-r from-orange-500 to-transparent mb-4"></div>
               
               {dailyFact ? (
                 <p className="text-gray-800 text-lg leading-relaxed font-medium italic">
                   "{dailyFact.fact}"
                 </p>
               ) : (
                 <div className="space-y-3 animate-pulse">
                   <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                   <div className="h-4 bg-gray-200 rounded w-full"></div>
                   <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                 </div>
               )}
               
               <div className="mt-6 flex justify-end">
                 <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Daily Insight</span>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Hero;