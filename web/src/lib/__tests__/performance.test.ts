import { describe, it, expect, beforeEach, vi } from "vitest";
import { PerformanceMonitor, debounce, throttle, memoize } from "../performance";

describe("PerformanceMonitor", () => {
  beforeEach(() => {
    PerformanceMonitor.clearMarks();
    PerformanceMonitor.clearMeasures();
  });

  it("marks performance points", () => {
    PerformanceMonitor.mark("test-mark");
    const metrics = PerformanceMonitor.getMetrics();
    expect(metrics.marks).toHaveProperty("test-mark");
  });

  it("measures performance between marks", () => {
    PerformanceMonitor.mark("start");
    // Simulate some work
    PerformanceMonitor.mark("end");
    const duration = PerformanceMonitor.measure("test-measure", "start", "end");
    expect(duration).toBeGreaterThanOrEqual(0);
  });
});

describe("debounce", () => {
  it("delays function execution", (done) => {
    let callCount = 0;
    const debouncedFn = debounce(() => {
      callCount++;
      expect(callCount).toBe(1);
      done();
    }, 100);

    debouncedFn();
    debouncedFn();
    debouncedFn();
  });

  it("cancels previous calls", (done) => {
    let callCount = 0;
    const debouncedFn = debounce(() => {
      callCount++;
    }, 100);

    debouncedFn();
    debouncedFn();
    debouncedFn();

    setTimeout(() => {
      expect(callCount).toBe(1);
      done();
    }, 200);
  });
});

describe("throttle", () => {
  it("limits function execution frequency", (done) => {
    let callCount = 0;
    const throttledFn = throttle(() => {
      callCount++;
    }, 100);

    throttledFn();
    throttledFn();
    throttledFn();

    setTimeout(() => {
      expect(callCount).toBe(1);
      done();
    }, 50);
  });
});

describe("memoize", () => {
  it("caches function results", () => {
    let callCount = 0;
    const expensiveFn = (x: number) => {
      callCount++;
      return x * 2;
    };

    const memoizedFn = memoize(expensiveFn);

    expect(memoizedFn(5)).toBe(10);
    expect(memoizedFn(5)).toBe(10);
    expect(callCount).toBe(1);
  });

  it("uses custom key function", () => {
    const fn = (a: number, b: number) => a + b;
    const keyFn = (a: number, b: number) => `${a}-${b}`;
    const memoizedFn = memoize(fn, keyFn);

    expect(memoizedFn(1, 2)).toBe(3);
    expect(memoizedFn(1, 2)).toBe(3);
  });
});

