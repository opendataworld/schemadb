// APM Tracer
import { APM_CONFIG } from "./config"

const activeSpans = new Map<string, { name: string, startTime: number }>()

export function startSpan(name: string): string {
  if (!APM_CONFIG.ENABLED) return ""
  const id = `${name}-${Date.now()}`
  activeSpans.set(id, { name, startTime: Date.now() })
  return id
}

export function endSpan(id: string) {
  if (!APM_CONFIG.ENABLED || !id) return
  const span = activeSpans.get(id)
  if (!span) return
  const duration = Date.now() - span.startTime
  console.log(`[apm] ${span.name}: ${duration}ms`)
  activeSpans.delete(id)
}

export { APM_CONFIG }
