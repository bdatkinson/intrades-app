"use client";

import { useQueryClient } from "@tanstack/react-query";
import type { Challenge, UserProgression, Badge, ChallengeSubmission } from "./api";

/**
 * Optimistic update utilities for React Query
 * These functions update the cache immediately before the API call completes
 */

export function useOptimisticUpdates() {
  const queryClient = useQueryClient();

  const updateProgressionOptimistically = (userId: string, xpGain: number) => {
    queryClient.setQueryData<UserProgression>(["progression", userId], (old) => {
      if (!old) return old;
      return {
        ...old,
        xp: old.xp + xpGain,
        // Recalculate level if needed
        level: Math.floor((old.xp + xpGain) / 100) + 1,
      };
    });
  };

  const updateChallengeSubmission = (challengeId: string, submission: Partial<ChallengeSubmission>) => {
    queryClient.setQueryData<ChallengeSubmission[]>(["submissions", challengeId], (old) => {
      if (!old) return old;
      const existingIndex = old.findIndex((s) => s.id === submission.id);
      if (existingIndex >= 0) {
        const updated = [...old];
        updated[existingIndex] = { ...updated[existingIndex], ...submission };
        return updated;
      }
      return old;
    });
  };

  const addBadgeOptimistically = (userId: string, badge: Badge) => {
    queryClient.setQueryData<Badge[]>(["userBadges", userId], (old) => {
      if (!old) return old;
      if (old.some((b) => b.id === badge.id)) return old;
      return [...old, badge];
    });
  };

  const updateChallengeOptimistically = (challenge: Partial<Challenge> & { id: string }) => {
    queryClient.setQueryData<Challenge>(["challenge", challenge.id], (old) => {
      if (!old) return old;
      return { ...old, ...challenge };
    });

    // Also update in challenges list
    queryClient.setQueryData<Challenge[]>(["challenges"], (old) => {
      if (!old) return old;
      return old.map((c) => (c.id === challenge.id ? { ...c, ...challenge } : c));
    });
  };

  return {
    updateProgressionOptimistically,
    updateChallengeSubmission,
    addBadgeOptimistically,
    updateChallengeOptimistically,
  };
}

/**
 * Rollback function for optimistic updates
 */
export function rollbackOptimisticUpdate(queryKey: string[], previousData: any) {
  const queryClient = useQueryClient();
  queryClient.setQueryData(queryKey, previousData);
}

