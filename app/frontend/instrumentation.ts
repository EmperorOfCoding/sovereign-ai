import * as Sentry from "@sentry/nextjs";

/**
 * Next.js Instrumentation File
 * Runs once on server startup — use for startup logs and diagnostics.
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Sentry Server Config
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      tracesSampleRate: 1.0,
      debug: process.env.NODE_ENV === "development",
    });

    // Custom Startup Logs
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
    console.log("╔══════════════════════════════════════════════════╗");
    console.log("║        🌐 Sovereign AI — Frontend Online         ║");
    console.log("╠══════════════════════════════════════════════════╣");
    console.log(`║  Environment   : ${String(process.env.NODE_ENV || "development").padEnd(31)}║`);
    console.log(`║  Backend URL   : ${String(backendUrl).padEnd(31)}║`);
    console.log("╚══════════════════════════════════════════════════╝");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    // Sentry Edge Config
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      tracesSampleRate: 1.0,
      debug: process.env.NODE_ENV === "development",
    });
  }
}
