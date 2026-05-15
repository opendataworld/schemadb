// SurrealDB store with vector embeddings for semantic search + web search

import { Surreal } from "surrealdb"
import { pipeline, env } from "@xenova/transformers"

// Web search using Tavily API
const TAVILY_API_KEY = process.env.TAVILY_API_KEY

export async function webSearch(query: string): Promise<Array<{ title: string; url: string; content: string }>> {
  if (!TAVILY_API_KEY) {
    // Fallback: use duckduckgo HTML scrape
    const response = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`)
    const html = await response.text()
    // Simple regex to extract results (basic approach)
    const results: Array<{ title: string; url: string; content: string }> = []
    const regex = /<a class="result__a" href="([^"]*)"[^>]*>([^<]*)<\/a>[\s\S]*?<a class="result__snippet"[^>]*>([^<]*)/g
    let match
    while ((match = regex.exec(html)) !== null && results.length < 3) {
      results.push({
        title: match[2],
        url: match[1],
        content: match[3] || "",
      })
    }
    return results
  }
  
  // Use Tavily API
  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, api_key: TAVILY_API_KEY }),
  })
  const data = await response.json() as { results: Array<{ title: string; url: string; content: string }> }
  return data.results?.slice(0, 3) || []
}

// Skip local model validation for initial build
env.allowLocalModels = false
env.useBrowserCache = false

const SURREAL_URL = process.env.SURREAL_URL || "rocksdb://chat.db"

let db: Surreal | null = null
let embeddingPipeline: Promise<any> | null = null
let chatPipeline: Promise<any> | null = null

async function getDb() {
  if (!db || !db.isConnected) {
    db = new Surreal()
    await db.connect(SURREAL_URL, {
      namespace: "schema_agent",
      database: "chat",
    })
  }
  return db
}

// Generate embedding using Hugging Face Transformers.js
async function getEmbedding(text: string): Promise<number[]> {
  if (!embeddingPipeline) {
    embeddingPipeline = pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2")
  }
  
  const extractor = await embeddingPipeline
  const output = await extractor(text, { pooling: "mean", normalize: true })
  return Array.from(output.data)
}

// Local model selection via env
const LOCAL_MODEL = process.env.LOCAL_MODEL || "tinyllama"

// Generate text using Transformers.js
export async function generateText(prompt: string, options?: { maxNewTokens?: number }): Promise<string> {
  if (!chatPipeline) {
    const modelId = LOCAL_MODEL === "qwen" 
      ? "onnx-community/Qwen2-0.6B-ONNX"  // Qwen2-0.6B
      : "Xenova/TinyLlama-1.1B-Chat-v1.0" // TinyLlama 1.1B
    
    chatPipeline = pipeline("text-generation", modelId)
  }
  
  const generator = await chatPipeline
  const output = await generator(prompt, {
    max_new_tokens: options?.maxNewTokens || 128,
    temperature: 0.7,
    top_p: 0.9,
  })
  
  // Extract generated text (remove prompt)
  const generated = output[0].generated_text
  return generated.slice(prompt.length).trim()
}

// Cosine similarity between two vectors
function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0)
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0))
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0))
  return dotProduct / (magA * magB)
}

export async function createUser(userId: string, email?: string, name?: string, image?: string) {
  const database = await getDb()
  await database.query(`CREATE user:${userId} SET email = $email, name = $name, image = $image, createdAt = $createdAt`, {
    email,
    name,
    image,
    createdAt: new Date().toISOString(),
  })
}

export async function getUserByEmail(email: string) {
  const database = await getDb()
  const result = await database.query("SELECT * FROM user")
  const users = result[0] as Array<{ email: string }>
  return users?.find((u) => u.email === email)
}

export async function createSession(sessionId: string, userId: string) {
  const database = await getDb()
  await database.query(`CREATE session:${sessionId} SET userId = $userId, messages = [], createdAt = $createdAt`, {
    userId,
    createdAt: new Date().toISOString(),
  })
}

export async function endSession(sessionId: string) {
  const database = await getDb()
  const result = await database.query("SELECT * FROM session")
  const sessions = result[0] as Array<{ sessionId: string; id: string }>
  const session = sessions?.find((s) => s.sessionId === sessionId)
  if (session) {
    await database.query(`UPDATE session SET endedAt = $endedAt WHERE id = $id`, {
      id: session.id,
      endedAt: new Date().toISOString(),
    })
  }
}

export async function saveMessage(sessionId: string, message: { role: string; content: string; attachments?: unknown[] }) {
  const database = await getDb()
  const result = await database.query("SELECT * FROM session")
  const sessions = result[0] as Array<{ sessionId: string; id: string; messages?: unknown[] }>
  const session = sessions?.find((s) => s.sessionId === sessionId)
  if (session) {
    const messages = (session.messages as unknown[]) || []
    messages.push({ ...message, timestamp: new Date().toISOString() })
    await database.query(`UPDATE session SET messages = $messages WHERE id = $id`, {
      id: session.id,
      messages,
    })
  }
}

export async function getChatHistory(sessionId: string, limit = 20) {
  const database = await getDb()
  const result = await database.query("SELECT * FROM session")
  const sessions = result[0] as Array<{ sessionId: string; messages?: unknown[] }>
  const session = sessions?.find((s) => s.sessionId === sessionId)
  const messages = (session?.messages as Array<{ role: string; content: string }>) || []
  return messages.slice(-limit)
}