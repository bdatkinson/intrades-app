"use client";

import { useState } from "react";

type CompletionCertificateProps = {
  studentName: string;
  courseName: string;
  completionDate: string;
  xpEarned?: number;
  tier?: string;
  onDownload?: () => void;
  onShare?: () => void;
};

export function CompletionCertificate({
  studentName,
  courseName,
  completionDate,
  xpEarned,
  tier,
  onDownload,
  onShare,
}: CompletionCertificateProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleDownload = () => {
    // Create a canvas or use html2canvas to generate PDF/image
    // For now, just trigger the callback
    onDownload?.();
  };

  const handleShare = () => {
    onShare?.();
  };

  return (
    <div className="w-full">
      {/* Certificate Display */}
      <div
        className="relative overflow-hidden rounded-2xl border-4 border-yellow-400 bg-gradient-to-br from-yellow-50 via-white to-yellow-50 p-8 shadow-2xl dark:from-yellow-900/20 dark:to-yellow-900/10"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Decorative Border Pattern */}
        <div className="absolute inset-0 border-2 border-yellow-300/50" />
        <div className="absolute inset-4 border border-yellow-200/50" />

        {/* Corner Decorations */}
        <div className="absolute left-0 top-0 h-16 w-16 border-r-4 border-b-4 border-yellow-400" />
        <div className="absolute right-0 top-0 h-16 w-16 border-l-4 border-b-4 border-yellow-400" />
        <div className="absolute bottom-0 left-0 h-16 w-16 border-r-4 border-t-4 border-yellow-400" />
        <div className="absolute bottom-0 right-0 h-16 w-16 border-l-4 border-t-4 border-yellow-400" />

        {/* Content */}
        <div className="relative z-10 text-center">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-yellow-600 dark:text-yellow-400">
              CERTIFICATE OF COMPLETION
            </h1>
            <div className="mt-2 h-1 w-32 bg-yellow-400 mx-auto" />
          </div>

          {/* Body */}
          <div className="mb-8 space-y-4">
            <p className="text-lg text-gray-700 dark:text-gray-300">
              This is to certify that
            </p>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              {studentName}
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              has successfully completed
            </p>
            <h3 className="text-3xl font-semibold text-blue-600 dark:text-blue-400">
              {courseName}
            </h3>
          </div>

          {/* Stats */}
          {(xpEarned || tier) && (
            <div className="mb-8 flex items-center justify-center gap-6">
              {xpEarned && (
                <div className="rounded-lg bg-yellow-100 px-4 py-2 dark:bg-yellow-900/30">
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    {xpEarned.toLocaleString()} XP Earned
                  </p>
                </div>
              )}
              {tier && (
                <div className="rounded-lg bg-blue-100 px-4 py-2 dark:bg-blue-900/30">
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    {tier} Tier
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Date */}
          <div className="mb-8">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Completed on {new Date(completionDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Seal/Signature Area */}
          <div className="flex items-center justify-between border-t-2 border-yellow-300 pt-6">
            <div className="flex-1 text-left">
              <div className="h-16 w-32 border-2 border-dashed border-gray-300 dark:border-gray-600" />
              <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">Instructor Signature</p>
            </div>
            <div className="flex-1 text-right">
              <div className="ml-auto h-16 w-16 rounded-full border-4 border-yellow-400 bg-yellow-100 dark:bg-yellow-900/30" />
              <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">Official Seal</p>
            </div>
          </div>
        </div>

        {/* Hover Effect */}
        {isHovered && (
          <div className="absolute inset-0 bg-yellow-400/5 transition-all" />
        )}
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download PDF
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share
        </button>
      </div>
    </div>
  );
}

// Certificate Preview (for modals or smaller displays)
export function CertificatePreview({
  studentName,
  courseName,
  completionDate,
}: {
  studentName: string;
  courseName: string;
  completionDate: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-lg border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-white p-4 shadow-lg">
      <div className="text-center">
        <h3 className="text-lg font-bold text-yellow-600">Certificate</h3>
        <p className="mt-1 text-sm text-gray-700">{studentName}</p>
        <p className="text-xs text-gray-600">{courseName}</p>
        <p className="mt-2 text-xs text-gray-500">
          {new Date(completionDate).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

