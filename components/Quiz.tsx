import React, { useState } from 'react';
import { generateQuizQuestions } from '../services/gemini';
import { QuizQuestion } from '../types';
import Confetti from 'react-canvas-confetti';

const Quiz: React.FC = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quizMode, setQuizMode] = useState<'menu' | 'daily' | 'endless'>('menu');
  const [showConfetti, setShowConfetti] = useState(false);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);

  // Check if daily quiz is already done
  const isDailyDone = localStorage.getItem(`daily_quiz_${new Date().toISOString().split('T')[0]}`);

  const startQuiz = async (mode: 'daily' | 'endless') => {
    setLoading(true);
    setQuizMode(mode);
    setScore(0);
    setCurrentQuestionIndex(0);
    setShowResult(false);
    setQuestions([]);

    const q = await generateQuizQuestions(5, mode);
    setQuestions(q);
    setLoading(false);
  };

  const handleAnswer = (option: string) => {
    if (answerSubmitted) return;
    
    setSelectedAnswer(option);
    setAnswerSubmitted(true);
    
    const isCorrect = option === questions[currentQuestionIndex].answer;
    if (isCorrect) {
      setScore(s => s + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
  };

  const nextQuestion = async () => {
    setAnswerSubmitted(false);
    setSelectedAnswer(null);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
    } else {
      if (quizMode === 'endless') {
          // Generate more questions in background? 
          // For simplicity in this demo, we'll finish the session or loop. 
          // Let's implement true endless by fetching more.
          setLoading(true);
          const newQ = await generateQuizQuestions(3, 'endless');
          setQuestions(prev => [...prev, ...newQ]);
          setCurrentQuestionIndex(i => i + 1);
          setLoading(false);
      } else {
        finishQuiz();
      }
    }
  };

  const finishQuiz = () => {
    setShowResult(true);
    const history = JSON.parse(localStorage.getItem('quiz_history') || '[]');
    history.push({
      date: new Date().toISOString(),
      score,
      total: questions.length,
      mode: quizMode
    });
    localStorage.setItem('quiz_history', JSON.stringify(history));

    if (quizMode === 'daily') {
      localStorage.setItem(`daily_quiz_${new Date().toISOString().split('T')[0]}`, 'true');
    }
  };

  if (quizMode === 'menu') {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
           <h2 className="text-4xl md:text-5xl font-serif font-bold text-royalMaroon mb-4">The Heritage Challenge</h2>
           <p className="text-gray-600 max-w-2xl mx-auto text-lg">
             Test your wisdom of the ancient world. From the ghats of Varanasi to the forts of Rajasthan.
           </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Daily Card */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-orange-100 hover:shadow-2xl transition-all duration-300 relative overflow-hidden group hover:-translate-y-1">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity text-9xl leading-none select-none text-orange-600">📅</div>
            <div className="relative z-10">
              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">Fresh Daily</span>
              <h3 className="text-3xl font-serif font-bold text-gray-900 mb-2">Daily Quiz</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">A curated set of 5 diverse questions generated fresh every day to keep your knowledge sharp.</p>
              {isDailyDone ? (
                 <button disabled className="w-full py-4 rounded-xl bg-gray-100 text-gray-400 font-medium cursor-not-allowed border border-gray-200">
                   ✅ Completed Today
                 </button>
              ) : (
                <button 
                  onClick={() => startQuiz('daily')}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold shadow-lg shadow-orange-200 hover:shadow-orange-300 transition-all"
                >
                  Start Daily Challenge
                </button>
              )}
            </div>
          </div>

          {/* Endless Card */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-blue-100 hover:shadow-2xl transition-all duration-300 relative overflow-hidden group hover:-translate-y-1">
             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity text-9xl leading-none select-none text-blue-600">∞</div>
             <div className="relative z-10">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">Survival Mode</span>
                <h3 className="text-3xl font-serif font-bold text-gray-900 mb-2">Endless Journey</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">How far can you go? Questions keep coming as long as you keep answering. Perfect for deep learning.</p>
                <button 
                  onClick={() => startQuiz('endless')}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all"
                >
                  Begin Endless Journey
                </button>
             </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-orange-600 mb-4"></div>
          <div className="absolute inset-0 flex items-center justify-center text-2xl">🕉️</div>
        </div>
        <p className="text-gray-600 font-medium animate-pulse mt-4 text-lg">Consulting the ancient archives...</p>
      </div>
    );
  }

  if (showResult) {
    const percentage = (score / questions.length) * 100;
    let title = "Explorer";
    if (percentage > 90) title = "Historian";
    else if (percentage > 70) title = "Scholar";
    else if (percentage > 50) title = "Student";

    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        {showConfetti && (
          <Confetti
            className="absolute inset-0 w-full h-full pointer-events-none"
            onInit={({ confetti }) =>
              confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
              })
            }
          />
        )}
        <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100 animate-slide-up">
          <div className="text-6xl mb-6">{percentage > 70 ? '🏆' : '📚'}</div>
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-2">Quiz Completed!</h2>
          <div className="inline-block px-4 py-1 rounded-full bg-orange-100 text-orange-800 font-medium text-sm mb-6">Rank: {title}</div>
          
          <div className="flex justify-center items-center gap-4 mb-10">
            <div className="text-center">
              <div className="text-5xl font-bold text-orange-600">{score}</div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">Correct</div>
            </div>
            <div className="h-12 w-px bg-gray-200"></div>
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-300">{questions.length}</div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">Total</div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => setQuizMode('menu')}
              className="px-8 py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
            >
              Back to Menu
            </button>
            <button 
              onClick={() => startQuiz(quizMode)}
              className="px-8 py-3 rounded-xl border-2 border-orange-500 text-orange-600 font-medium hover:bg-orange-50 transition-colors"
            >
              Play Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestionIndex];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {showConfetti && (
        <Confetti
          className="absolute inset-0 w-full h-full pointer-events-none"
          onInit={({ confetti }) =>
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
            })
          }
        />
      )}
      
      <div className="flex justify-between items-center mb-8">
        <button onClick={() => setQuizMode('menu')} className="text-gray-400 hover:text-gray-900 font-medium transition-colors flex items-center gap-2">
          &larr; Exit
        </button>
        <div className="flex items-center gap-3">
             <div className="text-right">
                <div className="text-xs text-gray-400 uppercase font-bold">Question</div>
                <div className="text-lg font-bold text-gray-900">{currentQuestionIndex + 1} <span className="text-gray-400 text-sm">/ {quizMode === 'endless' ? '∞' : questions.length}</span></div>
             </div>
             <div className="text-right ml-4">
                <div className="text-xs text-gray-400 uppercase font-bold">Score</div>
                <div className="text-lg font-bold text-orange-600">{score}</div>
             </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 border border-gray-100 relative overflow-hidden min-h-[400px] flex flex-col justify-center">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-100">
            <div 
                className="h-full bg-orange-500 transition-all duration-500" 
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
        </div>

        <h3 className="text-xl md:text-3xl font-serif font-bold text-gray-900 mb-8 leading-relaxed">
          {currentQ.question}
        </h3>

        <div className="grid gap-4">
          {currentQ.options.map((option, idx) => {
            let btnClass = "w-full text-left p-5 rounded-xl border-2 transition-all duration-200 font-medium text-lg relative ";
            
            if (answerSubmitted) {
              if (option === currentQ.answer) {
                btnClass += "border-green-500 bg-green-50 text-green-800 shadow-sm";
              } else if (option === selectedAnswer) {
                btnClass += "border-red-500 bg-red-50 text-red-800 shadow-sm";
              } else {
                btnClass += "border-gray-100 bg-gray-50 text-gray-400 opacity-50";
              }
            } else {
              btnClass += "border-gray-100 hover:border-orange-300 hover:bg-orange-50 text-gray-700 shadow-sm hover:shadow-md hover:-translate-y-0.5";
            }

            return (
              <button
                key={idx}
                onClick={() => handleAnswer(option)}
                disabled={answerSubmitted}
                className={btnClass}
              >
                <div className="flex justify-between items-center">
                   <span>{option}</span>
                   {answerSubmitted && option === currentQ.answer && <span>✅</span>}
                   {answerSubmitted && option === selectedAnswer && option !== currentQ.answer && <span>❌</span>}
                </div>
              </button>
            );
          })}
        </div>

        {answerSubmitted && (
          <div className="mt-8 animate-fade-in bg-stone-50 p-6 rounded-2xl border border-stone-100">
            <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              {selectedAnswer === currentQ.answer ? <span className="text-green-600">Correct! 👏</span> : <span className="text-red-600">Incorrect</span>}
            </h4>
            <p className="text-gray-700 leading-relaxed mb-4">{currentQ.explanation}</p>
            <button 
              onClick={nextQuestion}
              className="w-full py-3 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-800 transition-colors shadow-lg"
            >
              {currentQuestionIndex === questions.length - 1 && quizMode !== 'endless' ? 'View Results' : 'Next Question →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;