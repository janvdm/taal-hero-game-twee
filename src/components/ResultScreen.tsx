import { motion } from 'framer-motion';
import { RotateCcw, List } from 'lucide-react';
import type { WordEntry } from '../data/words';
import { playClickSound, playVictorySound } from '../utils/sounds';
import { useEffect, useState } from 'react';

interface ResultScreenProps {
  score: number;
  correctCount: number;
  wrongCount: number;
  totalQuestions: number;
  longestStreak: number;
  timeSeconds: number;
  isNewHighScore: boolean;
  wrongAnswers: WordEntry[];
  onRestart: () => void;
}

function getGradeInfo(correctCount: number, wrongCount: number, totalQuestions: number) {
  const baseScore = (correctCount / totalQuestions) * 10;
  const penalty = Math.min(wrongCount * 0.2, 2);
  const grade = Math.max(1, Math.min(10, Math.round((baseScore - penalty) * 10) / 10));

  let label: string;
  let emoji: string;
  let color: string;
  if (grade >= 8.5) {
    label = 'Uitstekend!';
    emoji = '🏆🥳';
    color = 'text-emerald-400';
  } else if (grade >= 7.5) {
    label = 'Goed!';
    emoji = '🎉';
    color = 'text-green-400';
  } else if (grade >= 6.5) {
    label = 'Voldoende!';
    emoji = '👍';
    color = 'text-yellow-400';
  } else if (grade >= 5.5) {
    label = 'Matig';
    emoji = '😊';
    color = 'text-orange-400';
  } else {
    label = 'Oefenen!';
    emoji = '💪📚';
    color = 'text-red-400';
  }

  return { grade, label, emoji, color };
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function ResultScreen({
  score,
  correctCount,
  wrongCount,
  totalQuestions,
  longestStreak,
  timeSeconds,
  isNewHighScore,
  wrongAnswers,
  onRestart,
}: ResultScreenProps) {
  const [showWrongAnswers, setShowWrongAnswers] = useState(false);
  const { grade, label, emoji, color } = getGradeInfo(correctCount, wrongCount, totalQuestions);
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  useEffect(() => {
    if (grade >= 6.5) {
      playVictorySound();
    }
  }, [grade]);

  // Confetti particles
  const confettiColors = ['🟣', '🔵', '🟢', '🟡', '🟠', '🔴', '⭐', '✨', '🎉', '🎊'];

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-4 py-6 relative overflow-hidden">
      {/* Confetti */}
      {grade >= 6.5 && confettiColors.map((c, i) => (
        <motion.span
          key={i}
          className="absolute text-2xl pointer-events-none"
          initial={{
            x: Math.random() * 400 - 200,
            y: -100,
            rotate: 0,
            opacity: 1,
          }}
          animate={{
            y: window.innerHeight + 100,
            rotate: 720,
            opacity: 0,
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: Math.random() * 1.5,
            ease: 'easeIn',
          }}
          style={{ left: `${10 + Math.random() * 80}%` }}
        >
          {c}
        </motion.span>
      ))}

      {/* Score */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.2 }}
        className="text-center mb-4"
      >
        <p className="text-white/60 text-sm font-semibold uppercase tracking-wider">🏆 Score 🏆</p>
        <motion.p
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.4, stiffness: 200 }}
          className="text-7xl font-black text-white"
          style={{ textShadow: '0 0 30px rgba(255,255,255,0.3)' }}
        >
          {score}
        </motion.p>
        {isNewHighScore && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-yellow-300 font-bold text-sm mt-1"
          >
            🎉 Nieuw record! 🎉
          </motion.p>
        )}
      </motion.div>

      {/* Grade circle */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', delay: 0.6 }}
        className={`w-28 h-28 rounded-full border-4 ${
          grade >= 5.5 ? 'border-green-400' : 'border-red-400'
        } flex flex-col items-center justify-center bg-white/10 backdrop-blur-sm mb-4`}
      >
        <span className={`text-3xl font-black ${color}`}>{grade}</span>
        <span className="text-white text-xs">{label} {emoji}</span>
      </motion.div>

      {/* Stats card */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 w-full max-w-sm mb-4"
      >
        <p className="text-white font-bold text-sm mb-3 text-center">📊 Statistieken</p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-white/70">✅ Goed</span>
            <span className="text-white font-bold">{correctCount}/{totalQuestions} ({percentage}%)</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/70">❌ Fout</span>
            <span className="text-white font-bold">{wrongCount}/{totalQuestions}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/70">🔥 Langste streak</span>
            <span className="text-white font-bold">{longestStreak}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/70">⏱️ Tijd</span>
            <span className="text-white font-bold">{formatTime(timeSeconds)}</span>
          </div>
        </div>
      </motion.div>

      {/* Wrong answers review */}
      {wrongAnswers.length > 0 && (
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="w-full max-w-sm mb-4"
        >
          <button
            onClick={() => {
              playClickSound();
              setShowWrongAnswers(!showWrongAnswers);
            }}
            className="w-full bg-white/10 text-white font-semibold text-sm py-3 rounded-xl flex items-center justify-center gap-2"
          >
            <List size={16} />
            {showWrongAnswers ? 'Verberg fouten' : `Bekijk fouten (${wrongAnswers.length})`}
          </button>

          {showWrongAnswers && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mt-2 space-y-2 max-h-60 overflow-y-auto"
            >
              {wrongAnswers.map((word) => (
                <div key={word.id} className="bg-white/10 rounded-xl p-3">
                  <p className="text-white font-bold text-sm">{word.word}</p>
                  <p className="text-white/70 text-xs">{word.meaning}</p>
                  {word.example && (
                    <p className="text-white/50 text-xs italic mt-1">"{word.example}"</p>
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Restart button */}
      <motion.button
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          playClickSound();
          onRestart();
        }}
        className="w-full max-w-sm bg-gradient-to-r from-green-400 to-emerald-500 text-white font-black text-lg py-4 rounded-2xl shadow-lg shadow-green-500/30 flex items-center justify-center gap-2"
      >
        <RotateCcw size={20} />
        OPNIEUW SPELEN 🚀
      </motion.button>
    </div>
  );
}
