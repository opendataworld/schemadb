// Memory Configuration - via environment variables
export const MEMORY_CONFIG = {
  STORAGE_TYPE: process.env.MEMORY_STORAGE || "memory",
  MAX_HISTORY: parseInt(process.env.MAX_HISTORY || "20"),
  SURREAL_URL: process.env.SURREAL_URL || "mem://",
  SURREAL_USER: process.env.SURREAL_USER || "root",
  SURREAL_PASS: process.env.SURREAL_PASS || "root",
  SESSION_PREFIX: process.env.SESSION_PREFIX || "schemaorg-chat-"
}
