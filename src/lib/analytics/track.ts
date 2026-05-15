// Product Analytics Tracker
import { ANALYTICS_CONFIG } from "./config"

type Event = {
  name: string
  properties?: Record<string, any>
}

export function track(event: Event) {
  if (!ANALYTICS_CONFIG.ENABLED || ANALYTICS_CONFIG.PROVIDER === "none") return
  
  const payload = { ...event, timestamp: new Date().toISOString() }
  
  switch (ANALYTICS_CONFIG.PROVIDER) {
    case "posthog":
      return trackPosthog(payload)
    case "amplitude":
      return trackAmplitude(payload)
    case "google":
      return trackGoogle(payload)
    default:
      console.log("[analytics]", payload)
  }
}

async function trackPosthog(event: any) {
  if (!ANALYTICS_CONFIG.POSTHOG_KEY) return
  await fetch(`https://${ANALYTICS_CONFIG.POSTHOG_HOST}/capture`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: ANALYTICS_CONFIG.POSTHOG_KEY,
      event: event.name,
      properties: event.properties
    })
  })
}

async function trackAmplitude(event: any) {
  if (!ANALYTICS_CONFIG.AMPLITUDE_KEY) return
  // Amplitude API call
}

async function trackGoogle(event: any) {
  if (!ANALYTICS_CONFIG.GA_ID) return
  // GA4 measurement protocol
}

export { ANALYTICS_CONFIG }
