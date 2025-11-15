"use client";

import { useEffect, useState } from "react";

type ChallengeStep = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  estimatedTime?: string;
};

type ChallengeProgressTrackerProps = {
  steps: ChallengeStep[];
  currentStep?: string;
  onStepComplete?: (stepId: string) => void;
  showTimeEstimates?: boolean;
  animated?: boolean;
};

export function ChallengeProgressTracker({
  steps,
  currentStep,
  onStepComplete,
  showTimeEstimates = true,
  animated = true,
}: ChallengeProgressTrackerProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(
    new Set(steps.filter(s => s.completed).map(s => s.id))
  );
  const [displayProgress, setDisplayProgress] = useState(animated ? 0 : calculateProgress());

  function calculateProgress(): number {
    const completed = steps.filter(s => completedSteps.has(s.id)).length;
    return steps.length > 0 ? Math.round((completed / steps.length) * 100) : 0;
  }

  useEffect(() => {
    if (!animated) {
      setDisplayProgress(calculateProgress());
      return;
    }

    const duration = 1000;
    const startTime = Date.now();
    const startProgress = displayProgress;
    const targetProgress = calculateProgress();

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const newProgress = Math.floor(startProgress + (targetProgress - startProgress) * easeProgress);
      
      setDisplayProgress(newProgress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    if (targetProgress !== startProgress) {
      requestAnimationFrame(animate);
    }
  }, [completedSteps, animated]);

  const handleStepClick = (step: ChallengeStep) => {
    if (step.completed) return;
    
    const newCompleted = new Set(completedSteps);
    newCompleted.add(step.id);
    setCompletedSteps(newCompleted);
    onStepComplete?.(step.id);
  };

  const totalEstimatedTime = steps
    .filter(s => s.estimatedTime)
    .reduce((total, step) => {
      const time = parseInt(step.estimatedTime?.replace(/\D/g, "") || "0");
      return total + time;
    }, 0);

  return (
    <div className="w-full space-y-6">
      {/* Progress Header */}
      <div className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Challenge Progress
          </h3>
          <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {displayProgress}%
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="relative h-4 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500 ease-out"
            style={{ width: `${displayProgress}%` }}
          >
            <div className="h-full w-full animate-pulse bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>
        </div>

        {showTimeEstimates && totalEstimatedTime > 0 && (
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Estimated time: ~{totalEstimatedTime} minutes
          </p>
        )}
      </div>

      {/* Steps List */}
      <div className="space-y-3">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.has(step.id);
          const isCurrent = currentStep === step.id;
          const isAccessible = index === 0 || completedSteps.has(steps[index - 1].id);

          return (
            <div
              key={step.id}
              className={`rounded-xl border-2 p-4 transition-all ${
                isCompleted
                  ? "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20"
                  : isCurrent
                  ? "border-blue-400 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20 shadow-md"
                  : isAccessible
                  ? "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600 cursor-pointer"
                  : "border-gray-200 bg-gray-50 opacity-60 dark:border-gray-700 dark:bg-gray-800/50"
              }`}
              onClick={() => isAccessible && !isCompleted && handleStepClick(step)}
            >
              <div className="flex items-start gap-4">
                {/* Step Number/Checkbox */}
                <div className="flex-shrink-0">
                  {isCompleted ? (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ) : (
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                      isCurrent
                        ? "border-blue-500 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                        : "border-gray-300 bg-gray-100 text-gray-500 dark:border-gray-600 dark:bg-gray-700"
                    }`}>
                      {index + 1}
                    </div>
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className={`font-semibold ${
                        isCompleted
                          ? "text-green-700 dark:text-green-300"
                          : isCurrent
                          ? "text-blue-700 dark:text-blue-300"
                          : "text-gray-900 dark:text-gray-100"
                      }`}>
                        {step.title}
                      </h4>
                      {step.description && (
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          {step.description}
                        </p>
                      )}
                    </div>
                    {step.estimatedTime && showTimeEstimates && (
                      <span className="ml-4 flex-shrink-0 text-xs text-gray-500 dark:text-gray-400">
                        {step.estimatedTime}
                      </span>
                    )}
                  </div>
                </div>

                {/* Status Indicator */}
                {isCurrent && !isCompleted && (
                  <div className="flex-shrink-0">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      Current
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Message */}
      {displayProgress === 100 && (
        <div className="rounded-xl border-2 border-green-400 bg-gradient-to-br from-green-50 to-emerald-50 p-6 text-center dark:border-green-600 dark:from-green-900/20 dark:to-emerald-900/20">
          <div className="text-5xl mb-2">🎉</div>
          <h3 className="text-xl font-bold text-green-700 dark:text-green-300">
            All Steps Complete!
          </h3>
          <p className="mt-2 text-sm text-green-600 dark:text-green-400">
            Great work! You've completed all the steps for this challenge.
          </p>
        </div>
      )}
    </div>
  );
}

