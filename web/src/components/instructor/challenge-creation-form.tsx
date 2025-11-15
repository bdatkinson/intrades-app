"use client";

import { useState } from "react";

export type ChallengeFormData = {
  title: string;
  description: string;
  trade: string;
  difficulty: "Easy" | "Medium" | "Hard";
  type: "quiz" | "real-world" | "mini-game" | "boss-battle";
  xpReward: number;
  estimatedTime?: string;
  requirements?: string[];
  submissionType?: "upload" | "text" | "quiz" | "none";
  submissionAccept?: string;
  tags?: string[];
  isPublished?: boolean;
};

type ChallengeCreationFormProps = {
  initialData?: Partial<ChallengeFormData>;
  onSubmit: (data: ChallengeFormData) => void;
  onCancel?: () => void;
};

export function ChallengeCreationForm({
  initialData,
  onSubmit,
  onCancel,
}: ChallengeCreationFormProps) {
  const [formData, setFormData] = useState<ChallengeFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    trade: initialData?.trade || "Electrical",
    difficulty: initialData?.difficulty || "Medium",
    type: initialData?.type || "real-world",
    xpReward: initialData?.xpReward || 50,
    estimatedTime: initialData?.estimatedTime || "",
    requirements: initialData?.requirements || [],
    submissionType: initialData?.submissionType || "upload",
    submissionAccept: initialData?.submissionAccept || "image/*",
    tags: initialData?.tags || [],
    isPublished: initialData?.isPublished || false,
  });

  const [newRequirement, setNewRequirement] = useState("");
  const [newTag, setNewTag] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setFormData({
        ...formData,
        requirements: [...(formData.requirements || []), newRequirement.trim()],
      });
      setNewRequirement("");
    }
  };

  const removeRequirement = (index: number) => {
    setFormData({
      ...formData,
      requirements: formData.requirements?.filter((_, i) => i !== index) || [],
    });
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), newTag.trim()],
      });
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter((t) => t !== tag) || [],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      {/* Basic Information */}
      <div className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
          Basic Information
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Challenge Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              placeholder="e.g., Wire a 3-way switch"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={6}
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              placeholder="Describe the challenge in detail..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Trade *
              </label>
              <select
                value={formData.trade}
                onChange={(e) => setFormData({ ...formData, trade: e.target.value })}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="Electrical">Electrical</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Carpentry">Carpentry</option>
                <option value="HVAC">HVAC</option>
                <option value="Welding">Welding</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Difficulty *
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) =>
                  setFormData({ ...formData, difficulty: e.target.value as any })
                }
                required
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Challenge Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="real-world">Real-World</option>
                <option value="quiz">Quiz</option>
                <option value="mini-game">Mini-Game</option>
                <option value="boss-battle">Boss Battle</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                XP Reward *
              </label>
              <input
                type="number"
                value={formData.xpReward}
                onChange={(e) =>
                  setFormData({ ...formData, xpReward: parseInt(e.target.value) || 0 })
                }
                required
                min={0}
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Estimated Time
            </label>
            <input
              type="text"
              value={formData.estimatedTime}
              onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              placeholder="e.g., 30-45 min"
            />
          </div>
        </div>
      </div>

      {/* Requirements */}
      <div className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
          Requirements
        </h3>
        <div className="space-y-3">
          {formData.requirements?.map((req, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-700">
                {req}
              </span>
              <button
                type="button"
                onClick={() => removeRequirement(index)}
                className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          <div className="flex gap-2">
            <input
              type="text"
              value={newRequirement}
              onChange={(e) => setNewRequirement(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addRequirement())}
              placeholder="Add a requirement..."
              className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
            <button
              type="button"
              onClick={addRequirement}
              className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Submission Settings */}
      <div className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
          Submission Settings
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Submission Type
            </label>
            <select
              value={formData.submissionType}
              onChange={(e) => setFormData({ ...formData, submissionType: e.target.value as any })}
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="upload">File Upload</option>
              <option value="text">Text Response</option>
              <option value="quiz">Quiz</option>
              <option value="none">No Submission</option>
            </select>
          </div>

          {formData.submissionType === "upload" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Accepted File Types
              </label>
              <input
                type="text"
                value={formData.submissionAccept}
                onChange={(e) => setFormData({ ...formData, submissionAccept: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                placeholder="e.g., image/*, video/*, .pdf"
              />
            </div>
          )}
        </div>
      </div>

      {/* Tags */}
      <div className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Tags</h3>
        <div className="space-y-3">
          {formData.tags && formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              placeholder="Add a tag..."
              className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
            <button
              type="button"
              onClick={addTag}
              className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Publish Toggle */}
      <div className="flex items-center justify-between rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Publish Challenge</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Make this challenge available to students
          </p>
        </div>
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            checked={formData.isPublished}
            onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
            className="peer sr-only"
          />
          <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white dark:bg-gray-700"></div>
        </label>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-6 py-3 font-semibold text-white transition-all hover:from-green-700 hover:to-green-800 hover:shadow-lg"
        >
          {initialData ? "Update Challenge" : "Create Challenge"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

