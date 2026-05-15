// Knowledge Base Configuration
export const KNOWLEDGE_CONFIG = {
  // Base URL for schema.org
  SCHEMA_ORG_URL: "https://schema.org",
  
  // Documentation files
  DOC_FILES: [
    "https://schema.org/docs/full.html",
    "https://schema.org/docs/developers.html",
    "https://schema.org/docs/schemaapps.html"
  ],
  
  // Additional knowledge sources
  SOURCES: [
    { name: "Google", url: "https://developers.google.com/search/docs/enhanced/sitemaps" },
    { name: "W3C", url: "https://www.w3.org/TeamSubmission/shacl/" },
    { name: "Wikipedia", url: "https://en.wikipedia.org/wiki/Schema.org" }
  ],
  
  // Cache location
  CACHE_DIR: "./data/knowledge/",
  
  // Index name
  INDEX_NAME: "schemaorg-knowledge"
}
