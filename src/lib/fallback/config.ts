// Unified Fallback Configuration
export const FALLBACK_CONFIG = {
  ENABLED: process.env.FALLBACK_ENABLED === "true",
  
  // Trigger: no_answer | error | always
  TRIGGER: process.env.FALLBACK_TRIGGER || "no_answer",
  
  // Priority source groups
  GROUPS: (process.env.FALLBACK_GROUPS || "trust,web").split(","),
  
  // Trust sources (in priority)
  TRUST_SOURCES: (process.env.TRUST_SOURCES || "schemaorg,wikipedia,w3c,mdn").split(","),
  
  // Web search providers
  WEB_PROVIDERS: (process.env.WEB_PROVIDERS || "tavily,ddg").split(","),
  
  // API keys
  TAVILY_KEY: process.env.TAVILY_API_KEY || "",
  GOOGLE_KEY: process.env.GOOGLE_SEARCH_KEY || "",
  
  // Settings
  MAX_RESULTS: parseInt(process.env.FALLBACK_MAX_RESULTS || "3"),
  TIMEOUT: parseInt(process.env.FALLBACK_TIMEOUT || "5000")
}
