// Telemetry tracker
import { TELEMETRY_CONFIG } from "./config"

export type Event = {
  name: string
  properties?: Record<string, any>
}

export function track(event: Event) {
  if (!TELEMETRY_CONFIG.ENABLED || TELEMETRY_CONFIG.PROVIDER === "none") {
    return
  }
  
  const payload = {
    ...event,
    timestamp: new Date().toISOString(),
    service: TELEMETRY_CONFIG.DD_SERVICE
  }
  
  if (TELEMETRY_CONFIG.PROVIDER === "console") {
    console.log("[telemetry]", JSON.stringify(payload))
  } else if (TELEMETRY_CONFIG.PROVIDER === "datadog") {
    sendDatadog(payload)
  }
}

async function sendDatadog(payload: any) {
  if (!TELEMETRY_CONFIG.DD_API_KEY) return
  
  await fetch(`https://api.${TELEMETRY_CONFIG.DD_SITE}/api/v2/logs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "DD-API-KEY": TELEMETRY_CONFIG.DD_API_KEY
    },
    body: JSON.stringify({ ddsource: "node", message: JSON.stringify(payload) })
  })
}

export { TELEMETRY_CONFIG }
