// Permission checker
import { IAM_CONFIG } from "./config"

export type Role = "admin" | "moderator" | "user" | "guest"

export function getRole(email: string): Role {
  if (IAM_CONFIG.ADMIN_EMAILS.includes(email)) return "admin"
  if (IAM_CONFIG.MODERATOR_EMAILS.includes(email)) return "moderator"
  return "user"
}

export function canEdit(email: string): boolean {
  const role = getRole(email)
  return role === "admin" || role === "moderator"
}

export function isAdmin(email: string): boolean {
  return getRole(email) === "admin"
}

export { IAM_CONFIG }
