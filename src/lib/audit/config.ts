// Audit Logging Configuration
export const AUDIT_CONFIG = {
  // Enable audit logging
  ENABLED: process.env.AUDIT_ENABLED === "true",
  
  // Provider: local | elastic | splunk | none
  PROVIDER: process.env.AUDIT_PROVIDER || "local",
  
  // Where to store
  STORAGE_DIR: process.env.AUDIT_STORAGE_DIR || "./data/audit",
  
  // Retention days
  RETENTION_DAYS: parseInt(process.env.AUDIT_RETENTION_DAYS || "365"),
  
  // Events to audit
  EVENTS: (process.env.AUDIT_EVENTS || "login,logout,create,update,delete,export").split(","),
  
  // Include request details
  INCLUDE_IP: process.env.AUDIT_INCLUDE_IP !== "false",
  INCLUDE_USER_AGENT: process.env.AUDIT_INCLUDE_USER_AGENT !== "false"
}
