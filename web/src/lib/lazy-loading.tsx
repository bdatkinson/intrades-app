"use client";

import { lazy, Suspense, ComponentType } from "react";

// Loading component for lazy loaded routes
export function LoadingFallback({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
        <p className="text-gray-600 dark:text-gray-400">{message}</p>
      </div>
    </div>
  );
}

// Error boundary component for lazy loaded routes
export function LazyErrorBoundary({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

// Helper to create lazy loaded components with error boundaries
export function createLazyComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = lazy(importFunc);

  const Wrapped = (props: React.ComponentProps<T>) => (
    <Suspense fallback={fallback || <LoadingFallback />}>
      <LazyErrorBoundary>
        <LazyComponent {...props} />
      </LazyErrorBoundary>
    </Suspense>
  );
  Wrapped.displayName = "LazyLoaded";
  return Wrapped;
}

// Preload helper for critical routes
export function preloadRoute(importFunc: () => Promise<any>) {
  if (typeof window !== "undefined") {
    importFunc();
  }
}

