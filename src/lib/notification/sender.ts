// Notification sender
import { NOTIFY_CONFIG } from "./config"

export type NotificationType = "info" | "warning" | "error" | "success"

export async function notify(message: string, type: NotificationType = "info") {
  if (!NOTIFY_CONFIG.ENABLED || NOTIFY_CONFIG.CHANNEL === "none") {
    return { sent: false, reason: "disabled" }
  }
  
  const payload = { message, type, timestamp: new Date().toISOString() }
  
  switch (NOTIFY_CONFIG.CHANNEL) {
    case "discord":
      return await sendDiscord(payload)
    case "slack":
      return await sendSlack(payload)
    case "webhook":
      return await sendWebhook(payload)
    case "email":
      return await sendEmail(payload)
    default:
      return { sent: false, reason: "unknown channel" }
  }
}

async function sendDiscord(payload: any) {
  if (!NOTIFY_CONFIG.DISCORD_WEBHOOK) return { sent: false }
  await fetch(NOTIFY_CONFIG.DISCORD_WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: `[${payload.type}] ${payload.message}` })
  })
  return { sent: true, channel: "discord" }
}

async function sendSlack(payload: any) {
  if (!NOTIFY_CONFIG.SLACK_WEBHOOK) return { sent: false }
  await fetch(NOTIFY_CONFIG.SLACK_WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: `[${payload.type}] ${payload.message}` })
  })
  return { sent: true, channel: "slack" }
}

async function sendWebhook(payload: any) {
  if (!NOTIFY_CONFIG.WEBHOOK_URL) return { sent: false }
  await fetch(NOTIFY_CONFIG.WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  return { sent: true, channel: "webhook" }
}

async function sendEmail(payload: any) {
  // SMTP implementation would go here
  return { sent: false, reason: "not implemented" }
}

export { NOTIFY_CONFIG }
