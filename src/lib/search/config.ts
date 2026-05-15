// Web Search Fallback Configuration
export const SEARCH_CONFIG = {
  // Enable web search fallback
  ENABLED: process.env.SEARCH_ENABLED === "true",
  
  // Trigger: error | no_answer | always
  TRIGGER: process.env.SEARCH_TRIGGER || "no_answer",
  
  // Providers (in priority order)
  PROVIDERS: (process.env.SEARCH_PROVIDERS || "tavily,ddg").split(","),
  
  // Tavily
  TAVILY_KEY: process.env.TAVILY_API_KEY || "",
  
  // DuckDuckGo
  DDG_ENABLED: process.env.DDG_ENABLED !== "false",
  
  // Google Search (API)
  GOOGLE_KEY: process.env.GOOGLE_SEARCH_KEY || "",
  
  // Max results to fetch
  MAX_RESULTS: parseInt(process.env.SEARCH_MAX_RESULTS || "5"),
  
  // Cache results
  CACHE_TTL: parseInt(process.env.SEARCH_CACHE_TTL || "3600")
}
