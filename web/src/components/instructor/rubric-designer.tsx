"use client";

import { useState } from "react";

export type RubricCriterion = {
  id: string;
  name: string;
  description: string;
  maxPoints: number;
  levels: RubricLevel[];
};

export type RubricLevel = {
  id: string;
  name: string;
  description: string;
  points: number;
};

type RubricDesignerProps = {
  rubric: RubricCriterion[];
  onRubricChange: (rubric: RubricCriterion[]) => void;
};

export function RubricDesigner({ rubric, onRubricChange }: RubricDesignerProps) {
  const [editingCriterion, setEditingCriterion] = useState<string | null>(null);

  const addCriterion = () => {
    const newCriterion: RubricCriterion = {
      id: `criterion-${Date.now()}`,
      name: "New Criterion",
      description: "",
      maxPoints: 10,
      levels: [
        { id: "excellent", name: "Excellent", description: "", points: 10 },
        { id: "good", name: "Good", description: "", points: 7 },
        { id: "fair", name: "Fair", description: "", points: 4 },
        { id: "poor", name: "Poor", description: "", points: 1 },
      ],
    };
    onRubricChange([...rubric, newCriterion]);
  };

  const updateCriterion = (id: string, updates: Partial<RubricCriterion>) => {
    onRubricChange(
      rubric.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const deleteCriterion = (id: string) => {
    onRubricChange(rubric.filter((c) => c.id !== id));
  };

  const updateLevel = (criterionId: string, levelId: string, updates: Partial<RubricLevel>) => {
    onRubricChange(
      rubric.map((criterion) =>
        criterion.id === criterionId
          ? {
              ...criterion,
              levels: criterion.levels.map((level) =>
                level.id === levelId ? { ...level, ...updates } : level
              ),
            }
          : criterion
      )
    );
  };

  const addLevel = (criterionId: string) => {
    onRubricChange(
      rubric.map((criterion) =>
        criterion.id === criterionId
          ? {
              ...criterion,
              levels: [
                ...criterion.levels,
                {
                  id: `level-${Date.now()}`,
                  name: "New Level",
                  description: "",
                  points: 0,
                },
              ],
            }
          : criterion
      )
    );
  };

  const deleteLevel = (criterionId: string, levelId: string) => {
    onRubricChange(
      rubric.map((criterion) =>
        criterion.id === criterionId
          ? {
              ...criterion,
              levels: criterion.levels.filter((level) => level.id !== levelId),
            }
          : criterion
      )
    );
  };

  const totalPoints = rubric.reduce((sum, c) => sum + c.maxPoints, 0);

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Rubric</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total Points: {totalPoints}
          </p>
        </div>
        <button
          onClick={addCriterion}
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
        >
          + Add Criterion
        </button>
      </div>

      <div className="space-y-4">
        {rubric.map((criterion) => (
          <div
            key={criterion.id}
            className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={criterion.name}
                  onChange={(e) => updateCriterion(criterion.id, { name: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-lg font-semibold text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                  placeholder="Criterion Name"
                />
                <textarea
                  value={criterion.description}
                  onChange={(e) => updateCriterion(criterion.id, { description: e.target.value })}
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                  placeholder="Criterion description..."
                />
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Max Points:
                  </label>
                  <input
                    type="number"
                    value={criterion.maxPoints}
                    onChange={(e) =>
                      updateCriterion(criterion.id, {
                        maxPoints: parseInt(e.target.value) || 0,
                      })
                    }
                    min={0}
                    className="w-20 rounded-lg border border-gray-300 bg-white px-2 py-1 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>
              </div>
              <button
                onClick={() => deleteCriterion(criterion.id)}
                className="ml-4 rounded-lg p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            {/* Levels */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Performance Levels
                </label>
                <button
                  onClick={() => addLevel(criterion.id)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                >
                  + Add Level
                </button>
              </div>
              {criterion.levels.map((level) => (
                <div
                  key={level.id}
                  className="flex items-start gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-700/50"
                >
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={level.name}
                      onChange={(e) => updateLevel(criterion.id, level.id, { name: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                      placeholder="Level name"
                    />
                    <textarea
                      value={level.description}
                      onChange={(e) =>
                        updateLevel(criterion.id, level.id, { description: e.target.value })
                      }
                      rows={2}
                      className="w-full rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                      placeholder="Level description..."
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={level.points}
                      onChange={(e) =>
                        updateLevel(criterion.id, level.id, {
                          points: parseInt(e.target.value) || 0,
                        })
                      }
                      min={0}
                      max={criterion.maxPoints}
                      className="w-16 rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                    />
                    <button
                      onClick={() => deleteLevel(criterion.id, level.id)}
                      className="rounded-lg p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {rubric.length === 0 && (
        <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center dark:border-gray-600 dark:bg-gray-800/50">
          <p className="text-gray-600 dark:text-gray-400">
            No criteria yet. Add your first criterion to get started.
          </p>
        </div>
      )}
    </div>
  );
}

