// Performance monitoring and optimization utilities

export class PerformanceMonitor {
  private static marks: Map<string, number> = new Map();
  private static measures: Map<string, number> = new Map();

  static mark(name: string): void {
    if (typeof window !== "undefined" && window.performance) {
      this.marks.set(name, performance.now());
      performance.mark(name);
    }
  }

  static measure(name: string, startMark: string, endMark?: string): number | null {
    if (typeof window !== "undefined" && window.performance) {
      try {
        if (endMark) {
          performance.measure(name, startMark, endMark);
        } else {
          performance.measure(name, startMark);
        }
        const measure = performance.getEntriesByName(name, "measure")[0];
        const duration = measure?.duration || null;
        this.measures.set(name, duration || 0);
        return duration;
      } catch (e) {
        console.warn(`Performance measure failed: ${name}`, e);
        return null;
      }
    }
    return null;
  }

  static getMeasure(name: string): number | null {
    return this.measures.get(name) || null;
  }

  static clearMarks(): void {
    if (typeof window !== "undefined" && window.performance) {
      this.marks.clear();
      performance.clearMarks();
    }
  }

  static clearMeasures(): void {
    if (typeof window !== "undefined" && window.performance) {
      this.measures.clear();
      performance.clearMeasures();
    }
  }

  static getMetrics(): {
    marks: Record<string, number>;
    measures: Record<string, number>;
  } {
    return {
      marks: Object.fromEntries(this.marks),
      measures: Object.fromEntries(this.measures),
    };
  }
}

// Image optimization helper
export function optimizeImageUrl(
  url: string,
  width?: number,
  quality: number = 80
): string {
  // If using Next.js Image component, it handles optimization automatically
  // This is a placeholder for custom optimization logic
  if (width) {
    return `${url}?w=${width}&q=${quality}`;
  }
  return url;
}

// Debounce utility for performance
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

// Throttle utility for performance
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Memoization helper
export function memoize<Args extends any[], Return>(
  fn: (...args: Args) => Return,
  keyFn?: (...args: Args) => string
): (...args: Args) => Return {
  const cache = new Map<string, Return>();
  
  return (...args: Args): Return => {
    const key = keyFn ? keyFn(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

// Bundle size analyzer helper (for development)
export function logBundleSize(componentName: string, size: number): void {
  if (process.env.NODE_ENV === "development") {
    console.log(`[Bundle Size] ${componentName}: ${(size / 1024).toFixed(2)} KB`);
  }
}

