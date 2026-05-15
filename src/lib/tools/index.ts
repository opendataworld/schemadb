// Tool Registry - schemaorg-agent tools
export { expandContext, EXPAND_CONTEXT_TOOL } from "@/lib/cot/expand"

export const TOOLS = {
  expand_context: {
    name: "expand_context",
    description: "Expand context by searching schema.org, memory, and knowledge base. Use when uncertain or need more info.",
    parameters: {
      query: { type: "string", description: "The search query" },
      mode: { 
        type: "string", 
        enum: ["search", "memory", "rag", "all"],
        description: "Which tool to use" 
      }
    }
  }
}

export type Tool = keyof typeof TOOLS
