// Chain of Thought - Control Flow
import { COT_CONFIG } from "./config"

export type FlowNode = {
  id: string
  type: "think" | "search" | "branch" | "loop" | "answer"
  condition?: string
  steps?: FlowNode[]
  content?: string
}

export interface FlowContext {
  query: string
  steps: string[]
  sources: string[]
  branches: Map<string, boolean>
  loopCount: number
}

// Build control flow
export function buildFlow(userQuery: string): FlowNode {
  const hasCondition = /if|when|unless|while/i.test(userQuery)
  const hasSearch = /search|find|lookup|look up/i.test(userQuery)
  const isComplex = userQuery.length > 100
  
  if (isComplex) {
    return {
      id: "root",
      type: "branch",
      condition: "complex_query",
      steps: [
        { id: "analyze", type: "think", content: userQuery },
        { id: "search", type: "search", content: userQuery },
        { id: "synthesize", type: "think", content: "Combine findings" },
        { id: "final", type: "answer", content: "Final answer" }
      ]
    }
  }
  
  if (hasCondition) {
    return {
      id: "root",
      type: "branch",
      condition: "conditional",
      steps: [
        { id: "evaluate", type: "think", content: "Evaluate condition" },
        { id: "branch", type: "branch", content: "if true: answer, if false: explain" },
        { id: "final", type: "answer", content: "Answer" }
      ]
    }
  }
  
  if (hasSearch) {
    return {
      id: "root",
      type: "loop",
      condition: "until found",
      steps: [
        { id: "search", type: "search", content: userQuery },
        { id: "found?", type: "branch", condition: "found", steps: [
          { id: "answer", type: "answer" }
        ]},
        { id: "retry", type: "loop", condition: "max 3" }
      ]
    }
  }
  
  // Simple: think → answer
  return {
    id: "root",
    type: "think",
    steps: [
      { id: "think", type: "think", content: userQuery },
      { id: "answer", type: "answer", content: "Answer" }
    ]
  }
}

// Execute flow
export async function executeFlow(
  node: FlowNode,
  context: FlowContext,
  executor: (node: FlowNode) => Promise<string>
): Promise<string> {
  switch (node.type) {
    case "think":
      context.steps.push(node.content || "")
      return await executor(node)
    
    case "search":
      const result = await executor(node)
      context.sources.push(result)
      return result
    
    case "branch":
      if (node.condition === "conditional") {
        const eval = await executor(node.steps?.[0]!)
        return eval.includes("true") 
          ? await executeFlow(node.steps?.[1]!, context, executor)
          : "Condition not met"
      }
      return await executor(node)
    
    case "loop":
      let iterations = 0
      while (iterations < COT_CONFIG.MAX_STEPS) {
        const result = await executor(node)
        if (result) return result
        iterations++
        context.loopCount++
      }
      return "Max iterations reached"
    
    case "answer":
      return context.steps.join("\n")
  }
  
  return ""
}

export { COT_CONFIG }
