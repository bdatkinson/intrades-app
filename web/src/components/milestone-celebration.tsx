"use client";

import { useEffect, useState } from "react";

type MilestoneCelebrationProps = {
  isOpen: boolean;
  milestoneName: string;
  xpGained?: number;
  onClose: () => void;
};

export function MilestoneCelebration({
  isOpen,
  milestoneName,
  xpGained,
  onClose,
}: MilestoneCelebrationProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      setShowConfetti(true);
      
      // Hide confetti after animation
      const confettiTimer = setTimeout(() => setShowConfetti(false), 4000);
      
      // Auto-close after 5 seconds
      const closeTimer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(onClose, 300);
      }, 5000);

      return () => {
        clearTimeout(confettiTimer);
        clearTimeout(closeTimer);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-lg overflow-hidden rounded-3xl bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 p-8 shadow-2xl transition-all duration-500 dark:from-green-900/30 dark:via-emerald-900/30 dark:to-green-900/30 ${
          isAnimating ? "scale-100 opacity-100" : "scale-75 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Confetti Effect */}
        {showConfetti && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(100)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random() * 2}s`,
                }}
              >
                <span className="text-2xl">
                  {["🎉", "🎊", "✨", "⭐", "🏆", "🎈", "💫"][Math.floor(Math.random() * 7)]}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-white/80 p-2 text-gray-600 transition-colors hover:bg-white hover:text-gray-900 dark:bg-gray-800/80 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center space-y-6 text-center">
          {/* Celebration Icon */}
          <div className="relative">
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 p-2 shadow-xl animate-bounce">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-white dark:bg-gray-800">
                <span className="text-6xl">🎯</span>
              </div>
            </div>
            
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full bg-green-400 opacity-50 blur-xl animate-pulse" />
          </div>

          {/* Title */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              Milestone Achieved!
            </h2>
            <p className="mt-2 text-xl text-gray-700 dark:text-gray-300">
              {milestoneName}
            </p>
          </div>

          {/* XP Gained */}
          {xpGained && xpGained > 0 && (
            <div className="rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 px-8 py-4 shadow-lg">
              <p className="text-sm font-medium text-white">XP Earned</p>
              <p className="text-3xl font-bold text-white">+{xpGained}</p>
            </div>
          )}

          {/* Message */}
          <div className="rounded-lg bg-white/50 px-6 py-4 dark:bg-gray-800/50">
            <p className="text-gray-700 dark:text-gray-300">
              You're making amazing progress! Keep up the great work on your business journey.
            </p>
          </div>

          {/* Action Button */}
          <button
            onClick={onClose}
            className="w-full rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:from-green-600 hover:to-emerald-700 hover:shadow-xl"
          >
            Continue Journey
          </button>
        </div>
      </div>
    </div>
  );
}

