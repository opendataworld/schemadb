// Chain of Thought (CoT) Configuration
export const COT_CONFIG = {
  // Enable Chain of Thought
  ENABLED: process.env.COT_ENABLED === "true",
  
  // Style: full | brief | hidden
  STYLE: process.env.COT_STYLE || "brief",
  
  // Show reasoning in response
  SHOW_REASONING: process.env.COT_SHOW_REASONING !== "false",
  
  // Max reasoning steps to display
  MAX_STEPS: parseInt(process.env.COT_MAX_STEPS || "5"),
  
  // Include source citations
  INCLUDE_CITATIONS: process.env.COT_CITATIONS !== "false"
}
