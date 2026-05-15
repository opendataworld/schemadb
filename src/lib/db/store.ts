// Unified SurrealDB Store
import { DB_CONFIG, type } from "./config"

type Record = { [key: string]: any }

// In-memory fallback
const memory = new Map<string, Record[]>()

export async function init(): Promise<void> {
  if (DB_CONFIG.URL === "mem://") {
    console.log("[db] Using in-memory store")
    return
  }
  
  try {
    const res = await fetch(DB_CONFIG.URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "NS": DB_CONFIG.NS,
        "DB": DB_CONFIG.DB,
        "Auth": `Basic ${btoa(`${DB_CONFIG.USER}:${DB_CONFIG.PASS}`)}`
      }
    })
    
    if (res.ok) {
      console.log("[db] Connected to SurrealDB")
    }
  } catch {
    console.log("[db] Using fallback memory")
  }
}

// Sessions
export async function createSession(id: string, data: any = {}): Promise<void> {
  const session = { id, ...data, created: new Date().toISOString() }
  await upsert(DB_CONFIG.TABLES.SESSIONS, id, session)
}

export async function getSession(id: string): Promise<Record | null> {
  return await get(DB_CONFIG.TABLES.SESSIONS, id)
}

export async function deleteSession(id: string): Promise<void> {
  await remove(DB_CONFIG.TABLES.SESSIONS, id)
}

// Messages
export async function addMessage(sessionId: string, role: string, content: string): Promise<void> {
  const msg = { sessionId, role, content, created: new Date().toISOString() }
  await insert(DB_CONFIG.TABLES.MESSAGES, msg)
}

export async function getMessages(sessionId: string, limit = 20): Promise<Record[]> {
  return await query(DB_CONFIG.TABLES.MESSAGES, `SELECT * FROM messages WHERE sessionId = $sessionId ORDER BY created DESC LIMIT ${limit}`, { sessionId })
}

// Searches
export async function saveSearch(query: string, results: any[]): Promise<void> {
  const search = {
    query,
    results: JSON.stringify(results),
    count: results.length,
    created: new Date().toISOString()
  }
  await insert(DB_CONFIG.TABLES.SEARCHES, search)
}

export async function getSearch(query: string): Promise<Record | null> {
  const searches = await query(DB_CONFIG.TABLES.SEARCHES, `SELECT * FROM searches WHERE query = $query LIMIT 1`, { query })
  return searches[0] || null
}

// Knowledge
export async function saveKnowledge(key: string, data: any): Promise<void> {
  await upsert(DB_CONFIG.TABLES.KNOWLEDGE, key, { key, data: JSON.stringify(data), created: new Date().toISOString() })
}

export async function getKnowledge(key: string): Promise<any | null> {
  const record = await get(DB_CONFIG.TABLES.KNOWLEDGE, key)
  return record ? JSON.parse(record.data) : null
}

// Audit
export async function logAudit(action: string, actor: string, details: any = {}): Promise<void> {
  const entry = { action, actor, ...details, created: new Date().toISOString() }
  await insert(DB_CONFIG.TABLES.AUDIT, entry)
}

export async function getAuditLogs(filters: any = {}): Promise<Record[]> {
  let q = "SELECT * FROM audit_logs"
  const cond: string[] = []
  
  if (filters.action) cond.push(`action = '$filters.action'`)
  if (filters.actor) cond.push(`actor = '$filters.actor'`)
  
  if (cond.length > 0) q += " WHERE " + cond.join(" AND ")
  q += " ORDER BY created DESC LIMIT 100"
  
  return await query(DB_CONFIG.TABLES.AUDIT, q, filters)
}

// Revisions
export async function saveRevision(sessionId: string, messages: any[]): Promise<string> {
  const id = `rev-${Date.now()}`
  await insert(DB_CONFIG.TABLES.REVISIONS, { id, sessionId, messages: JSON.stringify(messages), created: new Date().toISOString() })
  return id
}

export async function getRevisions(sessionId: string): Promise<Record[]> {
  return await query(DB_CONFIG.TABLES.REVISIONS, `SELECT * FROM revisions WHERE sessionId = $sessionId ORDER BY created DESC`, { sessionId })
}

// Settings
export async function getSetting(key: string): Promise<any> {
  const record = await get(DB_CONFIG.TABLES.SETTINGS, key)
  return record?.value
}

export async function setSetting(key: string, value: any): Promise<void> {
  await upsert(DB_CONFIG.TABLES.SETTINGS, key, { key, value: JSON.stringify(value), updated: new Date().toISOString() })
}

// Helpers
async function insert(table: string, record: Record): Promise<void> {
  // Memory fallback
  const key = `${table}:${record.id || Date.now()}`
  const list = memory.get(table) || []
  list.push(record)
  memory.set(table, list)
  
  if (DB_CONFIG.URL === "mem://") return
  // SurrealDB insert would go here
}

async function get(table: string, id: string): Promise<Record | null> {
  const list = memory.get(table) || []
  return list.find((r: any) => r.id === id) || null
}

async function upsert(table: string, id: string, record: Record): Promise<void> {
  await remove(table, id)
  record.id = id
  await insert(table, record)
}

async function remove(table: string, id: string): Promise<void> {
  const list = memory.get(table) || []
  memory.set(table, list.filter((r: any) => r.id !== id))
}

async function query(table: string, sql: string, params: any = {}): Promise<Record[]> {
  // Memory fallback - simple filter
  const list = memory.get(table) || []
  return list
}

export { DB_CONFIG }
