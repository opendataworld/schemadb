// APM (Application Performance Monitoring) - via environment variables
export const APM_CONFIG = {
  ENABLED: process.env.APM_ENABLED === "true",
  PROVIDER: process.env.APM_PROVIDER || "none",
  DD_SERVICE: process.env.DD_SERVICE || "schemaorg-agent",
  SAMPLE_RATE: parseFloat(process.env.APM_SAMPLE_RATE || "0.1")
}
