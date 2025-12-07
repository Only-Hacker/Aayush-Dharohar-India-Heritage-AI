import React from 'react';
import { ViewState } from '../types';

interface HeroProps {
  setView: (view: ViewState) => void;
}

const Hero: React.FC<HeroProps> = ({ setView }) => {
  return (
    <div className="relative isolate overflow-hidden">
      {/* Background with gradient and pattern */}
      <div className="absolute inset-0 -z-10 bg-deepPurple">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/40 via-purple-900/40 to-green-900/40 mix-blend-multiply" />
        <img
            src="https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=2088&auto=format&fit=crop"
            alt="Taj Mahal"
            className="absolute inset-0 -z-20 h-full w-full object-cover opacity-30"
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
          <div className="mt-24 sm:mt-32 lg:mt-16">
            <a href="#" className="inline-flex space-x-6">
              <span className="rounded-full bg-orange-600/10 px-3 py-1 text-sm font-semibold leading-6 text-orange-400 ring-1 ring-inset ring-orange-600/20">
                New
              </span>
              <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-300">
                <span>Daily Heritage Quiz Available</span>
              </span>
            </a>
          </div>
          <h1 className="mt-10 text-4xl font-bold tracking-tight text-white sm:text-6xl font-serif">
            Rediscover <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-yellow-200 to-green-400">
              India's Timeless Heritage
            </span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Immerse yourself in the colors, history, and stories of India. Use AI to identify ancient monuments, test your knowledge with daily quizzes, and compete on the national leaderboard.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <button
              onClick={() => setView(ViewState.IDENTIFY)}
              className="rounded-md bg-orange-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 transition-all transform hover:scale-105"
            >
              Identify Monuments <span aria-hidden="true">→</span>
            </button>
            <button
              onClick={() => setView(ViewState.QUIZ)}
              className="text-sm font-semibold leading-6 text-white hover:text-orange-300 transition-colors"
            >
              Take the Quiz <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mt-0 lg:mr-0 lg:max-w-none lg:flex-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <div className="-m-2 rounded-xl bg-white/5 p-2 ring-1 ring-inset ring-white/10 lg:-m-4 lg:rounded-2xl lg:p-4 backdrop-blur-sm">
              <img
                src="https://images.unsplash.com/photo-1598598965453-69022409f485?q=80&w=2070&auto=format&fit=crop"
                alt="Hawa Mahal"
                className="w-[76rem] rounded-md shadow-2xl ring-1 ring-gray-900/10"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;