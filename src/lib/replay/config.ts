// Replay Configuration
export const REPLAY_CONFIG = {
  ENABLE_REPLAY: process.env.REPLAY_ENABLE === "true",
  
  // Max revisions to keep
  MAX_REVISIONS: parseInt(process.env.REPLAY_MAX_REVISIONS || "10"),
  
  // Auto-save interval (seconds)
  AUTO_SAVE_INTERVAL: parseInt(process.env.REPLAY_AUTO_SAVE || "300"),
  
  // Diff settings
  DIFF_STYLE: process.env.REPLAY_DIFF_STYLE || "unified",
  
  // Restore confirmation
  CONFIRM_RESTORE: process.env.REPLAY_CONFIRM_RESTORE !== "false"
}
