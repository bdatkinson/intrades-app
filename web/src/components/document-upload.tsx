"use client";

import { useState, useRef } from "react";

type DocumentUploadProps = {
  milestoneId?: string;
  onUploadComplete?: (file: File, url: string) => void;
  onUploadError?: (error: string) => void;
  accept?: string;
  maxSize?: number; // in MB
  label?: string;
  description?: string;
};

export function DocumentUpload({
  milestoneId,
  onUploadComplete,
  onUploadError,
  accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png",
  maxSize = 10,
  label = "Upload Document",
  description,
}: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`;
    }
    return null;
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      onUploadError?.(error);
      return;
    }

    await uploadFile(file);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      onUploadError?.(error);
      return;
    }

    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadedFile(file);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // TODO: Replace with actual API call
      // const formData = new FormData();
      // formData.append('file', file);
      // if (milestoneId) formData.append('milestoneId', milestoneId);
      // const response = await fetch('/api/upload', { method: 'POST', body: formData });
      // const { url } = await response.json();

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Mock URL - replace with actual response
      const mockUrl = URL.createObjectURL(file);
      onUploadComplete?.(file, mockUrl);

      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 1000);
    } catch (error) {
      setIsUploading(false);
      setUploadProgress(0);
      onUploadError?.(error instanceof Error ? error.message : "Upload failed");
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="w-full space-y-4">
      {label && (
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
          {description && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{description}</p>
          )}
        </div>
      )}

      {/* Upload Area */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-xl border-2 border-dashed p-8 transition-all ${
          isDragging
            ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20"
            : "border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800/50 hover:border-gray-400 dark:hover:border-gray-500"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />

        {isUploading ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="text-4xl">📤</div>
            <div className="w-full max-w-xs">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Uploading...</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {uploadProgress}%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
            {uploadedFile && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {uploadedFile.name}
              </p>
            )}
          </div>
        ) : uploadedFile ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="text-5xl">✅</div>
            <div className="text-center">
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {uploadedFile.name}
              </p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {formatFileSize(uploadedFile.size)}
              </p>
            </div>
            <button
              onClick={() => {
                setUploadedFile(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Upload Different File
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="text-5xl">📄</div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Drag and drop a file here, or click to select
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Accepted: {accept} (max {maxSize}MB)
              </p>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Choose File
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

