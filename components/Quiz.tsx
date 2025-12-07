import React, { useState, useEffect } from 'react';
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

  const nextQuestion = () => {
    setAnswerSubmitted(false);
    setSelectedAnswer(null);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setShowResult(true);
    // Save score to history/leaderboard
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

  // Canvas confetti instance
  const fireConfetti = () => {
    // handled by react-canvas-confetti component via props usually, but simple state trigger here works with effects if needed
    // or we just render the component conditionally
  };

  if (quizMode === 'menu') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-serif text-center font-bold text-gray-900 mb-4">Heritage Challenge</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Test your knowledge of India's vast culture. From the Chola temples to the spice markets of Kerala.
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* Daily Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-orange-100 hover:shadow-xl transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-9xl leading-none select-none">📅</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Daily Quiz</h3>
            <p className="text-gray-600 mb-6">A curated set of 5 questions generated fresh every day.</p>
            {isDailyDone ? (
               <button disabled className="w-full py-3 rounded-lg bg-gray-100 text-gray-400 font-medium cursor-not-allowed">
                 Completed for Today
               </button>
            ) : (
              <button 
                onClick={() => startQuiz('daily')}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium shadow-md hover:from-orange-600 hover:to-red-600 transition-all"
              >
                Start Daily Challenge
              </button>
            )}
          </div>

          {/* Endless Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 hover:shadow-xl transition-shadow relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-9xl leading-none select-none">∞</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Endless Mode</h3>
            <p className="text-gray-600 mb-6">Keep going as long as you can. Learn something new with every card.</p>
            <button 
              onClick={() => startQuiz('endless')}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all"
            >
              Play Endless
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-600 mb-4"></div>
        <p className="text-gray-600 font-medium animate-pulse">Consulting the archives...</p>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">Quiz Completed!</h2>
          <p className="text-gray-500 mb-8">You showed great knowledge today.</p>
          
          <div className="flex justify-center items-center gap-2 mb-8">
            <span className="text-5xl font-bold text-orange-600">{score}</span>
            <span className="text-2xl text-gray-400">/ {questions.length}</span>
          </div>

          <button 
            onClick={() => setQuizMode('menu')}
            className="px-8 py-3 rounded-full bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestionIndex];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {showConfetti && <Confetti fire={true} className="absolute inset-0 w-full h-full pointer-events-none" />}
      
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => setQuizMode('menu')} className="text-gray-500 hover:text-gray-900">
          &larr; Exit
        </button>
        <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
          Question {currentQuestionIndex + 1} / {questions.length}
        </span>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-gray-100">
        <h3 className="text-xl md:text-2xl font-serif font-bold text-gray-900 mb-8 leading-relaxed">
          {currentQ.question}
        </h3>

        <div className="grid gap-4">
          {currentQ.options.map((option, idx) => {
            let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 font-medium ";
            
            if (answerSubmitted) {
              if (option === currentQ.answer) {
                btnClass += "border-green-500 bg-green-50 text-green-700";
              } else if (option === selectedAnswer) {
                btnClass += "border-red-500 bg-red-50 text-red-700";
              } else {
                btnClass += "border-gray-100 bg-gray-50 text-gray-400";
              }
            } else {
              btnClass += "border-gray-200 hover:border-orange-300 hover:bg-orange-50 text-gray-700";
            }

            return (
              <button
                key={idx}
                onClick={() => handleAnswer(option)}
                disabled={answerSubmitted}
                className={btnClass}
              >
                {option}
              </button>
            );
          })}
        </div>

        {answerSubmitted && (
          <div className="mt-8 animate-fade-in">
            <div className={`p-4 rounded-lg ${selectedAnswer === currentQ.answer ? 'bg-green-50' : 'bg-orange-50'}`}>
              <h4 className="font-bold text-gray-900 mb-1">
                {selectedAnswer === currentQ.answer ? 'Correct! 👏' : 'Not quite.'}
              </h4>
              <p className="text-gray-700 text-sm leading-relaxed">{currentQ.explanation}</p>
            </div>
            <button 
              onClick={nextQuestion}
              className="mt-6 w-full py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;