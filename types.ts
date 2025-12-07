export enum ViewState {
  HOME = 'HOME',
  EXPLORE = 'EXPLORE',
  IDENTIFY = 'IDENTIFY',
  QUIZ = 'QUIZ',
  LEADERBOARD = 'LEADERBOARD',
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string; // The correct option text
  explanation: string;
}

export interface QuizResult {
  score: number;
  total: number;
  date: string;
  mode: 'daily' | 'endless';
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  mode: 'daily' | 'endless';
  date: string;
}

export interface IdentificationResult {
  name: string;
  location: string;
  historicalSignificance: string;
  culturalFacts: string[];
}

export interface DailyFact {
  topic: string;
  fact: string;
}

export interface ExplorerResult {
  name: string;
  description: string;
  location: string;
  builtBy: string;
  year: string;
  architecturalStyle: string;
  interestingFacts: string[];
}