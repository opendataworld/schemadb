// Expand Context Tool - combines search + memory + rag
import { LOOP_CONFIG } from "./loop"

export interface ExpandTool {
  name: "expandContext"
  description: "Expand context by searching, retrieving memory, and fetching knowledge. Use when: uncertain, need more context, or low confidence."
  parameters: {
    query: string
    mode?: "search" | "memory" | "rag" | "all"
  }
}

// The EXPAND CONTEXT tool
export async function expandContext(
  query: string,
  mode: "search" | "memory" | "rag" | "all" = "all"
): Promise<{ context: string; sources: string[]; confidence: number }> {
  const sources: string[] = []
  const contextParts: string[] = []
  
  const shouldSearch = mode === "search" || mode === "all"
  const shouldMemory = mode === "memory" || mode === "all"
  const shouldRag = mode === "rag" || mode === "all"
  
  // Tool 1: Search (super sources)
  if (shouldSearch) {
    const { superSearch } = await import("@/lib/super/search")
    const results = await superSearch(query)
    contextParts.push(...results.map(r => r.content))
    sources.push(...results.map(r => r.sourceName))
  }
  
  // Tool 2: Memory (session history)
  if (shouldMemory) {
    try {
      const { getMessages } = await import("@/lib/memory/store")
      const msgs = await getMessages("current", 5)
      contextParts.push(...msgs.map(m => m.content))
      sources.push("memory")
    } catch {}
  }
  
  // Tool 3: RAG (knowledge base)
  if (shouldRag) {
    try {
      const { retrieve } = await import("@/lib/rag/retrieve")
      const docs = await retrieve(query)
      contextParts.push(...docs.map(d => d.content))
      sources.push("knowledge")
    } catch {}
  }
  
  // Calculate confidence
  const confidence = calculateConfidence(contextParts, sources)
  
  return {
    context: contextParts.join("\n\n"),
    sources,
    confidence
  }
}

function calculateConfidence(parts: string[], sources: string[]): number {
  let score = 0.3
  
  if (parts.length > 0) score += 0.2
  if (sources.length > 0) score += 0.2
  if (sources.includes("schema.org")) score += 0.2
  if (parts.some(p => p.length > 50)) score += 0.1
  
  return Math.min(score, 1.0)
}

// Export as LLM tool
export const EXPAND_CONTEXT_TOOL = {
  name: "expand_context",
  description: expandContext.toString(),
  parameters: {
    type: "object",
    properties: {
      query: { type: "string" },
      mode: { type: "string", enum: ["search", "memory", "rag", "all"] }
    },
    required: ["query"]
  }
}
