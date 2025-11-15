// Application monitoring and error tracking

export type ErrorLevel = "error" | "warning" | "info";

export interface ErrorReport {
  message: string;
  level: ErrorLevel;
  stack?: string;
  context?: Record<string, any>;
  userId?: string;
  timestamp: string;
  url?: string;
  userAgent?: string;
}

class MonitoringService {
  private errors: ErrorReport[] = [];
  private maxErrors = 100;

  logError(
    error: Error | string,
    level: ErrorLevel = "error",
    context?: Record<string, any>
  ): void {
    const report: ErrorReport = {
      message: typeof error === "string" ? error : error.message,
      level,
      stack: error instanceof Error ? error.stack : undefined,
      context,
      timestamp: new Date().toISOString(),
      url: typeof window !== "undefined" ? window.location.href : undefined,
      userAgent: typeof window !== "undefined" ? window.navigator.userAgent : undefined,
    };

    this.errors.push(report);
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error(`[${level.toUpperCase()}]`, report);
    }

    // In production, send to error tracking service
    if (process.env.NODE_ENV === "production") {
      this.sendToErrorService(report);
    }
  }

  private sendToErrorService(report: ErrorReport): void {
    // Integrate with error tracking service (Sentry, LogRocket, etc.)
    // fetch('/api/errors', { method: 'POST', body: JSON.stringify(report) })
  }

  getErrors(): ErrorReport[] {
    return [...this.errors];
  }

  clearErrors(): void {
    this.errors = [];
  }

  // Performance monitoring
  measurePerformance(name: string, fn: () => void): void {
    if (typeof window !== "undefined" && window.performance) {
      const start = performance.now();
      fn();
      const duration = performance.now() - start;
      console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
    } else {
      fn();
    }
  }

  // User analytics
  trackEvent(eventName: string, properties?: Record<string, any>): void {
    if (process.env.NODE_ENV === "production") {
      // Send to analytics service
      // fetch('/api/analytics', { method: 'POST', body: JSON.stringify({ eventName, properties }) })
    } else {
      console.log(`[Analytics] ${eventName}`, properties);
    }
  }
}

export const monitoring = new MonitoringService();

// Global error handler
if (typeof window !== "undefined") {
  window.addEventListener("error", (event) => {
    monitoring.logError(event.error || event.message, "error", {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });

  window.addEventListener("unhandledrejection", (event) => {
    monitoring.logError(
      event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
      "error",
      { type: "unhandledRejection" }
    );
  });
}

