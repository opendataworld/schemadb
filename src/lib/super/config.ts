// Super Search Configuration
export const SUPER_CONFIG = {
  ENABLED: process.env.SUPER_ENABLED === "true",
  
  // Mode: fast | deep | comprehensive
  MODE: process.env.SUPER_MODE || "deep",
  
  // All sources (ordered by trust)
  SOURCES: [
    { id: "schemaorg", url: "https://schema.org", trust: 100, enabled: true },
    { id: "wikipedia", url: "https://en.wikipedia.org", trust: 90, enabled: true },
    { id: "w3c", url: "https://www.w3.org", trust: 95, enabled: true },
    { id: "mdn", url: "https://developer.mozilla.org", trust: 85, enabled: true },
    { id: "google", url: "https://developers.google.com", trust: 80, enabled: true },
    { id: "microdata", url: "https://www.w3.org/TR/microdata/", trust: 75, enabled: false }
  ],
  
  // Web search
  WEB_PROVIDERS: ["ddg", "tavily"],
  TAVILY_KEY: process.env.TAVILY_API_KEY || "",
  
  // Settings
  MAX_TRUST: parseInt(process.env.SUPER_MAX_TRUST || "3"),
  MAX_WEB: parseInt(process.env.SUPER_MAX_WEB || "3"),
  TIMEOUT: parseInt(process.env.SUPER_TIMEOUT || "10000"),
  
  // Cache
  CACHE_ENABLE: process.env.SUPER_CACHE !== "false",
  CACHE_TTL: parseInt(process.env.SUPER_CACHE_TTL || "3600")
}
