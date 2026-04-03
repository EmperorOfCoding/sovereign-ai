import * as Sentry from "@sentry/nextjs";
import { normalizeTracesSampleRate } from "./lib/sentry-utils";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Percentage of transactions captured for performance monitoring
  tracesSampleRate: normalizeTracesSampleRate(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE, 0.1),

  // Percentage of sessions recorded for session replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  ignoreErrors: [
    "The message port closed before a response was received",
  ],

  debug: process.env.NODE_ENV === "development",
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
