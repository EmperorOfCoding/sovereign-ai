const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    instrumentationHook: true,
  },
};

module.exports = withSentryConfig(nextConfig, {
  // Better Stack / Sentry project slug used for source-map uploads
  org: "sovereign-ai",
  project: "sovereign-ai-frontend",

  // Only print Sentry CLI output on error
  silent: !process.env.CI,

  // Upload a larger set of source maps for prettier stack traces
  widenClientFileUpload: true,

  // Hides source maps from the browser bundle for security
  hideSourceMaps: true,

  // Disable the Sentry telemetry to avoid extra network calls
  disableLogger: true,

  // Automatically instrument React component display names for better traces
  reactComponentAnnotation: {
    enabled: true,
  },
});
