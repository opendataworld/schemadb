// SIEM (Security Information & Event Management) Configuration
export const SIEM_CONFIG = {
  // Enable SIEM
  ENABLED: process.env.SIEM_ENABLED === "true",
  
  // Provider: elastic | splunk | azure | none
  PROVIDER: process.env.SIEM_PROVIDER || "none",
  
  // Elasticsearch
  ES_URL: process.env.ES_URL || "",
  ES_INDEX: process.env.ES_INDEX || "schemaorg-logs",
  ES_API_KEY: process.env.ES_API_KEY || "",
  
  // Splunk
  SPLUNK_URL: process.env.SPLUNK_URL || "",
  SPLUNK_TOKEN: process.env.SPLUNK_TOKEN || "",
  SPLUNK_INDEX: process.env.SPLUNK_INDEX || "schemaorg",
  
  // Azure Log Analytics
  AZURE_WORKSPACE_ID: process.env.AZURE_WORKSPACE_ID || "",
  AZURE_WORKSPACE_KEY: process.env.AZURE_WORKSPACE_KEY || "",
  
  // Log retention days
  RETENTION_DAYS: parseInt(process.env.SIEM_RETENTION_DAYS || "90"),
  
  // Log levels to capture
  LOG_LEVELS: (process.env.SIEM_LOG_LEVELS || "error,warning").split(","),
  
  // Sanitize PII
  SANITIZE_PII: process.env.SIEM_SANITIZE_PII === "true"
}
