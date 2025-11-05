"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButtons() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  return (
    <div className="flex items-center gap-3 text-sm">
      {loading ? (
        <span>Loading...</span>
      ) : session ? (
        <>
          <span className="text-zinc-600 dark:text-zinc-300">
            Hi, {session.user?.name || session.user?.email}
          </span>
          <button
            className="rounded border px-3 py-1 hover:bg-black/5 dark:hover:bg-white/10"
            onClick={() => signOut()}
          >
            Logout
          </button>
        </>
      ) : (
        <button
          className="rounded border px-3 py-1 hover:bg-black/5 dark:hover:bg-white/10"
          onClick={() => signIn("auth0")}
        >
          Login
        </button>
      )}
    </div>
  );
}
