// Accessibility utilities and helpers

/**
 * Focus management for accessibility
 */
export class FocusManager {
  static trapFocus(element: HTMLElement): () => void {
    const focusableElements = element.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    element.addEventListener("keydown", handleTab);
    firstElement?.focus();

    return () => {
      element.removeEventListener("keydown", handleTab);
    };
  }

  static restoreFocus(previousElement: HTMLElement | null): void {
    if (previousElement && typeof previousElement.focus === "function") {
      previousElement.focus();
    }
  }

  static saveFocus(): HTMLElement | null {
    return document.activeElement as HTMLElement;
  }
}

/**
 * ARIA helpers
 */
export const ARIA = {
  announce: (message: string, priority: "polite" | "assertive" = "polite"): void => {
    const announcement = document.createElement("div");
    announcement.setAttribute("role", "status");
    announcement.setAttribute("aria-live", priority);
    announcement.setAttribute("aria-atomic", "true");
    announcement.className = "sr-only";
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  },

  label: (id: string, label: string): void => {
    const element = document.getElementById(id);
    if (element) {
      element.setAttribute("aria-label", label);
    }
  },

  describe: (id: string, description: string): void => {
    const element = document.getElementById(id);
    if (element) {
      const descId = `${id}-description`;
      let descElement = document.getElementById(descId);
      
      if (!descElement) {
        descElement = document.createElement("div");
        descElement.id = descId;
        descElement.className = "sr-only";
        document.body.appendChild(descElement);
      }
      
      descElement.textContent = description;
      element.setAttribute("aria-describedby", descId);
    }
  },
};

/**
 * Keyboard navigation helpers
 */
export const Keyboard = {
  isEnter: (e: KeyboardEvent): boolean => e.key === "Enter" || e.keyCode === 13,
  isEscape: (e: KeyboardEvent): boolean => e.key === "Escape" || e.keyCode === 27,
  isSpace: (e: KeyboardEvent): boolean => e.key === " " || e.keyCode === 32,
  isArrowUp: (e: KeyboardEvent): boolean => e.key === "ArrowUp" || e.keyCode === 38,
  isArrowDown: (e: KeyboardEvent): boolean => e.key === "ArrowDown" || e.keyCode === 40,
  isArrowLeft: (e: KeyboardEvent): boolean => e.key === "ArrowLeft" || e.keyCode === 37,
  isArrowRight: (e: KeyboardEvent): boolean => e.key === "ArrowRight" || e.keyCode === 39,
  isTab: (e: KeyboardEvent): boolean => e.key === "Tab" || e.keyCode === 9,
};

/**
 * Screen reader utilities
 */
export const ScreenReader = {
  hide: (element: HTMLElement): void => {
    element.setAttribute("aria-hidden", "true");
  },

  show: (element: HTMLElement): void => {
    element.removeAttribute("aria-hidden");
  },

  only: (text: string): string => {
    return `<span class="sr-only">${text}</span>`;
  },
};

/**
 * Color contrast checker (basic)
 */
export function checkContrast(foreground: string, background: string): number {
  // Simplified contrast ratio calculation
  // In production, use a proper library like `color-contrast`
  const getLuminance = (color: string): number => {
    // Placeholder - implement proper RGB to luminance conversion
    return 0.5; // Simplified
  };

  const fgLum = getLuminance(foreground);
  const bgLum = getLuminance(background);
  
  const lighter = Math.max(fgLum, bgLum);
  const darker = Math.min(fgLum, bgLum);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Skip link helper
 */
export function createSkipLink(targetId: string, label: string = "Skip to main content"): HTMLElement {
  const link = document.createElement("a");
  link.href = `#${targetId}`;
  link.textContent = label;
  link.className = "sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-black";
  return link;
}

