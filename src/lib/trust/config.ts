// Trusted Sources Fallback Configuration
export const TRUST_CONFIG = {
  // Enable trusted sources fallback
  ENABLED: process.env.TRUST_ENABLED === "true",
  
  // Trigger: no_answer | always | fallback
  TRIGGER: process.env.TRUST_TRIGGER || "fallback",
  
  // Trusted sources (in priority)
  SOURCES: (process.env.TRUST_SOURCES || "schemaorg,wikipedia,w3c,mdn").split(","),
  
  // schema.org
  SCHEMA_ORG_URL: process.env.SCHEMA_ORG_URL || "https://schema.org",
  SCHEMA_ORG_API: process.env.SCHEMA_ORG_API || "https://schema.org/docs-tree.jsonld",
  
  // Wikipedia
  WIKIPEDIA_API: "https://en.wikipedia.org/w/api.php",
  
  // W3C
  W3C_URL: "https://www.w3.org",
  W3C_TAW: "https://www.w3.org/TR/",
  
  // MDN
  MDN_URL: "https://developer.mozilla.org",
  
  // Timeout per source (ms)
  TIMEOUT: parseInt(process.env.TRUST_TIMEOUT || "3000")
}
