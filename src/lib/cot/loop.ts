// CoT Loop - Expanded Context with Tools
import { COT_CONFIG } from "./config"

export const LOOP_CONFIG = {
  // Enable loop until found
  ENABLE_LOOP: process.env.COT_LOOP_ENABLE === "true",
  
  // Max iterations
  MAX_ITERATIONS: parseInt(process.env.COT_LOOP_MAX || "5"),
  
  // Tools available in loop
  TOOLS: (process.env.COT_LOOP_TOOLS || "search,memory,rag").split(","),
  
  // Use memory for context expansion
  USE_MEMORY: process.env.COT_LOOP_MEMORY !== "false",
  
  // Expand context from knowledge base
  USE_RAG: process.env.COT_LOOP_RAG !== "false",
  
  // Search sources
  SEARCH_SOURCES: (process.env.COT_LOOP_SOURCES || "schemaorg,super,trust").split(","),
  
  // Continue until confidence threshold
  CONFIDENCE_THRESHOLD: parseFloat(process.env.COT_LOOP_CONFIDENCE || "0.8"),
  
  // Stop on no new info
  STOP_ON_NO_NEW: process.env.COT_LOOP_STOP_NO_NEW !== "false"
}

// Execute loop until found
export async function* loopUntilFound(
  query: string,
  context: { sources: string[]; confidence: number }
): AsyncGenerator<{ iteration: number; result: string; confidence: number; done: boolean }> {
  let iteration = 0
  let lastResult = ""
  let hasNewInfo = true
  
  while (iteration < LOOP_CONFIG.MAX_ITERATIONS) {
    // Execute iteration
    const result = await executeIteration(query, context, iteration)
    lastResult = result.content
    
    // Calculate confidence
    const confidence = calculateConfidence(result)
    context.confidence = confidence
    
    // Check if done
    const done = confidence >= LOOP_CONFIG.CONFIDENCE_THRESHOLD || 
               (!LOOP_CONFIG.STOP_ON_NO_NEW && !hasNewInfo)
    
    yield {
      iteration: iteration + 1,
      result: result.content,
      confidence,
      done
    }
    
    if (done) break
    
    // Expand context
    if (LOOP_CONFIG.USE_MEMORY && result.memories) {
      context.sources.push(...result.memories)
    }
    if (LOOP_CONFIG.USE_RAG && result.knowledge) {
      context.sources.push(...result.knowledge)
    }
    
    iteration++
    
    // Check for new info
    hasNewInfo = result.content !== lastResult
  }
}

// Execute single iteration with tools
async function executeIteration(
  query: string,
  context: { sources: string[] },
  iteration: number
): Promise<{ content: string; memories?: string[]; knowledge?: string[] }> {
  let content = ""
  const memories: string[] = []
  const knowledge: string[] = []
  
  for (const tool of LOOP_CONFIG.TOOLS) {
    switch (tool) {
      case "search":
        // Search super sources
        const { superSearch } = await import("@/lib/super/search")
        const results = await superSearch(query)
        content += results.map(r => r.content).join("\n")
        break
        
      case "memory":
        // Get from memory
        const { getSession } = await import("@/lib/memory/store")
        const session = await getSession("current")
        if (session?.messages) {
          memories.push(...session.messages.slice(-5))
        }
        break
        
      case "rag":
        // Get from knowledge base
        const { retrieveKnowledge } = await import("@/lib/rag/retrieve")
        const docs = await retrieveKnowledge(query)
        knowledge.push(...docs.map(d => d.content))
        break
    }
  }
  
  return { content, memories, knowledge }
}

function calculateConfidence(result: { content: string; sources: string[] }): number {
  // Simple confidence based on content quality
  let score = 0.5
  
  if (result.content.length > 100) score += 0.2
  if (result.sources.length > 0) score += 0.1
  if (result.content.includes("schema.org")) score += 0.1
  if (/https?:\/\//.test(result.content)) score += 0.1
  
  return Math.min(score, 1.0)
}

export { LOOP_CONFIG }
