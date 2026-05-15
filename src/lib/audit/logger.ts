// Audit Logger
import { AUDIT_CONFIG } from "./config"

export type AuditEvent = {
  action: string      // login, create, update, delete
  actor: string    // user email or system
  resource: string // what was affected
  result: "success" | "failure"
  timestamp: string
  ip?: string
  userAgent?: string
  metadata?: Record<string, any>
}

const auditLog: AuditEvent[] = []

export function audit(event: Omit<AuditEvent, "timestamp">) {
  if (!AUDIT_CONFIG.ENABLED) return
  
  const entry: AuditEvent = {
    ...event,
    timestamp: new Date().toISOString()
  }
  
  if (AUDIT_CONFIG.INCLUDE_IP && entry.ip) {
    entry.ip = entry.ip
  }
  
  if (AUDIT_CONFIG.PROVIDER === "local") {
    auditLog.push(entry)
  } else {
    sendExternal(entry)
  }
}

// Convenience methods
export function logLogin(email: string, result: "success" | "failure", ip?: string) {
  audit({ action: "login", actor: email, resource: "auth", result, ip })
}

export function logLogout(email: string) {
  audit({ action: "logout", actor: email, resource: "auth", result: "success" })
}

export function logCreate(email: string, resource: string) {
  audit({ action: "create", actor: email, resource, result: "success" })
}

export function logUpdate(email: string, resource: string) {
  audit({ action: "update", actor: email, resource, result: "success" })
}

export function logDelete(email: string, resource: string) {
  audit({ action: "delete", actor: email, resource, result: "success" })
}

export function logExport(email: string, resource: string) {
  audit({ action: "export", actor: email, resource, result: "success" })
}

export function getAuditLog(): AuditEvent[] {
  return auditLog
}

async function sendExternal(event: AuditEvent) {
  // Send to SIEM
}

export { AUDIT_CONFIG }
