// Trusted Sources Search
import { TRUST_CONFIG } from "./config"

export interface TrustResult {
  source: string
  title: string
  url: string
  content: string
}

export async function searchTrusted(query: string): Promise<TrustResult[]> {
  const results: TrustResult[] = []
  
  for (const source of TRUST_CONFIG.SOURCES) {
    try {
      const result = await searchSource(source, query)
      if (result) results.push(result)
    } catch (e) {
      console.error(`Trust source ${source} failed:`, e)
    }
  }
  
  return results
}

async function searchSource(source: string, query: string): Promise<TrustResult | null> {
  switch (source) {
    case "schemaorg":
      return searchSchemaOrg(query)
    case "wikipedia":
      return searchWikipedia(query)
    case "w3c":
      return searchW3C(query)
    case "mdn":
      return searchMDN(query)
    default:
      return null
  }
}

async function searchSchemaOrg(query: string): Promise<TrustResult | null> {
  try {
    // Search schema.org types
    const url = `${TRUST_CONFIG.SCHEMA_ORG_URL}/search?q=${encodeURIComponent(query)}`
    const res = await fetch(url, { signal: AbortSignal.timeout(TRUST_CONFIG.TIMEOUT) })
    const html = await res.text()
    
    // Extract relevant content
    const titleMatch = html.match(/<title>([^<]+)<\/title>/)
    const descMatch = html.match(/<p[^>]*class="[^"]*description[^"]*"[^>]*>([^<]+)<\/p>/)
    
    return {
      source: "schema.org",
      title: titleMatch?.[1] || query,
      url: url,
      content: descMatch?.[1] || html.substring(0, 500)
    }
  } catch {
    return null
  }
}

async function searchWikipedia(query: string): Promise<TrustResult | null> {
  try {
    const url = `${TRUST_CONFIG.WIKIPEDIA_API}?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`
    const res = await fetch(url, { signal: AbortSignal.timeout(TRUST_CONFIG.TIMEOUT) })
    const data = await res.json()
    
    const page = data.query?.search?.[0]
    if (!page) return null
    
    return {
      source: "Wikipedia",
      title: page.title,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title)}`,
      content: page.snippet.replace(/<[^>]+>/g, "")
    }
  } catch {
    return null
  }
}

async function searchW3C(query: string): Promise<TrustResult | null> {
  try {
    // Search W3C specs
    const url = `${TRUST_CONFIG.W3C_URL}/TR/?q=${encodeURIComponent(query)}`
    const res = await fetch(url, { signal: AbortSignal.timeout(TRUST_CONFIG.TIMEOUT) })
    const html = await res.text()
    
    return {
      source: "W3C",
      title: "W3C Specifications",
      url: url,
      content: html.substring(0, 500)
    }
  } catch {
    return null
  }
}

async function searchMDN(query: string): Promise<TrustResult | null> {
  try {
    const url = `${TRUST_CONFIG.MDN_URL}/en-US/search?q=${encodeURIComponent(query)}`
    const res = await fetch(url, { signal: AbortSignal.timeout(TRUST_CONFIG.TIMEOUT) })
    const html = await res.text()
    
    return {
      source: "MDN",
      title: "MDN Web Docs",
      url: url,
      content: html.substring(0, 500)
    }
  } catch {
    return null
  }
}

export { TRUST_CONFIG }
