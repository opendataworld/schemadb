// Chain of Thought (CoT) Configuration
export const COT_CONFIG = {
  ENABLED: process.env.COT_ENABLED === "true",
  STYLE: process.env.COT_STYLE || "zero_shot",
  SHOW_REASONING: process.env.COT_SHOW_REASONING !== "false",
  MAX_STEPS: parseInt(process.env.COT_MAX_STEPS || "5"),
  INCLUDE_CITATIONS: process.env.COT_CITATIONS !== "false",
  PROVIDER: process.env.COT_PROVIDER || "local",
  TABLE: "reasoning"
}

const COT_ZERO_SHOT = "Let's think step by step."
const COT_FEW_SHOT = `Question: What is Person? Let's think step by step. 1. Person is a Thing... Answer: Person represents a human being.`

export { COT_ZERO_SHOT, COT_FEW_SHOT }
