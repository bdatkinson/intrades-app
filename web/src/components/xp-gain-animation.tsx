"use client";

import { useEffect, useState } from "react";

type XPGainAnimationProps = {
  xpGained: number;
  onComplete?: () => void;
  position?: "top" | "center" | "bottom";
};

export function XPGainAnimation({ 
  xpGained, 
  onComplete, 
  position = "center" 
}: XPGainAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [displayXP, setDisplayXP] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    // Animate XP number counting up
    const duration = 1500;
    const startTime = Date.now();
    const startXP = 0;
    const targetXP = xpGained;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const newXP = Math.floor(startXP + (targetXP - startXP) * easeProgress);
      
      setDisplayXP(newXP);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);

    // Hide after animation completes
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onComplete?.(), 300);
    }, 2000);

    return () => clearTimeout(hideTimer);
  }, [xpGained, onComplete]);

  const positionClasses = {
    top: "top-20",
    center: "top-1/2 -translate-y-1/2",
    bottom: "bottom-20",
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed left-1/2 z-50 -translate-x-1/2 ${positionClasses[position]} pointer-events-none`}
    >
      <div
        className={`flex flex-col items-center gap-2 rounded-2xl bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 p-6 shadow-2xl transition-all duration-300 ${
          isVisible ? "scale-100 opacity-100" : "scale-75 opacity-0"
        }`}
      >
        {/* XP Icon */}
        <div className="text-5xl animate-bounce">⭐</div>
        
        {/* XP Amount */}
        <div className="text-center">
          <div className="text-4xl font-bold text-white drop-shadow-lg">
            +{displayXP}
          </div>
          <div className="text-lg font-semibold text-white/90">XP Gained!</div>
        </div>

        {/* Confetti effect using CSS */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute h-2 w-2 rounded-full bg-yellow-300 animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${1 + Math.random()}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Hook for triggering XP gain animations
export function useXPGainAnimation() {
  const [animations, setAnimations] = useState<Array<{ id: number; xp: number }>>([]);

  const triggerAnimation = (xp: number) => {
    const id = Date.now();
    setAnimations((prev) => [...prev, { id, xp }]);
    
    // Auto-remove after animation completes
    setTimeout(() => {
      setAnimations((prev) => prev.filter((anim) => anim.id !== id));
    }, 2300);
  };

  const XPGainAnimations = () => (
    <>
      {animations.map((anim, index) => (
        <XPGainAnimation
          key={anim.id}
          xpGained={anim.xp}
          position={index % 3 === 0 ? "top" : index % 3 === 1 ? "center" : "bottom"}
        />
      ))}
    </>
  );

  return {
    animations,
    triggerAnimation,
    XPGainAnimations,
  };
}

