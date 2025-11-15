"use client";

import { useState } from "react";
import { DocumentUpload } from "./document-upload";

type TaskSubmissionFormProps = {
  challengeId: string | number;
  onSubmit?: (data: SubmissionData) => void;
  onCancel?: () => void;
  initialData?: Partial<SubmissionData>;
  allowDraft?: boolean;
};

export type SubmissionData = {
  textResponse?: string;
  files?: Array<{ key: string; url: string; name: string }>;
  images?: Array<{ key: string; url: string; name: string }>;
  notes?: string;
  isDraft?: boolean;
};

export function TaskSubmissionForm({
  challengeId,
  onSubmit,
  onCancel,
  initialData,
  allowDraft = true,
}: TaskSubmissionFormProps) {
  const [textResponse, setTextResponse] = useState(initialData?.textResponse || "");
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ key: string; url: string; name: string }>>(
    initialData?.files || []
  );
  const [uploadedImages, setUploadedImages] = useState<Array<{ key: string; url: string; name: string }>>(
    initialData?.images || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = (file: File, url: string) => {
    const newFile = {
      key: url.split("/").pop() || "",
      url,
      name: file.name,
    };
    setUploadedFiles((prev) => [...prev, newFile]);
  };

  const handleImageUpload = (file: File, url: string) => {
    const newImage = {
      key: url.split("/").pop() || "",
      url,
      name: file.name,
    };
    setUploadedImages((prev) => [...prev, newImage]);
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (isDraft: boolean = false) => {
    setIsSubmitting(true);
    try {
      const submissionData: SubmissionData = {
        textResponse: textResponse.trim() || undefined,
        files: uploadedFiles.length > 0 ? uploadedFiles : undefined,
        images: uploadedImages.length > 0 ? uploadedImages : undefined,
        notes: notes.trim() || undefined,
        isDraft,
      };

      await onSubmit?.(submissionData);
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = textResponse.trim().length > 0 || uploadedFiles.length > 0 || uploadedImages.length > 0;

  return (
    <div className="w-full space-y-6">
      <div className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Submit Your Work
        </h2>

        {/* Text Response */}
        <div className="space-y-2 mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Your Response <span className="text-red-500">*</span>
          </label>
          <textarea
            value={textResponse}
            onChange={(e) => setTextResponse(e.target.value)}
            placeholder="Describe your work, what you learned, or any challenges you faced..."
            rows={8}
            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            required
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {textResponse.length} characters
          </p>
        </div>

        {/* Image Upload */}
        <div className="space-y-2 mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Photos of Your Work
          </label>
          <DocumentUpload
            milestoneId={String(challengeId)}
            onUploadComplete={handleImageUpload}
            accept="image/*"
            maxSize={10}
            label=""
            description="Upload photos showing your completed work"
          />
          {uploadedImages.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
              {uploadedImages.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image.url}
                    alt={image.name}
                    className="h-32 w-full rounded-lg object-cover"
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute right-2 top-2 rounded-full bg-red-500 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* File Upload */}
        <div className="space-y-2 mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Additional Files
          </label>
          <DocumentUpload
            milestoneId={String(challengeId)}
            onUploadComplete={handleFileUpload}
            accept=".pdf,.doc,.docx"
            maxSize={10}
            label=""
            description="Upload documents, PDFs, or other files"
          />
          {uploadedFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📄</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {file.name}
                      </p>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline dark:text-blue-400"
                      >
                        View file
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="space-y-2 mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Additional Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional comments or questions..."
            rows={3}
            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {allowDraft && (
            <button
              onClick={() => handleSubmit(true)}
              disabled={isSubmitting}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-colors disabled:opacity-50 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              {isSubmitting ? "Saving..." : "Save as Draft"}
            </button>
          )}
          <button
            onClick={() => handleSubmit(false)}
            disabled={!canSubmit || isSubmitting}
            className="flex-1 rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-6 py-3 font-semibold text-white transition-all disabled:opacity-50 hover:from-green-700 hover:to-green-800 hover:shadow-lg"
          >
            {isSubmitting ? "Submitting..." : "Submit Challenge"}
          </button>
          {onCancel && (
            <button
              onClick={onCancel}
              className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

