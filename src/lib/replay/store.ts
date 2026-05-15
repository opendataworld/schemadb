// Replay Store - session revision history
import { DB_CONFIG } from "@/lib/db/config"

export interface Revision {
  id: string
  sessionId: string
  messages: { role: string; content: string }[]
  created: string
  label?: string
}

export interface ReplayPoint {
  at: string
  after: number
  before: number
}

// Save revision
export async function saveReplay(sessionId: string, messages: { role: string; content: string }[], label?: string): Promise<string> {
  const id = `rev-${Date.now()}`
  const revision: Revision = {
    id,
    sessionId,
    messages,
    created: new Date().toISOString(),
    label
  }
  
  // Store via DB
  try {
    const { saveRevision } = await import("@/lib/db/store")
    return await saveRevision(sessionId, messages)
  } catch {
    // Fallback: store in memory
    const key = `replay:${sessionId}`
    const revisions = getRevisionsFromMemory(key)
    revisions.unshift(revision)
    localStorage.setItem(key, JSON.stringify(revisions.slice(0, REPLAY_CONFIG.MAX_REVISIONS)))
    return id
  }
}

// Get revisions
export async function getReplays(sessionId: string): Promise<Revision[]> {
  try {
    const { getRevisions } = await import("@/lib/db/store")
    const records = await getRevisions(sessionId)
    return records.map(r => ({
      id: r.id,
      sessionId: r.sessionId,
      messages: JSON.parse(r.messages),
      created: r.created
    }))
  } catch {
    const key = `replay:${sessionId}`
    return getRevisionsFromMemory(key)
  }
}

// Restore to revision
export async function restoreReplay(sessionId: string, revisionId: string): Promise<{ role: string; content: string }[] | null> {
  const revisions = await getReplays(sessionId)
  const revision = revisions.find(r => r.id === revisionId)
  
  if (!revision) return null
  
  // Create new revision before restore
  const currentMessages = await getCurrentMessages(sessionId)
  await saveReplay(sessionId, currentMessages, "pre-restore")
  
  return revision.messages
}

// Get current messages (placeholder)
async function getCurrentMessages(sessionId: string): Promise<{ role: string; content: string }[]> {
  try {
    const { getMessages } = await import("@/lib/db/store")
    const msgs = await getMessages(sessionId, 100)
    return msgs.map(m => ({ role: m.role, content: m.content }))
  } catch {
    return []
  }
}

// Diff two revisions
export function diffRevisions(before: Revision, after: Revision): ReplayPoint[] {
  const changes: ReplayPoint[] = []
  
  for (let i = 0; i < after.messages.length; i++) {
    const beforeMsg = before.messages[i]
    const afterMsg = after.messages[i]
    
    if (!beforeMsg || beforeMsg.content !== afterMsg.content) {
      changes.push({
        at: afterMsg.role,
        after: i,
        before: beforeMsg ? i : -1
      })
    }
  }
  
  return changes
}

// Preview revision
export async function previewReplay(sessionId: string, revisionId: string): Promise<string> {
  const revision = await getReplay(sessionId, revisionId)
  if (!revision) return "Revision not found"
  
  let preview = `**Revision ${revision.id}**\n${revision.created}\n\n`
  
  for (const msg of revision.messages.slice(-5)) {
    preview += `**${msg.role}:** ${msg.content.substring(0, 100)}...\n`
  }
  
  return preview
}

async function getReplay(sessionId: string, revisionId: string): Promise<Revision | null> {
  const revisions = await getReplays(sessionId)
  return revisions.find(r => r.id === revisionId) || null
}

function getRevisionsFromMemory(key: string): Revision[] {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]")
  } catch {
    return []
  }
}

export { REPLAY_CONFIG }
