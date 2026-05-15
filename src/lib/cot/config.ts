// Chain of Thought (CoT) Configuration
export const COT_CONFIG = {
  ENABLED: process.env.COT_ENABLED === "true",
  
  // Style: zero_shot | few_shot | auto | hidden
  // zero_shot: "Let's think step by step"
  // few_shot: Include example reasoning
  // auto: Model decides
  STYLE: process.env.COT_STYLE || "zero_shot",
  
  // Show reasoning in response
  SHOW_REASONING: process.env.COT_SHOW_REASONING !== "false",
  
  // Max reasoning steps
  MAX_STEPS: parseInt(process.env.COT_MAX_STEPS || "5"),
  
  // Include source citations
  INCLUDE_CITATIONS: process.env.COT_CITATIONS !== "false"
}
EOF

// Standard CoT prompts (research-backed)
const COT_ZERO_SHOT = "Let's think step by step."

const COT_FEW_SHOT = `Question: What is Person?
Let's think step by step.
1. Person is a Thing (most generic type)
2. Person represents a human being
3. Properties: name, url, image
Answer: Person is a type representing a human being.

Question: What is CreativeWork?
Let's think step by step.
1. CreativeWork is a Thing
2. CreativeWork is a CreativeWork
3. Properties: name, description, author
Answer: CreativeWork is a type representing creative works.`
