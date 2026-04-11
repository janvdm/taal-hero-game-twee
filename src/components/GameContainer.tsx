import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { words, shuffleArray } from '../data/words';
import type { WordEntry } from '../data/words';
import StartScreen from './StartScreen';
import type { GameMode } from './StartScreen';
import QuestionCard from './QuestionCard';
import ResultScreen from './ResultScreen';

type GameState = 'start' | 'playing' | 'finished';

const STORAGE_KEY = 'taal-hero-game-twee-highscore';
const POINTS_CORRECT = 10;
const POINTS_WRONG = 5;
const STREAK_BONUS = 5;

function loadHighScore(): number {
  try {
    return parseInt(localStorage.getItem(STORAGE_KEY) ?? '0', 10) || 0;
  } catch {
    return 0;
  }
}

function saveHighScore(score: number) {
  try {
    localStorage.setItem(STORAGE_KEY, String(score));
  } catch { /* localStorage unavailable */ }
}

export default function GameContainer() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [mode, setMode] = useState<GameMode>('mix');
  const [questions, setQuestions] = useState<WordEntry[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState<WordEntry[]>([]);
  const [highScore, setHighScore] = useState(loadHighScore);
  const [startTime, setStartTime] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  const startGame = (selectedMode: GameMode) => {
    setMode(selectedMode);
    setQuestions(shuffleArray(words));
    setCurrentIndex(0);
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
    setStreak(0);
    setLongestStreak(0);
    setWrongAnswers([]);
    setStartTime(Date.now());
    setElapsedSeconds(0);
    setGameState('playing');

    stopTimer();
    timerRef.current = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - Date.now()) / 1000));
    }, 1000);
  };

  useEffect(() => {
    if (gameState === 'playing' && startTime > 0) {
      stopTimer();
      timerRef.current = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => stopTimer();
  }, [gameState, startTime, stopTimer]);

  const handleAnswer = (correct: boolean) => {
    if (correct) {
      const streakBonus = streak >= 2 ? STREAK_BONUS : 0;
      setScore(prev => prev + POINTS_CORRECT + streakBonus);
      setCorrectCount(prev => prev + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > longestStreak) {
        setLongestStreak(newStreak);
      }
    } else {
      setScore(prev => Math.max(0, prev - POINTS_WRONG));
      setWrongCount(prev => prev + 1);
      setStreak(0);
      setWrongAnswers(prev => [...prev, questions[currentIndex]]);
    }

    if (currentIndex + 1 >= questions.length) {
      stopTimer();
      setTimeout(() => {
        const finalScore = correct
          ? score + POINTS_CORRECT + (streak >= 2 ? STREAK_BONUS : 0)
          : Math.max(0, score - POINTS_WRONG);

        if (finalScore > highScore) {
          setHighScore(finalScore);
          saveHighScore(finalScore);
        }
        setGameState('finished');
      }, 1300);
    } else {
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 1300);
    }
  };

  const isNewHighScore = score > loadHighScore() || (gameState === 'finished' && score >= highScore && score > 0);

  return (
    <div className="min-h-dvh">
      <AnimatePresence mode="wait">
        {gameState === 'start' && (
          <motion.div
            key="start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <StartScreen onStart={startGame} highScore={highScore} />
          </motion.div>
        )}

        {gameState === 'playing' && questions.length > 0 && (
          <motion.div
            key={`playing-${currentIndex}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.25 }}
          >
            <QuestionCard
              currentWord={questions[currentIndex]}
              allWords={words}
              questionIndex={currentIndex}
              totalQuestions={questions.length}
              score={score}
              streak={streak}
              onAnswer={handleAnswer}
              mode={mode}
            />
          </motion.div>
        )}

        {gameState === 'finished' && (
          <motion.div
            key="finished"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ResultScreen
              score={score}
              correctCount={correctCount}
              wrongCount={wrongCount}
              totalQuestions={questions.length}
              longestStreak={longestStreak}
              timeSeconds={elapsedSeconds}
              isNewHighScore={isNewHighScore}
              wrongAnswers={wrongAnswers}
              onRestart={() => setGameState('start')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
