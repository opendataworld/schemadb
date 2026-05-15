// Chain of Thought Prompt Builder
import { COT_CONFIG } from "./config"

const COT_PREFIX = `Before answering, think step by step:

1. What is the user asking about schema.org?
2. Search my knowledge for relevant types/properties
3. Find official documentation from https://schema.org
4. Formulate the answer with sources
`

const COT_BRIEF = `Think step by step, then answer.`

export function buildPrompt(userMessage: string): string {
  if (!COT_CONFIG.ENABLED) {
    return userMessage
  }
  
  const prefix = COT_CONFIG.STYLE === "full" ? COT_PREFIX : COT_BRIEF
  return `${prefix}\n\nUser: ${userMessage}`
}

export function extractReasoning(response: string): { reasoning: string; answer: string } {
  if (!COT_CONFIG.SHOW_REASONING) {
    return { reasoning: "", answer: response }
  }
  
  // Split on "Final answer:" or similar markers
  const markers = ["Final answer:", "Answer:", "Therefore,"]
  
  for (const marker of markers) {
    const parts = response.split(marker)
    if (parts.length > 1) {
      return {
        reasoning: parts[0].trim(),
        answer: parts.slice(1).join(marker).trim()
      }
    }
  }
  
  return { reasoning: "", answer: response }
}

export { COT_CONFIG }
