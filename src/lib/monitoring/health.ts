// Health Check API
import { MONITOR_CONFIG } from "./config"

export interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy"
  timestamp: string
  checks: {
    llm: "ok" | "error"
    memory: "ok" | "error"
    knowledge: "ok" | "error"
  }
}

export async function checkHealth(): Promise<HealthStatus> {
  const checks = {
    llm: "ok" as const,
    memory: "ok" as const,
    knowledge: "ok" as const
  }
  
  // Check LLM availability
  try {
    const res = await fetch("http://localhost:11434/api/tags", { 
      method: "GET",
      signal: AbortSignal.timeout(2000)
    })
    if (!res.ok) checks.llm = "error"
  } catch {
    checks.llm = "error"
  }
  
  // Check memory (in-memory is always ok)
  
  // Check knowledge base
  try {
    const res = await fetch("https://schema.org/docs-tree.jsonld", {
      method: "HEAD",
      signal: AbortSignal.timeout(5000)
    })
    if (!res.ok) checks.knowledge = "error"
  } catch {
    checks.knowledge = "error"
  }
  
  const status: HealthStatus = {
    status: checks.llm === "error" ? "degraded" : "healthy",
    timestamp: new Date().toISOString(),
    checks
  }
  
  return status
}
