"use client";

import { useState, useEffect } from "react";
import { PWAInstallPrompt } from "@/lib/pwa-install";

export function PWAInstallButton() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    setIsInstalled(PWAInstallPrompt.isInstalled());
    setIsInstallable(PWAInstallPrompt.isInstallable());

    const unsubscribe = PWAInstallPrompt.onInstallableChange(() => {
      setIsInstallable(PWAInstallPrompt.isInstallable());
    });

    return unsubscribe;
  }, []);

  const handleInstall = async () => {
    const installed = await PWAInstallPrompt.promptInstall();
    if (installed) {
      setIsInstalled(true);
      setIsInstallable(false);
    }
  };

  if (isInstalled) {
    return null;
  }

  if (!isInstallable) {
    return null;
  }

  return (
    <button
      onClick={handleInstall}
      className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 font-semibold text-white transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-lg"
      aria-label="Install InTrades app"
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
      <span>Install App</span>
    </button>
  );
}

