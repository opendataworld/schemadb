// Reply Rollback Manager
import { ROLLBACK_CONFIG } from "./config"

export type Revision = {
  id: string
  sessionId: string
  messages: { role: string; content: string }[]
  timestamp: string
  label?: string
}

const revisions = new Map<string, Revision[]>()

export function saveRevision(sessionId: string, messages: any[], label?: string): string {
  if (!ROLLBACK_CONFIG.ENABLED) return ""
  
  const id = `rev-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const revision: Revision = {
    id,
    sessionId,
    messages: [...messages],
    timestamp: new Date().toISOString(),
    label
  }
  
  const sessionRevisions = revisions.get(sessionId) || []
  sessionRevisions.push(revision)
  
  // Keep only MAX_HISTORY_DEPTH revisions
  while (sessionRevisions.length > ROLLBACK_CONFIG.MAX_HISTORY_DEPTH) {
    sessionRevisions.shift()
  }
  
  revisions.set(sessionId, sessionRevisions)
  return id
}

export function getRevisions(sessionId: string): Revision[] {
  return revisions.get(sessionId) || []
}

export function rollback(sessionId: string, revisionId: string): any[] | null {
  const sessionRevisions = revisions.get(sessionId) || []
  const revision = sessionRevisions.find(r => r.id === revisionId)
  
  if (!revision) return null
  
  // Remove this and all newer revisions
  const index = sessionRevisions.indexOf(revision)
  sessionRevisions.splice(index)
  
  return revision.messages
}

export function deleteRevision(sessionId: string, revisionId: string): boolean {
  const sessionRevisions = revisions.get(sessionId) || []
  const index = sessionRevisions.findIndex(r => r.id === revisionId)
  
  if (index === -1) return false
  
  sessionRevisions.splice(index, 1)
  return true
}

export { ROLLBACK_CONFIG }
