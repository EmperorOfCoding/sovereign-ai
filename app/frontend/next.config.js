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

  // Automatically instrument React component display names for better traces
  reactComponentAnnotation: {
    enabled: true,
  },

  // Sentry configuration for Turbopack compatibility
  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
  },
});
