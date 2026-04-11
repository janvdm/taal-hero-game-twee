import { motion } from 'framer-motion';
import { BookOpen, Shuffle, ArrowRight } from 'lucide-react';
import { JOKES, pickRandom } from '../data/words';
import { useState } from 'react';
import { playClickSound } from '../utils/sounds';

export type GameMode = 'word-to-meaning' | 'meaning-to-word' | 'mix';

interface StartScreenProps {
  onStart: (mode: GameMode) => void;
  highScore: number;
}

export default function StartScreen({ onStart, highScore }: StartScreenProps) {
  const [selectedMode, setSelectedMode] = useState<GameMode>('mix');
  const [joke] = useState(() => pickRandom(JOKES));

  const modes: { value: GameMode; label: string; emoji: string; description: string }[] = [
    { value: 'word-to-meaning', label: 'Woord → Betekenis', emoji: '🎯', description: 'Ken jij de betekenis?' },
    { value: 'meaning-to-word', label: 'Betekenis → Woord', emoji: '🔄', description: 'Ken jij het woord?' },
    { value: 'mix', label: 'Mix (beide!)', emoji: '🎲', description: 'De ultieme uitdaging!' },
  ];

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-4 py-6">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', duration: 0.8 }}
        className="text-7xl mb-2"
      >
        🦸
      </motion.div>

      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-4xl font-black text-white text-center mb-1"
        style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.3)' }}
      >
        TAAL HERO
      </motion.h1>

      <motion.p
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="text-white/70 text-sm mb-4"
      >
        ✨ Woorden 1+2 — angst & griezelen ✨
      </motion.p>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-5 max-w-sm w-full"
      >
        <p className="text-white text-center text-sm whitespace-pre-line leading-relaxed">
          {joke}
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-sm space-y-2 mb-5"
      >
        <p className="text-white/80 text-xs font-semibold uppercase tracking-wider text-center mb-2">
          Kies je modus
        </p>
        {modes.map((mode) => (
          <button
            key={mode.value}
            onClick={() => {
              playClickSound();
              setSelectedMode(mode.value);
            }}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
              selectedMode === mode.value
                ? 'bg-white text-purple-700 shadow-lg scale-[1.02]'
                : 'bg-white/15 text-white hover:bg-white/25'
            }`}
          >
            <span className="text-2xl">{mode.emoji}</span>
            <div className="text-left flex-1">
              <p className="font-bold text-sm">{mode.label}</p>
              <p className={`text-xs ${selectedMode === mode.value ? 'text-purple-500' : 'text-white/60'}`}>
                {mode.description}
              </p>
            </div>
            {selectedMode === mode.value && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <ArrowRight size={20} />
              </motion.div>
            )}
          </button>
        ))}
      </motion.div>

      <motion.button
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, type: 'spring' }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          playClickSound();
          onStart(selectedMode);
        }}
        className="w-full max-w-sm bg-gradient-to-r from-green-400 to-emerald-500 text-white font-black text-xl py-4 rounded-2xl shadow-lg shadow-green-500/30 flex items-center justify-center gap-2"
      >
        <BookOpen size={24} />
        LET'S GO! 🚀
      </motion.button>

      {highScore > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-white/60 text-sm mt-3"
        >
          🏆 Highscore: {highScore} punten
        </motion.p>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex gap-2 mt-4"
      >
        {['📚', '✏️', '🧠', '💡', '🎓'].map((emoji, i) => (
          <motion.span
            key={i}
            className="text-2xl"
            animate={{ y: [0, -8, 0] }}
            transition={{ delay: 1.2 + i * 0.15, duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
          >
            {emoji}
          </motion.span>
        ))}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-white/40 text-xs mt-4"
      >
        <Shuffle size={12} className="inline mr-1" />
        44 woorden &amp; uitdrukkingen
      </motion.p>
    </div>
  );
}
