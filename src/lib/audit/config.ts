// Audit Logging Configuration
export const AUDIT_CONFIG = {
  // Enable audit logging
  ENABLED: process.env.AUDIT_ENABLED === "true",
  
  // Provider: local | surreal
  PROVIDER: process.env.AUDIT_PROVIDER || "local",
  
  // SurrealDB for persistent audit logs
  SURREAL_URL: process.env.SURREAL_URL || "mem://",
  SURREAL_USER: process.env.SURREAL_USER || "root",
  SURREAL_PASS: process.env.SURREAL_PASS || "root",
  AUDIT_NS: process.env.AUDIT_NS || "schemaorg",
  AUDIT_DB: process.env.AUDIT_DB || "audit",
  
  // Table
  AUDIT_TABLE: "audit_logs",
  
  // Retention days
  RETENTION_DAYS: parseInt(process.env.AUDIT_RETENTION_DAYS || "365"),
  
  // Events to audit
  EVENTS: (process.env.AUDIT_EVENTS || "login,logout,create,update,delete,export").split(","),
  
  // Include request details
  INCLUDE_IP: process.env.AUDIT_INCLUDE_IP !== "false",
  INCLUDE_USER_AGENT: process.env.AUDIT_INCLUDE_USER_AGENT !== "false"
}
