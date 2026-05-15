// Unified Fallback Search
import { FALLBACK_CONFIG } from "./config"

export interface FallbackResult {
  source: string
  title: string
  url: string
  content: string
  type: "trust" | "web"
}

export async function searchFallback(query: string): Promise<FallbackResult[]> {
  const results: FallbackResult[] = []
  
  // Try trust sources first
  if (FALLBACK_CONFIG.GROUPS.includes("trust")) {
    const trustResults = await searchTrust(query)
    results.push(...trustResults)
  }
  
  // Then web search
  if (FALLBACK_CONFIG.GROUPS.includes("web")) {
    const webResults = await searchWeb(query)
    results.push(...webResults)
  }
  
  return results.slice(0, FALLBACK_CONFIG.MAX_RESULTS)
}

async function searchTrust(query: string): Promise<FallbackResult[]> {
  const results: FallbackResult[] = []
  
  for (const source of FALLBACK_CONFIG.TRUST_SOURCES) {
    try {
      const result = await fetchTrustSource(source, query)
      if (result) results.push(result)
    } catch {}
  }
  
  return results
}

async function fetchTrustSource(source: string, query: string): Promise<FallbackResult | null> {
  switch (source) {
    case "schemaorg":
      return fetchSchemaOrg(query)
    case "wikipedia":
      return fetchWikipedia(query)
    case "w3c":
      return fetchW3C(query)
    case "mdn":
      return fetchMDN(query)
    default:
      return null
  }
}

async function fetchSchemaOrg(query: string): Promise<FallbackResult | null> {
  const base = "https://schema.org"
  const url = `${base}/search?q=${encodeURIComponent(query)}`
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(3000) })
    return { source: "schema.org", title: query, url, content: "schema.org", type: "trust" }
  } catch { return null }
}

async function fetchWikipedia(query: string): Promise<FallbackResult | null> {
  const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`
  try {
    const res = await fetch(url)
    const data = await res.json()
    const page = data.query?.search?.[0]
    if (!page) return null
    return {
      source: "Wikipedia",
      title: page.title,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title)}`,
      content: page.snippet?.replace(/<[^>]+>/g, "") || "",
      type: "trust"
    }
  } catch { return null }
}

async function fetchW3C(query: string): Promise<FallbackResult | null> {
  const url = `https://www.w3.org/TR/?q=${encodeURIComponent(query)}`
  try {
    const res = await fetch(url)
    return { source: "W3C", title: "W3C", url, content: "W3C specs", type: "trust" }
  } catch { return null }
}

async function fetchMDN(query: string): Promise<FallbackResult | null> {
  const url = `https://developer.mozilla.org/en-US/search?q=${encodeURIComponent(query)}`
  try {
    const res = await fetch(url)
    return { source: "MDN", title: "MDN", url, content: "MDN Web Docs", type: "trust" }
  } catch { return null }
}

async function searchWeb(query: string): Promise<FallbackResult[]> {
  const results: FallbackResult[] = []
  
  // DuckDuckGo (free)
  try {
    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&limit=3`
    const res = await fetch(url)
    const data = await res.json()
    for (const r of data.RelatedTopics || []) {
      results.push({
        source: "DuckDuckGo",
        title: r.Text,
        url: r.FirstURL,
        content: r.Text,
        type: "web"
      })
    }
  } catch {}
  
  return results
}

export { FALLBACK_CONFIG }
