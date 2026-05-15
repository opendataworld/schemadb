// Notification Configuration - via environment variables
export const NOTIFY_CONFIG = {
  // Enable notifications
  ENABLED: process.env.NOTIFY_ENABLED === "true",
  
  // Channel: discord | slack | email | webhook
  CHANNEL: process.env.NOTIFY_CHANNEL || "none",
  
  // Discord webhook
  DISCORD_WEBHOOK: process.env.DISCORD_WEBHOOK || "",
  
  // Slack webhook
  SLACK_WEBHOOK: process.env.SSLACK_WEBHOOK || "",
  
  // Email (SMTP)
  SMTP_HOST: process.env.SMTP_HOST || "",
  SMTP_PORT: parseInt(process.env.SMTP_PORT || "587"),
  SMTP_SECURE: process.env.SMTP_SECURE === "true",
  SMTP_USER: process.env.SMTP_USER || "",
  SMTP_PASS: process.env.SMTP_PASS || "",
  EMAIL_FROM: process.env.EMAIL_FROM || "",
  EMAIL_TO: process.env.EMAIL_TO || "",
  
  // Generic webhook
  WEBHOOK_URL: process.env.WEBHOOK_URL || "",
  
  // Quiet hours (no notifications)
  QUIET_HOURS_START: process.env.QUIET_HOURS_START || "22:00",
  QUIET_HOURS_END: process.env.QUIET_HOURS_START || "08:00"
}
