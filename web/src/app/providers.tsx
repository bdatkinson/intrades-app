"use client";

import { PropsWithChildren, Suspense, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import AnalyticsListener from "./analytics-listener";
import { SessionProvider } from "next-auth/react";

export default function Providers({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient());
  useEffect(() => {
    if (typeof window === "undefined") return;
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";
    if (key && !posthog.__loaded) {
      posthog.init(key, {
        api_host: host,
        capture_pageview: false,
        person_profiles: "identified_only",
      });
    }
  }, []);

  const content = (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        {process.env.NODE_ENV === "development" && <ReactQueryDevtools />}
        <Suspense fallback={null}>
          <AnalyticsListener />
        </Suspense>
      </QueryClientProvider>
    </SessionProvider>
  );

  return <PostHogProvider client={posthog}>{content}</PostHogProvider>;
}
