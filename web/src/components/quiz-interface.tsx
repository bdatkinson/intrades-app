"use client";

import { useState, useEffect } from "react";

export type QuestionType = "multiple_choice" | "true_false" | "essay" | "short_answer";

export type QuizQuestion = {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[]; // For multiple choice
  correctAnswer?: string | number | boolean; // For multiple choice (index) or true/false
  correctAnswers?: string[]; // For multiple select
  points: number;
  explanation?: string;
};

export type Quiz = {
  id: string;
  title: string;
  description?: string;
  questions: QuizQuestion[];
  timeLimit?: number; // in minutes
  passingScore?: number; // percentage
};

type QuizInterfaceProps = {
  quiz: Quiz;
  onComplete?: (score: number, answers: Record<string, any>) => void;
  onCancel?: () => void;
  showResults?: boolean;
};

export function QuizInterface({
  quiz,
  onComplete,
  onCancel,
  showResults = true,
}: QuizInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(
    quiz.timeLimit ? quiz.timeLimit * 60 : null
  );

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  // Timer effect
  useEffect(() => {
    if (timeRemaining === null || isSubmitted) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          // Auto-submit when time runs out
          const calculatedScore = calculateScore();
          setScore(calculatedScore);
          setIsSubmitted(true);
          onComplete?.(calculatedScore, answers);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRemaining, isSubmitted]);

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const calculateScore = (): number => {
    let totalPoints = 0;
    let earnedPoints = 0;

    quiz.questions.forEach((question) => {
      totalPoints += question.points;
      const userAnswer = answers[question.id];

      if (userAnswer === undefined || userAnswer === null) return;

      switch (question.type) {
        case "multiple_choice":
          if (typeof question.correctAnswer === "number" && userAnswer === question.correctAnswer) {
            earnedPoints += question.points;
          }
          break;
        case "true_false":
          if (userAnswer === question.correctAnswer) {
            earnedPoints += question.points;
          }
          break;
        case "short_answer":
        case "essay":
          // For text answers, would need backend validation
          // For now, award points if answer is provided
          if (userAnswer && userAnswer.trim().length > 0) {
            earnedPoints += question.points * 0.5; // Partial credit
          }
          break;
      }
    });

    return Math.round((earnedPoints / totalPoints) * 100);
  };

  const handleSubmit = () => {
    const calculatedScore = calculateScore();
    setScore(calculatedScore);
    setIsSubmitted(true);
    onComplete?.(calculatedScore, answers);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (isSubmitted && showResults) {
    const passingScore = quiz.passingScore || 70;
    const passed = score !== null && score >= passingScore;

    return (
      <div className="w-full space-y-6">
        <div className={`rounded-xl border-2 p-8 text-center ${
          passed
            ? "border-green-400 bg-green-50 dark:border-green-600 dark:bg-green-900/20"
            : "border-red-400 bg-red-50 dark:border-red-600 dark:bg-red-900/20"
        }`}>
          <div className="text-6xl mb-4">{passed ? "🎉" : "📝"}</div>
          <h2 className="text-3xl font-bold mb-2">
            {passed ? "Quiz Passed!" : "Quiz Completed"}
          </h2>
          <div className="text-4xl font-bold my-4">
            {score}%
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {passed
              ? `You scored ${score}%! Great job!`
              : `You scored ${score}%. Passing score is ${passingScore}%.`}
          </p>
        </div>

        {/* Question Review */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Review Your Answers</h3>
          {quiz.questions.map((question, index) => {
            const userAnswer = answers[question.id];
            const isCorrect = 
              question.type === "multiple_choice" && userAnswer === question.correctAnswer ||
              question.type === "true_false" && userAnswer === question.correctAnswer;

            return (
              <div
                key={question.id}
                className={`rounded-lg border-2 p-4 ${
                  isCorrect
                    ? "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20"
                    : "border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/20"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                    Question {index + 1}
                  </h4>
                  <span className={`text-sm font-semibold ${
                    isCorrect ? "text-green-600" : "text-red-600"
                  }`}>
                    {isCorrect ? "✓ Correct" : "✗ Incorrect"}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-3">{question.question}</p>
                {question.explanation && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                    {question.explanation}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {onCancel && (
          <button
            onClick={onCancel}
            className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Close
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{quiz.title}</h2>
          {quiz.description && (
            <p className="text-gray-600 dark:text-gray-400">{quiz.description}</p>
          )}
        </div>
        {timeRemaining !== null && (
          <div className="rounded-lg bg-red-100 px-4 py-2 dark:bg-red-900/30">
            <span className="font-mono font-semibold text-red-700 dark:text-red-300">
              {formatTime(timeRemaining)}
            </span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </span>
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-4">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {currentQuestion.type.replace("_", " ").toUpperCase()} • {currentQuestion.points} points
          </span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
          {currentQuestion.question}
        </h3>

        {/* Answer Input */}
        <div className="space-y-3">
          {currentQuestion.type === "multiple_choice" && currentQuestion.options && (
            <div className="space-y-2">
              {currentQuestion.options.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-center gap-3 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                    answers[currentQuestion.id] === index
                      ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20"
                      : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    checked={answers[currentQuestion.id] === index}
                    onChange={() => handleAnswerChange(currentQuestion.id, index)}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="flex-1 text-gray-900 dark:text-gray-100">{option}</span>
                </label>
              ))}
            </div>
          )}

          {currentQuestion.type === "true_false" && (
            <div className="space-y-2">
              {[true, false].map((value) => (
                <label
                  key={String(value)}
                  className={`flex items-center gap-3 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                    answers[currentQuestion.id] === value
                      ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20"
                      : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    checked={answers[currentQuestion.id] === value}
                    onChange={() => handleAnswerChange(currentQuestion.id, value)}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="flex-1 text-gray-900 dark:text-gray-100">
                    {value ? "True" : "False"}
                  </span>
                </label>
              ))}
            </div>
          )}

          {(currentQuestion.type === "essay" || currentQuestion.type === "short_answer") && (
            <textarea
              value={answers[currentQuestion.id] || ""}
              onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
              placeholder="Type your answer here..."
              rows={currentQuestion.type === "essay" ? 8 : 4}
              className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="rounded-lg border border-gray-300 bg-white px-6 py-2 font-medium text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-blue-700"
        >
          {isLastQuestion ? "Submit Quiz" : "Next"}
        </button>
      </div>

      {onCancel && (
        <button
          onClick={onCancel}
          className="w-full rounded-lg border border-gray-300 bg-white px-6 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Cancel Quiz
        </button>
      )}
    </div>
  );
}

