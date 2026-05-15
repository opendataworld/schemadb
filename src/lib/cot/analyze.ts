// CoT Analysis - extract reasoning from LLM response
import { COT_CONFIG } from "./config"

export interface ReasoningStep {
  step: number
  thought: string
  source?: string
  confidence?: number
}

export interface ChainOfThought {
  steps: ReasoningStep[]
  finalAnswer: string
  sources: string[]
}

export function analyze(response: string): ChainOfThought {
  const lines = response.split("\n").filter(l => l.trim())
  const steps: ReasoningStep[] = []
  let currentStep = 0
  let finalAnswer = ""
  const sources: string[] = []
  
  for (const line of lines) {
    // Detect step markers (1., 2., Step X:)
    const stepMatch = line.match(/^(\d+)[\.\)]\s*(.+)/)
    const stepHeader = line.match(/^Step\s+(\d+)[:\s]+(.+)/i)
    
    if (stepMatch) {
      currentStep = parseInt(stepMatch[1])
      steps.push({ step: currentStep, thought: stepMatch[2] })
    } else if (stepHeader) {
      currentStep = parseInt(stepHeader[1])
      steps.push({ step: currentStep, thought: stepHeader[2] })
    }
    
    // Detect final answer
    if (line.match(/^(answer|final|result)[:\s]/i)) {
      finalAnswer = line.replace(/^(answer|final|result)[:\s]*/i, "").trim()
    }
    
    // Detect sources (https://schema.org, Wikipedia, etc.)
    const urlMatches = line.match(/https?:\/\/[^\s]+/g)
    if (urlMatches) {
      sources.push(...urlMatches)
    }
  }
  
  // If no answer found, use last content as answer
  if (!finalAnswer && lines.length > 0) {
    finalAnswer = lines[lines.length - 1]
  }
  
  return { steps, finalAnswer, sources }
}

export function isComplete(cot: ChainOfThought): boolean {
  return cot.steps.length > 0 && cot.finalAnswer.length > 0
}

export { COT_CONFIG }
