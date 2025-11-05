import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  /* additional Next.js config here if needed */
};

export default withSentryConfig(nextConfig);
