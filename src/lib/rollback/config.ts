// Reply Rollback Configuration
export const ROLLBACK_CONFIG = {
  // Enable reply rollback
  ENABLED: process.env.ROLLBACK_ENABLED === "true",
  
  // Max rollback distance (how far back)
  MAX_HISTORY_DEPTH: parseInt(process.env.ROLLBACK_MAX_DEPTH || "10"),
  
  // Store revisions
  STORAGE_DIR: process.env.ROLLBACK_STORAGE_DIR || "./data/rollback",
  
  // Auto-save interval (seconds)
  AUTO_SAVE_INTERVAL: parseInt(process.env.ROLLBACK_AUTO_SAVE_INTERVAL || "30"),
  
  // Keep revisions for X hours
  RETENTION_HOURS: parseInt(process.env.ROLLBACK_RETENTION_HOURS || "24")
}
