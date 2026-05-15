// SIEM Logger
import { SIEM_CONFIG } from "./config"

type LogEntry = {
  level: string
  message: string
  timestamp: string
  source: string
  metadata?: Record<string, any>
}

export function log(event: LogEntry) {
  if (!SIEM_CONFIG.ENABLED || SIEM_CONFIG.PROVIDER === "none") {
    console.log("[siem]", event)
    return
  }
  
  const entry = sanitize(event)
  
  switch (SIEM_CONFIG.PROVIDER) {
    case "elastic":
      sendElasticsearch(entry)
      break
    case "splunk":
      sendSplunk(entry)
      break
    case "azure":
      sendAzure(entry)
      break
  }
}

function sanitize(entry: LogEntry): LogEntry {
  if (!SIEM_CONFIG.SANITIZE_PII) return entry
  
  // Simple PII sanitization
  const sanitized = { ...entry }
  if (sanitized.metadata) {
    for (const key of Object.keys(sanitized.metadata)) {
      if (key.match(/email|phone|address|password/)) {
        sanitized.metadata[key] = "[REDACTED]"
      }
    }
  }
  return sanitized
}

async function sendElasticsearch(entry: LogEntry) {
  if (!SIEM_CONFIG.ES_URL) return
  await fetch(`${SIEM_CONFIG.ES_URL}/${SIEM_CONFIG.ES_INDEX}/_doc`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `ApiKey ${SIEM_CONFIG.ES_API_KEY}`
    },
    body: JSON.stringify(entry)
  })
}

async function sendSplunk(entry: LogEntry) {
  if (!SIEM_CONFIG.SPLUNK_URL) return
  await fetch(`${SIEM_CONFIG.SPLUNK_URL}/services/collector`, {
    method: "POST",
    headers: {
      "Authorization": `Splunk ${SIEM_CONFIG.SPLUNK_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ event: entry })
  })
}

async function sendAzure(entry: LogEntry) {
  // Azure Log Analytics API
}

export { SIEM_CONFIG }
