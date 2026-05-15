// Chain of Thought Streaming Handler
import { COT_CONFIG } from "./config"
import { analyze, ChainOfThought } from "./analyze"

export interface StreamOptions {
  model: string
  messages: { role: string; content: string }[]
  onThinking?: (step: string) => void
  onSource?: (url: string) => void
}

export async function* streamWithCoT(
  providerFn: () => AsyncGenerator<string>,
  options: StreamOptions
): AsyncGenerator<string> {
  if (!COT_CONFIG.ENABLED) {
    // Direct passthrough
    for await (const chunk of providerFn()) {
      yield chunk
    }
    return
  }
  
  let buffer = ""
  
  if (COT_CONFIG.SHOW_REASONING) {
    yield "**Thinking...**\n\n"
  }
  
  // Stream from provider
  for await (const chunk of providerFn()) {
    buffer += chunk
    
    // Extract steps as they appear
    if (COT_CONFIG.SHOW_REASONING) {
      const steps = extractSteps(buffer)
      for (const step of steps) {
        yield `> Step ${step.step}: ${step.thought}\n\n`
      }
    }
    
    yield chunk
  }
  
  // Final answer with sources
  if (COT_CONFIG.INCLUDE_CITATIONS) {
    const cot = analyze(buffer)
    if (cot.sources.length > 0) {
      yield "\n\n**Sources:**\n"
      for (const src of cot.sources) {
        yield `- ${src}\n`
      }
    }
  }
}

function extractSteps(buffer: string): { step: number; thought: string }[] {
  const steps: { step: number; thought: string }[] = []
  const lines = buffer.split("\n")
  
  for (const line of lines) {
    const match = line.match(/^(\d+)[\.\)]\s*(.+)/)
    if (match) {
      steps.push({ step: parseInt(match[1]), thought: match[2] })
    }
  }
  
  return steps
}

export { COT_CONFIG }
