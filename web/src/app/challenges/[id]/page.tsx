"use client";

import Link from 'next/link'
import { useChallenge, useSubmitChallenge } from '@/lib/api-hooks'
import { ChallengeDetailCard } from '@/components/challenge-detail-card'
import { TaskSubmissionForm } from '@/components/task-submission-form'
import { ChallengeProgressTracker } from '@/components/challenge-progress-tracker'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { SubmissionData } from '@/lib/api'
import type { Trade } from '@/data/challenges'

export default function ChallengeDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: challenge, isLoading, error } = useChallenge(params.id);
  const submitChallenge = useSubmitChallenge();
  const [submissionStatus, setSubmissionStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  if (isLoading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
            <p className="text-gray-600 dark:text-gray-400">Loading challenge...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !challenge) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-semibold">Challenge not found</h1>
        <p className="mt-2 text-foreground/70">The challenge you were looking for does not exist.</p>
        <Link href="/challenges" className="mt-4 inline-flex rounded-md px-3 py-2 text-sm font-medium text-black brand-gradient">
          Back to challenges
        </Link>
      </main>
    );
  }

  // Convert challenge data to component format
  const requirements = challenge.requirements || [
    "Read the challenge requirements carefully",
    "Gather necessary tools and materials",
    "Follow safety guidelines",
    "Complete the task",
    "Submit your work"
  ];
  
  const steps = [
    { id: "1", title: "Review Requirements", description: "Read and understand the challenge", completed: true, estimatedTime: "5 min" },
    { id: "2", title: "Prepare Materials", description: "Gather tools and materials needed", completed: true, estimatedTime: "10 min" },
    { id: "3", title: "Complete Task", description: "Perform the challenge task", completed: false, estimatedTime: challenge.estimatedTime || "20 min" },
    { id: "4", title: "Submit Work", description: "Upload photos and submit", completed: false, estimatedTime: "5 min" },
  ];

  const handleSubmit = async (data: SubmissionData) => {
    setSubmissionStatus("submitting");
    try {
      await submitChallenge.mutateAsync({
        challengeId: challenge.id,
        data,
      });
      setSubmissionStatus("success");
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      setSubmissionStatus("error");
      console.error("Submission error:", error);
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 space-y-6">
      <ChallengeDetailCard
        challenge={{
          id: Number(challenge.id),
          title: challenge.title,
          summary: challenge.summary || challenge.description,
          trade: challenge.trade as Trade,
          difficulty: challenge.difficulty,
          submission: challenge.submissionType === 'upload' ? { type: 'upload', accept: challenge.submissionAccept } : undefined,
        }}
        xpReward={challenge.xpReward}
        estimatedTime={challenge.estimatedTime}
        requirements={requirements}
        progress={50}
      />

      <ChallengeProgressTracker
        steps={steps}
        currentStep="3"
        showTimeEstimates={true}
      />

      {challenge.submissionType === 'upload' && (
        <section className="mt-8">
          {submissionStatus === "success" ? (
            <div className="rounded-xl border-2 border-green-400 bg-green-50 p-6 text-center dark:border-green-600 dark:bg-green-900/20">
              <p className="text-lg font-semibold text-green-700 dark:text-green-300">
                ✅ Submission successful! Redirecting...
              </p>
            </div>
          ) : submissionStatus === "error" ? (
            <div className="rounded-xl border-2 border-red-400 bg-red-50 p-6 text-center dark:border-red-600 dark:bg-red-900/20">
              <p className="text-lg font-semibold text-red-700 dark:text-red-300">
                ❌ Submission failed. Please try again.
              </p>
            </div>
          ) : (
            <TaskSubmissionForm
              challengeId={challenge.id}
              onSubmit={handleSubmit}
              allowDraft={true}
            />
          )}
        </section>
      )}

      <div className="mt-8">
        <Link href="/challenges" className="rounded-md px-3 py-2 text-sm font-medium text-black brand-gradient">
          Browse more challenges
        </Link>
      </div>
    </main>
  );
}
