"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, storage, type Challenge, type ChallengeSubmission, type Student, type Cohort, type ActivityItem, type BusinessMilestone } from "./api";
import { monitoring } from "./monitoring";
import type { UserProgression } from "./api";

// Auth Hooks
export function useProfile() {
  const tokens = storage.tokens;
  return useQuery({
    queryKey: ["auth", "profile"],
    queryFn: () => api.profile(tokens?.accessToken),
    enabled: !!tokens,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "profile"] });
      monitoring.trackEvent("profile_updated");
    },
    onError: (error) => {
      monitoring.logError(error as Error, "error", { context: "updateProfile" });
    },
  });
}

// Progression Hooks
export function useUserProgression(userId: string | null) {
  const tokens = storage.tokens;
  return useQuery({
    queryKey: ["progression", userId],
    queryFn: () => api.getUserProgression(userId!, tokens?.accessToken),
    enabled: !!userId && !!tokens,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useXPHistory(userId: string | null, limit = 20) {
  return useQuery({
    queryKey: ["xpHistory", userId, limit],
    queryFn: () => api.getXPHistory(userId!, limit),
    enabled: !!userId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

// Badge Hooks
export function useBadges() {
  const tokens = storage.tokens;
  return useQuery({
    queryKey: ["badges"],
    queryFn: () => api.getBadges(tokens?.accessToken),
    enabled: !!tokens,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useUserBadges(userId: string | null) {
  const tokens = storage.tokens;
  return useQuery({
    queryKey: ["userBadges", userId],
    queryFn: () => api.getUserBadges(userId!, tokens?.accessToken),
    enabled: !!userId && !!tokens,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Leaderboard Hooks
export function useLeaderboard(period: "weekly" | "allTime" = "weekly") {
  const tokens = storage.tokens;
  return useQuery({
    queryKey: ["leaderboard", period],
    queryFn: () => api.getLeaderboard(period, tokens?.accessToken),
    enabled: !!tokens,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

// Challenge Hooks
export function useChallenges(filters?: { trade?: string; difficulty?: string; type?: string }) {
  return useQuery({
    queryKey: ["challenges", filters],
    queryFn: () => api.getChallenges(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useChallenge(id: string | null) {
  return useQuery({
    queryKey: ["challenge", id],
    queryFn: () => api.getChallenge(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSubmitChallenge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ challengeId, data }: { challengeId: string; data: any }) =>
      api.submitChallenge(challengeId, data),
    onMutate: async ({ challengeId, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["challenge", challengeId] });
      await queryClient.cancelQueries({ queryKey: ["progression"] });

      // Snapshot previous values
      const previousChallenge = queryClient.getQueryData(["challenge", challengeId]);
      const previousProgression = queryClient.getQueryData(["progression"]);

      // Optimistically update progression if XP reward is known
      const challenge = queryClient.getQueryData<Challenge>(["challenge", challengeId]);
      if (challenge?.xpReward) {
        queryClient.setQueryData(["progression"], (old: any) => {
          if (!old) return old;
          return {
            ...old,
            xp: old.xp + challenge.xpReward,
            level: Math.floor((old.xp + challenge.xpReward) / 100) + 1,
          };
        });
      }

      return { previousChallenge, previousProgression };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousChallenge) {
        queryClient.setQueryData(["challenge", variables.challengeId], context.previousChallenge);
      }
      if (context?.previousProgression) {
        queryClient.setQueryData(["progression"], context.previousProgression);
      }
      monitoring.logError(error as Error, "error", { context: "submitChallenge" });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["challenge", variables.challengeId] });
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
      queryClient.invalidateQueries({ queryKey: ["progression"] });
      monitoring.trackEvent("challenge_submitted", { challengeId: variables.challengeId });
    },
  });
}

export function useCreateChallenge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createChallenge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
      monitoring.trackEvent("challenge_created");
    },
    onError: (error) => {
      monitoring.logError(error as Error, "error", { context: "createChallenge" });
    },
  });
}

export function useUpdateChallenge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Challenge> }) =>
      api.updateChallenge(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["challenge", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
    },
  });
}

export function useDeleteChallenge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteChallenge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
    },
  });
}

// Submission Hooks
export function useChallengeSubmissions(challengeId: string | null) {
  return useQuery({
    queryKey: ["submissions", challengeId],
    queryFn: () => api.getChallengeSubmissions(challengeId!),
    enabled: !!challengeId,
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useGradeSubmission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      challengeId,
      submissionId,
      grade,
      feedback,
      rubricScores,
    }: {
      challengeId: string;
      submissionId: string;
      grade: number;
      feedback: string;
      rubricScores?: Record<string, number>;
    }) => api.gradeSubmission(challengeId, submissionId, grade, feedback, rubricScores),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["submissions", variables.challengeId] });
      queryClient.invalidateQueries({ queryKey: ["progression"] });
      monitoring.trackEvent("submission_graded", {
        challengeId: variables.challengeId,
        submissionId: variables.submissionId,
      });
    },
    onError: (error) => {
      monitoring.logError(error as Error, "error", { context: "gradeSubmission" });
    },
  });
}

// Instructor Hooks
export function useStudents(filters?: { cohortId?: string; tier?: string; search?: string }) {
  return useQuery({
    queryKey: ["students", filters],
    queryFn: () => api.getStudents(filters),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

export function useCohorts() {
  return useQuery({
    queryKey: ["cohorts"],
    queryFn: api.getCohorts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateCohort() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createCohort,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cohorts"] });
      monitoring.trackEvent("cohort_created");
    },
  });
}

export function useUpdateCohort() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Cohort> }) =>
      api.updateCohort(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cohorts"] });
    },
  });
}

export function useDeleteCohort() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteCohort,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cohorts"] });
    },
  });
}

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: api.getNotifications,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

// Activity Feed Hooks
export function useActivityFeed(userId: string | null, limit = 10) {
  return useQuery({
    queryKey: ["activity", userId, limit],
    queryFn: () => api.getActivityFeed(userId!, limit),
    enabled: !!userId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

// Business Milestones Hooks
export function useBusinessMilestones(userId: string | null) {
  return useQuery({
    queryKey: ["milestones", userId],
    queryFn: () => api.getBusinessMilestones(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCompleteMilestone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, milestoneId, note }: { userId: string; milestoneId: string; note?: string }) =>
      api.completeMilestone(userId, milestoneId, note),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["milestones", variables.userId] });
      queryClient.invalidateQueries({ queryKey: ["progression", variables.userId] });
      monitoring.trackEvent("milestone_completed", {
        userId: variables.userId,
        milestoneId: variables.milestoneId,
      });
    },
    onError: (error) => {
      monitoring.logError(error as Error, "error", { context: "completeMilestone" });
    },
  });
}

// Milestone XP Hook
export function useAwardMilestoneXP() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, milestone, note }: { userId: string; milestone: string; note?: string }) =>
      api.awardMilestoneXP(userId, milestone, note),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["progression", variables.userId] });
      queryClient.invalidateQueries({ queryKey: ["xpHistory", variables.userId] });
      monitoring.trackEvent("milestone_xp_awarded", {
        userId: variables.userId,
        milestone: variables.milestone,
      });
    },
    onError: (error) => {
      monitoring.logError(error as Error, "error", { context: "awardMilestoneXP" });
    },
  });
}

