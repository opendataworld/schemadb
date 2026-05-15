// Telemetry Configuration - via environment variables
export const TELEMETRY_CONFIG = {
  // Enable telemetry
  ENABLED: process.env.TELEMETRY_ENABLED === "true",
  
  // Provider: datadog | console | none
  PROVIDER: process.env.TELEMETRY_PROVIDER || "none",
  
  // Datadog
  DD_API_KEY: process.env.DD_API_KEY || "",
  DD_SITE: process.env.DD_SITE || "datadoghq.com",
  DD_SERVICE: process.env.DD_SERVICE || "schemaorg-agent",
  
  // Custom endpoint
  TELEMETRY_ENDPOINT: process.env.TELEMETRY_ENDPOINT || "",
  
  // Sample rate (0-1)
  SAMPLE_RATE: parseFloat(process.env.TELEMETRY_SAMPLE_RATE || "1.0")
}
