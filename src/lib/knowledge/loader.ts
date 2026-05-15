// Knowledge Loader - fetches schema.org documentation
import { KNOWLEDGE_CONFIG } from "./config"

export async function loadKnowledge() {
  const knowledge = []
  
  for (const source of KNOWLEDGE_CONFIG.SOURCES) {
    try {
      const response = await fetch(source.url)
      const text = await response.text()
      knowledge.push({
        name: source.name,
        url: source.url,
        content: text.substring(0, 10000) // First 10k chars
      })
    } catch (error) {
      console.error(`Failed to load ${source.name}:`, error)
    }
  }
  
  return knowledge
}

export { KNOWLEDGE_CONFIG }
