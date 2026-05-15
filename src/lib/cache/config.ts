// SurrealDB Cache Configuration
export const CACHE_CONFIG = {
  // Enable SurrealDB cache
  ENABLED: process.env.CACHE_ENABLED === "true",
  
  // SurrealDB connection
  URL: process.env.SURREAL_URL || "mem://",
  USER: process.env.SURREAL_USER || "root",
  PASS: process.env.SURREAL_PASS || "root",
  NS: process.env.SURREAL_NS || "schemaorg",
  DB: process.env.SURREAL_DB || "cache",
  
  // Tables
  SEARCH_TABLE: "searches",
  KNOWLEDGE_TABLE: "knowledge",
  SESSION_TABLE: "sessions",
  
  // TTL (seconds)
  SEARCH_TTL: parseInt(process.env.CACHE_SEARCH_TTL || "3600"),
  KNOWLEDGE_TTL: parseInt(process.env.CACHE_KNOWLEDGE_TTL || "86400"),
  
  // Max entries
  MAX_SEARCHES: parseInt(process.env.CACHE_MAX_SEARCHES || "1000"),
  MAX_KNOWLEDGE: parseInt(process.env.CACHE_MAX_KNOWLEDGE || "500")
}
