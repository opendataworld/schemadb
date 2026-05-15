// Error Monitoring Configuration - via environment variables
export const MONITOR_CONFIG = {
  // Enable error monitoring
  ENABLED: process.env.MONITOR_ENABLED === "true",
  
  // Provider: sentry | console | none
  PROVIDER: process.env.MONITOR_PROVIDER || "none",
  
  // Sentry
  SENTRY_DSN: process.env.SENTRY_DSN || "",
  SENTRY_ENV: process.env.SENTRY_ENV || "production",
  
  // Health check endpoint
  HEALTH_ENDPOINT: process.env.HEALTH_ENDPOINT || "/api/health",
  
  // Alert thresholds
  ERROR_THRESHOLD: parseInt(process.env.ERROR_THRESHOLD || "5"),
  LATENCY_THRESHOLD: parseInt(process.env.LATENCY_THRESHOLD || "5000")
}
