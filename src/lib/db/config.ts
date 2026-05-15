// Unified SurrealDB Configuration
export const DB_CONFIG = {
  // Enable SurrealDB
  ENABLED: process.env.DB_ENABLED === "true",
  
  // Connection
  URL: process.env.SURREAL_URL || "mem://",
  USER: process.env.SURREAL_USER || "root",
  PASS: process.env.SURREAL_PASS || "root",
  NS: process.env.SURREAL_NS || "schemaorg",
  DB: process.env.SURREAL_DB || "main",
  
  // Tables
  TABLES: {
    SESSIONS: "sessions",
    MESSAGES: "messages",
    SEARCHES: "searches",
    KNOWLEDGE: "knowledge",
    AUDIT: "audit_logs",
    USERS: "users",
    SETTINGS: "settings",
    REVISIONS: "revisions"
  },
  
  // Defaults
  DEFAULT_TTL: parseInt(process.env.DB_DEFAULT_TTL || "86400")
}
