// Web Search Fallback
import { SEARCH_CONFIG } from "./config"

export interface SearchResult {
  title: string
  url: string
  snippet: string
}

export type SearchQuery = {
  query: string
  reason?: string  // Why search triggered
}

export async function searchFallback(query: SearchQuery): Promise<SearchResult[]> {
  if (!SEARCH_CONFIG.ENABLED) return []
  
  const results: SearchResult[] = []
  
  // Try each provider in order
  for (const provider of SEARCH_CONFIG.PROVIDERS) {
    try {
      const providerResults = await searchWithProvider(provider, query.query)
      if (providerResults.length > 0) {
        results.push(...providerResults)
        break
      }
    } catch (e) {
      console.error(`Search provider ${provider} failed:`, e)
    }
  }
  
  return results.slice(0, SEARCH_CONFIG.MAX_RESULTS)
}

async function searchWithProvider(provider: string, query: string): Promise<SearchResult[]> {
  switch (provider) {
    case "tavily":
      return searchTavily(query)
    case "ddg":
      return searchDDG(query)
    case "google":
      return searchGoogle(query)
    default:
      return []
  }
}

async function searchTavily(query: string): Promise<SearchResult[]> {
  if (!SEARCH_CONFIG.TAVILY_KEY) return []
  
  // Use our tavily tool
  const res = await fetch(`https://api.tavily.com/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: SEARCH_CONFIG.TAVILY_KEY,
      query,
      max_results: SEARCH_CONFIG.MAX_RESULTS
    })
  })
  
  const data = await res.json()
  return (data.results || []).map((r: any) => ({
    title: r.title,
    url: r.url,
    snippet: r.content
  }))
}

async function searchDDG(query: string): Promise<SearchResult[]> {
  if (!SEARCH_CONFIG.DDG_ENABLED) return []
  
  const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`
  const res = await fetch(url)
  const data = await res.json()
  
  return (data.RelatedTopics || []).slice(0, SEARCH_CONFIG.MAX_RESULTS).map((r: any) => ({
    title: r.Text,
    url: r.FirstURL,
    snippet: r.Text
  }))
}

async function searchGoogle(query: string): Promise<SearchResult[]> {
  if (!SEARCH_CONFIG.GOOGLE_KEY) return []
  
  const url = `https://www.googleapis.com/customsearch/v1?key=${SEARCH_CONFIG.GOOGLE_KEY}&cx=partner-search&q=${encodeURIComponent(query)}`
  const res = await fetch(url)
  const data = await res.json()
  
  return (data.items || []).slice(0, SEARCH_CONFIG.MAX_RESULTS).map((r: any) => ({
    title: r.title,
    url: r.link,
    snippet: r.snippet
  }))
}

export { SEARCH_CONFIG }
