// Knowledge Base Configuration - via environment variables
export const KNOWLEDGE_CONFIG = {
  SCHEMA_ORG_URL: process.env.SCHEMA_ORG_URL || "https://schema.org",
  DATA_SOURCE: process.env.DATA_SOURCE || "https://schema.org/docs-tree.jsonld",
  DOC_URL: process.env.DOC_URL || "https://schema.org/docs/full.html",
  CACHE_DIR: process.env.KNOWLEDGE_CACHE_DIR || "./data/knowledge/",
  INDEX_NAME: process.env.KNOWLEDGE_INDEX_NAME || "schemaorg-knowledge"
}
