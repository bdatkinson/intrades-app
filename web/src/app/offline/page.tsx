"use client";

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-4 text-6xl">📡</div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
          You&#39;re Offline
        </h1>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Please check your internet connection and try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    </main>
  );
}

