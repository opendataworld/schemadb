// Search Result Footer - citation formatter
import { SuperResult } from "@/lib/super/search"

export interface Citation {
  index: number
  source: string
  url: string
  title: string
}

export function formatFooter(results: SuperResult[]): string {
  if (results.length === 0) return ""
  
  const citations = results.map((r, i) => ({
    index: i + 1,
    source: r.sourceName,
    url: r.url,
    title: r.title
  }))
  
  let footer = "\n\n---\n**Sources:**\n"
  
  for (const c of citations) {
    footer += `[${c.index}]: ${c.source} - ${c.title}\n  - ${c.url}\n`
  }
  
  footer += "\n*Generated with schema.org Q&A Agent*"
  
  return footer
}

export function formatInline(results: SuperResult[]): string {
  if (results.length === 0) return ""
  
  const sources = results.map(r => `[${r.sourceName}](${r.url})`).join(", ")
  
  return `\n\n**Sources:** ${sources}`
}

export function getTrustedCitations(results: SuperResult[]): Citation[] {
  return results
    .filter(r => r.type === "trust")
    .map((r, i) => ({
      index: i + 1,
      source: r.sourceName,
      url: r.url,
      title: r.title
    }))
}
