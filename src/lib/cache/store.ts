// SurrealDB Cache Store
import { CACHE_CONFIG } from "./config"

export interface CacheEntry<T = any> {
  id: string
  key: string
  value: T
  created: string
  expires: string
}

// In-memory fallback
const memoryCache = new Map<string, CacheEntry>()

export async function initCache(): Promise<boolean> {
  if (!CACHE_CONFIG.ENABLED) return false
  
  // If mem://, just use in-memory
  if (CACHE_CONFIG.URL === "mem://") {
    console.log("[cache] Using in-memory store")
    return true
  }
  
  // Connect to SurrealDB
  try {
    const res = await fetch(CACHE_CONFIG.URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "NS": CACHE_CONFIG.NS,
        "DB": CACHE_CONFIG.DB,
        "Auth": `Basic ${btoa(`${CACHE_CONFIG.USER}:${CACHE_CONFIG.PASS}`)}`
      }
    })
    
    if (res.ok) {
      console.log("[cache] Connected to SurrealDB")
      return true
    }
  } catch {}
  
  console.log("[cache] Using fallback memory store")
  return false
}

export async function getCache<T>(key: string): Promise<T | null> {
  // Check memory first
  const memEntry = memoryCache.get(key)
  if (memEntry && new Date(memEntry.expires) > new Date()) {
    return memEntry.value as T
  }
  
  // Check SurrealDB
  if (!CACHE_CONFIG.ENABLED || CACHE_CONFIG.URL === "mem://") {
    return null
  }
  
  try {
    const res = await fetch(`${CACHE_CONFIG.URL}/select/${CACHE_CONFIG.SEARCH_TABLE}`, {
      method: "POST",
      headers: { "NS": CACHE_CONFIG.NS, "DB": CACHE_CONFIG.DB }
    })
    
    const entries = await res.json()
    const entry = entries.find((e: any) => e.key === key)
    
    if (entry && new Date(entry.expires) > new Date()) {
      return entry.value as T
    }
  } catch {}
  
  return null
}

export async function setCache<T>(key: string, value: T, ttl?: number): Promise<void> {
  const now = new Date()
  const expires = new Date(now.getTime() + (ttl || CACHE_CONFIG.SEARCH_TTL) * 1000)
  
  const entry: CacheEntry<T> = {
    id: key,
    key,
    value,
    created: now.toISOString(),
    expires: expires.toISOString()
  }
  
  // Store in memory
  memoryCache.set(key, entry)
  
  // Store in SurrealDB
  if (!CACHE_CONFIG.ENABLED || CACHE_CONFIG.URL === "mem://") {
    return
  }
  
  try {
    await fetch(`${CACHE_CONFIG.URL}/create/${CACHE_CONFIG.SEARCH_TABLE}`, {
      method: "POST",
      headers: { "NS": CACHE_CONFIG.NS, "DB": CACHE_CONFIG.DB },
      body: JSON.stringify(entry)
    })
  } catch {}
}

export async function clearExpired(): Promise<number> {
  let cleared = 0
  const now = new Date()
  
  // Clear memory
  for (const [key, entry] of memoryCache) {
    if (new Date(entry.expires) <= now) {
      memoryCache.delete(key)
      cleared++
    }
  }
  
  return cleared
}

export { CACHE_CONFIG }
