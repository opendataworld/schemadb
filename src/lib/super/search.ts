// Super Search - unified multi-source search
import { SUPER_CONFIG } from "./config"

export interface SuperResult {
  source: string
  sourceName: string
  url: string
  title: string
  content: string
  trust: number
  type: "trust" | "web"
  timestamp: string
}

// Cache
const cache = new Map<string, { results: SuperResult[]; expiry: number }>()

export async function superSearch(query: string): Promise<SuperResult[]> {
  // Check cache
  if (SUPER_CONFIG.CACHE_ENABLE) {
    const cached = cache.get(query)
    if (cached && cached.expiry > Date.now()) {
      return cached.results
    }
  }
  
  const results: SuperResult[] = []
  
  // Mode determines how many sources
  const mode = SUPER_CONFIG.MODE
  const trustCount = mode === "fast" ? 1 : mode === "deep" ? 3 : 5
  const webCount = mode === "fast" ? 0 : mode === "deep" ? 2 : 5
  
  // Search trust sources
  for (const source of SUPER_CONFIG.SOURCES.filter(s => s.enabled).slice(0, trustCount)) {
    const result = await searchSource(source, query)
    if (result) results.push(result)
  }
  
  // Search web (if not fast)
  if (webCount > 0) {
    const webResults = await searchWeb(query, webCount)
    results.push(...webResults)
  }
  
  // Cache results
  if (SUPER_CONFIG.CACHE_ENABLE) {
    cache.set(query, {
      results,
      expiry: Date.now() + SUPER_CONFIG.CACHE_TTL * 1000
    })
  }
  
  return results
}

async function searchSource(source: any, query: string): Promise<SuperResult | null> {
  const base = source.url
  
  try {
    switch (source.id) {
      case "schemaorg":
        return await searchSchemaOrg(base, query)
      case "wikipedia":
        return await searchWikipedia(base, query)
      case "w3c":
        return await searchW3C(base, query)
      case "mdn":
        return await searchMDN(base, query)
      case "google":
        return await searchGoogle(base, query)
      default:
        return null
    }
  } catch {
    return null
  }
}

async function searchSchemaOrg(base: string, query: string): Promise<SuperResult | null> {
  const url = `${base}/search?q=${encodeURIComponent(query)}`
  return {
    source: "schemaorg",
    sourceName: "schema.org",
    url,
    title: query,
    content: `schema.org: ${query}`,
    trust: 100,
    type: "trust",
    timestamp: new Date().toISOString()
  }
}

async function searchWikipedia(base: string, query: string): Promise<SuperResult | null> {
  const api = `${base}/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`
  const res = await fetch(api)
  const data = await res.json()
  const page = data.query?.search?.[0]
  if (!page) return null
  
  return {
    source: "wikipedia",
    sourceName: "Wikipedia",
    url: `${base}/wiki/${encodeURIComponent(page.title)}`,
    title: page.title,
    content: page.snippet?.replace(/<[^>]+>/g, "") || "",
    trust: 90,
    type: "trust",
    timestamp: new Date().toISOString()
  }
}

async function searchW3C(base: string, query: string): Promise<SuperResult | null> {
  const url = `${base}/TR/?q=${encodeURIComponent(query)}`
  return {
    source: "w3c",
    sourceName: "W3C",
    url,
    title: "W3C",
    content: "W3C specifications",
    trust: 95,
    type: "trust",
    timestamp: new Date().toISOString()
  }
}

async function searchMDN(base: string, query: string): Promise<SuperResult | null> {
  const url = `${base}/en-US/search?q=${encodeURIComponent(query)}`
  return {
    source: "mdn",
    sourceName: "MDN",
    url,
    title: "MDN",
    content: "MDN Web Docs",
    trust: 85,
    type: "trust",
    timestamp: new Date().toISOString()
  }
}

async function searchGoogle(base: string, query: string): Promise<SuperResult | null> {
  const url = `${base}/search?q=${encodeURIComponent(query)}`
  return {
    source: "google",
    sourceName: "Google Developers",
    url,
    title: "Google",
    content: "Google Developers",
    trust: 80,
    type: "trust",
    timestamp: new Date().toISOString()
  }
}

async function searchWeb(query: string, limit: number): Promise<SuperResult[]> {
  const results: SuperResult[] = []
  
  // DuckDuckGo
  const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&limit=${limit}`
  try {
    const res = await fetch(url)
    const data = await res.json()
    for (const r of data.RelatedTopics || []) {
      results.push({
        source: "ddg",
        sourceName: "DuckDuckGo",
        url: r.FirstURL,
        title: r.Text,
        content: r.Text,
        trust: 50,
        type: "web",
        timestamp: new Date().toISOString()
      })
    }
  } catch {}
  
  return results
}

export { SUPER_CONFIG }
