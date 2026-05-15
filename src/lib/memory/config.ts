// Memory Configuration
export const MEMORY_CONFIG = {
  // Storage type: memory | surreal | sqlite
  STORAGE_TYPE: process.env.MEMORY_STORAGE || "memory",
  
  // Session history length
  MAX_HISTORY: parseInt(process.env.MAX_HISTORY || "20", 10),
  
  // SurrealDB (optional)
  SURREAL_URL: process.env.SURREAL_URL || "mem://",
  SURREAL_USER: process.env.SURREAL_USER || "root",
  SURREAL_PASS: process.env.SURREAL_PASS || "root",
  
  // Session ID format
  SESSION_PREFIX: "schemaorg-chat-"
}
