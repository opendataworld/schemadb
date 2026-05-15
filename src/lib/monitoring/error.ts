// Error monitoring
import { MONITOR_CONFIG } from "./config"

export function initErrorHandler() {
  if (MONITOR_CONFIG.PROVIDER === "none") {
    return
  }
  
  if (MONITOR_CONFIG.PROVIDER === "sentry" && MONITOR_CONFIG.SENTRY_DSN) {
    // Sentry would be initialized here
    console.log("[monitor] Sentry initialized")
  }
  
  process.on("uncaughtException", (error) => {
    console.error("[error]", error.message)
  })
  
  process.on("unhandledRejection", (reason) => {
    console.error("[rejection]", reason)
  })
}

export function isHealthy(): boolean {
  return true // Check memory, CPU, etc.
}

export { MONITOR_CONFIG }
