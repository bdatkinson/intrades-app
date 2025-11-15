"use client";

import { useEffect, useState } from "react";
import type { Badge } from "@/lib/api";

type BadgeAwardModalProps = {
  badge: Badge;
  isOpen: boolean;
  onClose: () => void;
  xpGained?: number;
};

const CATEGORY_ICONS: Record<string, string> = {
  foundation: "🎯",
  legal: "⚖️",
  finance: "💰",
  marketing: "📢",
  operations: "⚙️",
  hr: "👥",
  scaling: "📈",
  achievement: "🏆",
  social: "🤝",
};

export function BadgeAwardModal({ badge, isOpen, onClose, xpGained }: BadgeAwardModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      setShowConfetti(true);
      
      // Hide confetti after animation
      const confettiTimer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(confettiTimer);
    } else {
      setIsAnimating(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-md rounded-2xl bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-100 p-8 shadow-2xl transition-all duration-500 dark:from-yellow-900/30 dark:via-orange-900/30 dark:to-yellow-900/30 ${
          isAnimating ? "scale-100 opacity-100" : "scale-75 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Confetti Effect */}
        {showConfetti && (
          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute h-3 w-3 animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random()}s`,
                }}
              >
                <span className="text-2xl">
                  {["🎉", "⭐", "✨", "🎊", "🏆"][Math.floor(Math.random() * 5)]}
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

        {/* Badge Display */}
        <div className="flex flex-col items-center space-y-6">
          {/* Achievement Title */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              🎉 Achievement Unlocked! 🎉
            </h2>
          </div>

          {/* Badge Icon */}
          <div className="relative">
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 p-2 shadow-xl animate-bounce">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-white dark:bg-gray-800">
                <span className="text-6xl">{badge.icon}</span>
              </div>
            </div>
            
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full bg-yellow-400 opacity-50 blur-xl animate-pulse" />
          </div>

          {/* Badge Info */}
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {badge.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {badge.description}
            </p>
            
            <div className="flex items-center justify-center gap-4 pt-2">
              <div className="flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 dark:bg-blue-900/30">
                <span className="text-xl">{CATEGORY_ICONS[badge.category] || "⭐"}</span>
                <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                  {badge.category}
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-yellow-100 px-4 py-2 dark:bg-yellow-900/30">
                <span className="text-lg">⭐</span>
                <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-300">
                  {badge.xpRequired} XP
                </span>
              </div>
            </div>
          </div>

          {/* XP Gained (if provided) */}
          {xpGained && xpGained > 0 && (
            <div className="rounded-lg bg-green-100 px-6 py-3 dark:bg-green-900/30">
              <p className="text-center text-sm font-medium text-green-700 dark:text-green-300">
                <span className="text-lg font-bold">+{xpGained} XP</span> earned!
              </p>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={onClose}
            className="w-full rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:from-yellow-500 hover:to-orange-600 hover:shadow-xl"
          >
            Awesome!
          </button>
        </div>
      </div>
    </div>
  );
}

