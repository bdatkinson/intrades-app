// PWA Install prompt utilities

export class PWAInstallPrompt {
  private static deferredPrompt: any = null;
  private static listeners: Array<() => void> = [];

  static init() {
    if (typeof window === "undefined") return;

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.notifyListeners();
    });

    window.addEventListener("appinstalled", () => {
      this.deferredPrompt = null;
      this.notifyListeners();
    });
  }

  static isInstallable(): boolean {
    return this.deferredPrompt !== null;
  }

  static async promptInstall(): Promise<boolean> {
    if (!this.deferredPrompt) {
      return false;
    }

    try {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      this.deferredPrompt = null;
      return outcome === "accepted";
    } catch (error) {
      console.error("Error showing install prompt:", error);
      return false;
    }
  }

  static onInstallableChange(callback: () => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  private static notifyListeners() {
    this.listeners.forEach((callback) => callback());
  }

  static isInstalled(): boolean {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes("android-app://")
    );
  }
}

// Initialize on load
if (typeof window !== "undefined") {
  PWAInstallPrompt.init();
}

