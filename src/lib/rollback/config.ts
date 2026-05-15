// Reply Rollback Configuration
export const ROLLBACK_CONFIG = {
  ENABLED: process.env.ROLLBACK_ENABLED === "true",
  MAX_HISTORY_DEPTH: parseInt(process.env.ROLLBACK_MAX_DEPTH || "10"),
  PROVIDER: process.env.ROLLBACK_PROVIDER || "local",
  TABLE: "revisions",
  AUTO_SAVE_INTERVAL: parseInt(process.env.ROLLBACK_AUTO_SAVE_INTERVAL || "30"),
  RETENTION_HOURS: parseInt(process.env.ROLLBACK_RETENTION_HOURS || "24")
}
