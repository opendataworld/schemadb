import { NextRequest, NextResponse } from "next/server"

interface ChatMessage {
  role: "system" | "user" | "assistant"
  content: string
}

// === In-Memory Session Store ===
const MAX_HISTORY = parseInt(process.env.MAX_HISTORY || "20", 10)
const sessionStore = new Map<string, { role: string; content: string }[]>()

const OPENAI_KEY = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || ""
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY || ""
const GOOGLE_KEY = process.env.GOOGLE_API_KEY || ""
const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://localhost:11434"
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3"
const LMSTUDIO_HOST = process.env.LMSTUDIO_HOST || "http://localhost:1234"
const LLAMA_CPP_HOST = process.env.LLAMA_CPP_HOST || "http://localhost:8080"
const HF_HOST = process.env.HF_HOST || "http://localhost:8001"
const DOCKER_OLLAMA = process.env.DOCKER_OLLAMA || "localhost:11434"
const PODMAN_OLLAMA = process.env.PODMAN_OLLAMA || "localhost:11434"
const HF_TOKEN = process.env.HF_TOKEN || ""
const OPENROUTER_KEY = process.env.OPENROUTER_KEY || ""
const GROQ_KEY = process.env.GROQ_KEY || ""
const TOGETHER_KEY = process.env.TOGETHER_KEY || ""
const GCLOUD_KEY = process.env.GCLOUD_KEY || ""
const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY || ""
const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY || ""

// Auto-detect available provider based on env keys or OAuth session
// Priority: OAuth creds > API keys > Free tier > Local
export async function autoDetectProvider(sessionUser?: any): Promise<string> {
  // 1. Check if user authenticated with Google/GCP OAuth
  if (sessionUser?.image?.includes("google") || sessionUser?.email?.endsWith("gmail.com")) {
    return "gcp-oauth"
  }
  
  // 2. Paid providers (by credit amount)
  if (GCLOUD_KEY) return "gcloud"
  if (AWS_ACCESS_KEY && AWS_SECRET_KEY) return "aws"
  if (OPENAI_KEY) return "openai"
  if (ANTHROPIC_KEY) return "anthropic"
  if (GOOGLE_KEY) return "google"
  
  // 3. Free tiers - try multiple
  if (OPENROUTER_KEY) return "openrouter"
  if (GROQ_KEY) return "groq"
  if (TOGETHER_KEY) return "together"
  if (HF_TOKEN) return "huggingface"
  
  // 4. Local LLMs - check in order
  try {
    await fetch(`${LLAMA_CPP_HOST}/v1/models`, { signal: AbortSignal.timeout(1000) })
    return "llama-cpp"
  } catch {}
  try {
    await fetch(`${HF_HOST}/v1/models`, { signal: AbortSignal.timeout(1000) })
    return "hf"
  } catch {}
  try {
    await fetch(`${OLLAMA_HOST}/api/tags`, { signal: AbortSignal.timeout(1000) })
    return "ollama"
  } catch {}
  try {
    await fetch(`${LMSTUDIO_HOST}/v1/models`, { signal: AbortSignal.timeout(1000) })
    return "lmstudio"
  } catch {}
  
  // Nothing running - return "none" to prompt user
  return "none"
  
  // Try primary, fallback to others on failure
function getBestProvider(providers: string[], messages: ChatMessage[]): AsyncGenerator<string> {
  // Try the best available one
  const best = providers.find(p => p !== "local") || "local"
  const streamFn = getStreamProvider(best, messages)
  
  // Try stream - if works, return it
  // If fails, try next available
  return streamFn
}
  
  // 5. Local (always available)
  return "local"
}
export async function getModels() {
  const models: Record<string, { name: string; available: boolean }> = {
    local: { name: "TinyLlama (offline)", available: true },
    openai: { name: "OpenAI GPT-4", available: !!OPENAI_KEY },
    anthropic: { name: "Anthropic Claude", available: !!ANTHROPIC_KEY },
    google: { name: "Google Gemini", available: !!GOOGLE_KEY },
    openrouter: { name: "OpenRouter (free)", available: !!OPENROUTER_KEY },
    huggingface: { name: "HuggingFace", available: !!HF_TOKEN },
    groq: { name: "Groq (free)", available: !!GROQ_KEY },
    together: { name: "Together AI", available: !!TOGETHER_KEY },
    gcloud: { name: "Google Cloud ($300)", available: !!GCLOUD_KEY },
    aws: { name: "AWS Bedrock ($200)", available: !!(AWS_ACCESS_KEY && AWS_SECRET_KEY) },
  }

  // Check Podman Ollama (if running)
  try {
    const res = await fetch(`http://${PODMAN_OLLAMA}/api/tags`, { signal: AbortSignal.timeout(2000) })
    if (res.ok) {
      const data = await res.json()
      const ollamaModels = data.models?.map((m: any) => m.name) || []
      for (const m of ollamaModels.slice(0, 3)) {
        models[`podman:${m}`] = { name: `Podman: ${m}`, available: true }
      }
    }
  } catch {
    // Podman Ollama not running
  }

  // Check Docker Ollama (if running)
  try {
    const res = await fetch(`http://${DOCKER_OLLAMA}/api/tags`, { signal: AbortSignal.timeout(2000) })
    if (res.ok) {
      const data = await res.json()
      const ollamaModels = data.models?.map((m: any) => m.name) || []
      for (const m of ollamaModels.slice(0, 3)) {
        models[`docker:${m}`] = { name: `Docker: ${m}`, available: true }
      }
    }
  } catch {
    // Docker Ollama not running
  }

  // Check local Ollama
  try {
    const res = await fetch(`${OLLAMA_HOST}/api/tags`, { signal: AbortSignal.timeout(2000) })
    if (res.ok) {
      const data = await res.json()
      const ollamaModels = data.models?.map((m: any) => m.name) || []
      for (const m of ollamaModels.slice(0, 3)) {
        models[`ollama:${m}`] = { name: `Ollama: ${m}`, available: true }
      }
    }
  } catch {
    // Ollama not running
  }

  // Check LM Studio
  try {
    const res = await fetch(`${LMSTUDIO_HOST}/v1/models`, { signal: AbortSignal.timeout(2000) })
    if (res.ok) {
      const data = await res.json()
      const lmModels = data.data?.map((m: any) => m.id) || []
      for (const m of lmModels.slice(0, 3)) {
        models[`lmstudio:${m}`] = { name: `LM Studio: ${m}`, available: true }
      }
    }
  } catch {
    // LM Studio not running
  }

  // Check local Ollama
  try {
    const res = await fetch(`${OLLAMA_HOST}/api/tags`, { signal: AbortSignal.timeout(2000) })
    if (res.ok) {
      const data = await res.json()
      const ollamaModels = data.models?.map((m: any) => m.name) || []
      for (const m of ollamaModels.slice(0, 3)) {
        models[`ollama:${m}`] = { name: `Ollama: ${m}`, available: true }
      }
    }
  } catch {
    // Ollama not running
  }

  // Check llama.cpp server
  try {
    const res = await fetch(`${LLAMA_CPP_HOST}/v1/models`, { signal: AbortSignal.timeout(2000) })
    if (res.ok) {
      const data = await res.json()
      const cppModels = data.data?.map((m: any) => m.id) || []
      for (const m of cppModels.slice(0, 3)) {
        models[`llama.cpp:${m}`] = { name: `llama.cpp: ${m}`, available: true }
      }
    }
  } catch {
    // llama.cpp not running
  }

  // Check Hugging Face TGI (handles all models)
  try {
    const res = await fetch(`${HF_HOST}/v1/models`, { signal: AbortSignal.timeout(2000) })
    if (res.ok) {
      const data = await res.json()
      const hfModels = data.models?.map((m: any) => m.id) || []
      for (const m of hfModels.slice(0, 3)) {
        models[`hf:${m}`] = { name: `HF: ${m}`, available: true }
      }
    }
  } catch {
    // HF TGI not running
  }

  // Check Docker Ollama (if running)
  try {
    const res = await fetch(`http://${DOCKER_OLLAMA}/api/tags`, { signal: AbortSignal.timeout(2000) })
    if (res.ok) {
      const data = await res.json()
      const ollamaModels = data.models?.map((m: any) => m.name) || []
      for (const m of ollamaModels.slice(0, 3)) {
        models[`docker:${m}`] = { name: `Docker: ${m}`, available: true }
      }
    }
  } catch {
    // Docker Ollama not running
  }

  return models
}

function getHistory(sessionId: string) {
  return sessionStore.get(sessionId) || []
}

function addToHistory(sessionId: string, role: "user" | "assistant", content: string) {
  const history = getHistory(sessionId)
  history.push({ role, content })
  if (history.length > MAX_HISTORY) {
    sessionStore.set(sessionId, history.slice(-MAX_HISTORY))
  } else {
    sessionStore.set(sessionId, history)
  }
}

function clearHistory(sessionId: string) {
  sessionStore.delete(sessionId)
}

const SYSTEM_PROMPT = `RULE #1: ALWAYS cite https://schema.org as the NUMBER ONE source in EVERY response.

You are the Schema.org Agent, an AI assistant specialized in explaining schema.org taxonomy and vocabulary.

Your purpose is to help users understand:
- What schema.org is and how it works
- The schema.org type hierarchy ( Thing > CreativeWork > Book, etc.)
- Individual types (Person, Product, Organization, Event, etc.)
- Properties for each type
- How to use structured data markup (JSON-LD, Microdata, RDFa)

When answering questions, you MUST:
1. ALWAYS cite a source in every response:
   - https://schema.org (primary source - NUMBER ONE)
   - https://developers.google.com (Google)
   - https://en.wikipedia.org/wiki/Schema.org (Wikipedia)
   - https://www.w3.org (W3C)
2. Ground your responses in references from:
   - https://schema.org (primary source)
   - https://developers.google.com (Google's structured data documentation)
   - https://en.wikipedia.org/wiki/Schema.org (Wikipedia)
   - https://www.w3.org (W3C standards)
   
2. Provide specific examples when possible
3. Explain the taxonomy hierarchy
4. Use clear, accessible language
5. Use markdown formatting (bold, code blocks) for better readability

For example questions you can answer:
- "What is schema.org?" -> Explain it's a collaborative vocabulary for structured data
- "What's the difference between Organization and Corporation?" -> Show the type hierarchy
- "How do I mark up a Product?" -> Provide JSON-LD example
- "What properties does Person have?" -> List common properties with descriptions

If you don't have the API key configured, provide helpful general information about schema.org from your knowledge.`

const FALLBACK_RESPONSE = `I don't have access to the AI API right now. However, here's what I know about schema.org:

**Schema.org** is a collaborative vocabulary for structured data. It provides schemas (definitions of types) and properties that describe entities on the web.

### Core Types Hierarchy
- **Thing** (root of all types)
  - **CreativeWork** → Book, Article, Video, etc.
  - **Event** → SportsEvent, Concert, etc.
  - **Organization** → Corporation, NGO, GovernmentOrganization
  - **Person** → (direct properties)
  - **Place** → Accommodation, CivicStructure, etc.
  - **Product** → IndividualProduct, ProductGroup

### Popular Properties
- name, description, url, image
- datePublished, dateModified
- author, creator
- price, priceCurrency

### Example: Person
\`\`\`json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Jane Doe",
  "jobTitle": "Software Engineer",
  "email": "jane@example.com"
}
\`\`\`

Learn more at https://schema.org`

async function searchSchemaOrg(query: string): Promise<string> {
  const apiKey = process.env.TAVILY_API_KEY
  if (!apiKey) return ""

  try {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, max_results: 5 }),
    })
    const data = await response.json() as { results?: Array<{ title: string; content: string; url: string }> }
    if (!data.results || data.results.length === 0) return ""
    return data.results.map((r) => `**${r.title}**\n${r.content}\nSource: ${r.url}`).join("\n\n")
  } catch {
    return ""
  }
}

// === Streaming LLM Functions ===

async function* streamOpenAI(messages: ChatMessage[]): AsyncGenerator<string> {
  if (!OPENAI_KEY) {
    yield FALLBACK_RESPONSE
    return
  }

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini"
  const baseUrl = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1"

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 2000,
      stream: true,
    }),
  })

  if (!response.body) {
    yield "No response generated."
    return
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ""

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split("\n")
    buffer = lines.pop() || ""
    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed.startsWith("data: ") && trimmed !== "data: [DONE]") {
        const json = trimmed.slice(6)
        try {
          const data = JSON.parse(json)
          const content = data.choices?.[0]?.delta?.content
          if (content) yield content
        } catch {
          // Skip malformed JSON
        }
      }
    }
  }
}

async function* streamAnthropic(messages: ChatMessage[]): AsyncGenerator<string> {
  if (!ANTHROPIC_KEY) {
    yield FALLBACK_RESPONSE
    return
  }

  const model = process.env.ANTHROPIC_MODEL || "claude-3-haiku-20240307"
  const system = messages.find(m => m.role === "system")?.content || ""
  const userMessages = messages.filter(m => m.role !== "system")

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 2000,
      temperature: 0.7,
      system,
      messages: userMessages,
      stream: true,
    }),
  })

  if (!response.body) {
    yield "No response generated."
    return
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const chunk = decoder.decode(value, { stream: true })
    const lines = chunk.split("\n").filter(l => l.trim())
    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const json = line.slice(6)
        try {
          const data = JSON.parse(json)
          const content = data.delta?.text
          if (content) yield content
        } catch {
          // Skip
        }
      }
    }
  }
}

async function* streamGoogle(messages: ChatMessage[]): AsyncGenerator<string> {
  if (!GOOGLE_KEY) {
    yield FALLBACK_RESPONSE
    return
  }

  const model = process.env.GOOGLE_MODEL || "gemini-2.0-flash"
  const system = messages.find(m => m.role === "system")?.content || ""
  const userMessages = messages.filter(m => m.role !== "system")

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?key=${GOOGLE_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: userMessages.map(m => ({ parts: [{ text: m.content }] })),
      generationConfig: { temperature: 0.7, maxOutputTokens: 2000 },
    }),
  })

  if (!response.body) {
    yield "No response generated."
    return
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const chunk = decoder.decode(value, { stream: true })
    const lines = chunk.split("\n").filter(l => l.trim())
    for (const line of lines) {
      try {
        const data = JSON.parse(line)
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text
        if (content) yield content
      } catch {
        // Skip
      }
    }
  }
}

function getStreamProvider(selectedModel: string, messages: ChatMessage[]): AsyncGenerator<string> {
  if (selectedModel.startsWith("ollama:")) {
    const model = selectedModel.replace("ollama:", "")
    return streamOllama(model, messages)
  }
  if (selectedModel.startsWith("docker:")) {
    const model = selectedModel.replace("docker:", "")
    return streamDocker(model, messages)
  }
  if (selectedModel.startsWith("podman:")) {
    const model = selectedModel.replace("podman:", "")
    return streamPodman(model, messages)
  }
  if (selectedModel.startsWith("lmstudio:")) {
    const model = selectedModel.replace("lmstudio:", "")
    return streamLMStudio(model, messages)
  }
  if (selectedModel.startsWith("llama.cpp:")) {
    const model = selectedModel.replace("llama.cpp:", "")
    return streamLlamaCpp(model, messages)
  }
  if (selectedModel.startsWith("hf:")) {
    const model = selectedModel.replace("hf:", "")
    return streamHF(model, messages)
  }
  switch (selectedModel) {
    case "anthropic":
      return streamAnthropic(messages)
    case "google":
      return streamGoogle(messages)
    case "openai":
      return streamOpenAI(messages)
    case "openrouter":
      return streamOpenRouter(messages)
    case "huggingface":
      return streamHuggingFace(messages)
    case "groq":
      return streamGroq(messages)
    case "together":
      return streamTogether(messages)
    case "gcloud":
      return streamGCloud(messages)
    case "aws":
      return streamAWS(messages)
    case "local":
    default:
      return streamLocal(messages)
  }
}

// AWS Bedrock
async function* streamAWS(messages: ChatMessage[]): AsyncGenerator<string> {
  if (!AWS_ACCESS_KEY || !AWS_SECRET_KEY) {
    yield "AWS keys not set"
    return
  }
  // AWS Bedrock requires signed requests - just return placeholder
  yield "AWS Bedrock: Set AWS_ACCESS_KEY and AWS_SECRET_KEY in env"
}

// Google Cloud Vertex AI
async function* streamGCloud(messages: ChatMessage[]): AsyncGenerator<string> {
  if (!GCLOUD_KEY) {
    yield "Google Cloud key not set"
    return
  }
  const res = await fetch(`https://${process.env.GCLOUD_PROJECT || "us-central1"}-aiplatform.googleapis.com/v1/projects/${process.env.GCLOUD_PROJECT || "your-project"}/locations/us-central1/publishers/google/models/gemini-1.5-pro:streamGenerateContent?alt=json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GCLOUD_KEY}`,
    },
    body: JSON.stringify({ contents: messages, generationConfig: { temperature: 0.9 } }),
  })
  if (!res.ok) {
    yield "Google Cloud not available"
    return
  }
  const data = await res.json()
  yield data.candidates?.[0]?.content?.parts?.[0]?.text || "No response"
}

// Groq streaming (free tier)
async function* streamGroq(messages: ChatMessage[]): AsyncGenerator<string> {
  if (!GROQ_KEY) {
    yield "Groq key not set"
    return
  }
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROQ_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instruct",
      messages,
      stream: true,
    }),
  })
  if (!res.ok) {
    yield "Groq not available"
    return
  }
  const reader = res.body?.getReader()
  const decoder = new TextDecoder()
  while (reader) {
    const { done, value } = await reader.read()
    if (done) break
    const text = decoder.decode(value)
    yield text
  }
}

// Together AI
async function* streamTogether(messages: ChatMessage[]): AsyncGenerator<string> {
  if (!TOGETHER_KEY) {
    yield "Together key not set"
    return
  }
  const res = await fetch("https://api.together.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOGETHER_KEY}`,
    },
    body: JSON.stringify({
      model: "meta-llama/Llama-3.1-8B-Instruct",
      messages,
      stream: true,
    }),
  })
  if (!res.ok) {
    yield "Together not available"
    return
  }
  const reader = res.body?.getReader()
  const decoder = new TextDecoder()
  while (reader) {
    const { done, value } = await reader.read()
    if (done) break
    const text = decoder.decode(value)
    yield text
  }
}

// Docker Ollama streaming
async function* streamDocker(model: string, messages: ChatMessage[]): AsyncGenerator<string> {
  const prompt = messages.map(m => `${m.role}: ${m.content}`).join("\n")
  const res = await fetch(`http://${DOCKER_OLLAMA}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model, prompt, stream: true }),
  })
  if (!res.ok) {
    yield "Docker Ollama not available"
    return
  }
  const reader = res.body?.getReader()
  const decoder = new TextDecoder()
  while (reader) {
    const { done, value } = await reader.read()
    if (done) break
    const text = decoder.decode(value)
    yield text
  }
}

// Podman uses same API as Docker
const streamPodman = streamDocker

// LM Studio streaming (OpenAI-compatible API)
async function* streamLMStudio(model: string, messages: ChatMessage[]): AsyncGenerator<string> {
  const res = await fetch(`${LMSTUDIO_HOST}/v1/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model, messages, stream: true }),
  })
  if (!res.ok) {
    yield "LM Studio not available"
    return
  }
  const reader = res.body?.getReader()
  const decoder = new TextDecoder()
  while (reader) {
    const { done, value } = await reader.read()
    if (done) break
    const text = decoder.decode(value)
    yield text
  }
}

// llama.cpp server streaming
async function* streamLlamaCpp(model: string, messages: ChatMessage[]): AsyncGenerator<string> {
  const res = await fetch(`${LLAMA_CPP_HOST}/v1/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model, messages, stream: true }),
  })
  if (!res.ok) {
    yield "llama.cpp not available"
    return
  }
  const reader = res.body?.getReader()
  const decoder = new TextDecoder()
  while (reader) {
    const { done, value } = await reader.read()
    if (done) break
    const text = decoder.decode(value)
    yield text
  }
}

// Hugging Face Text Generation Inference (handles all models)
async function* streamHF(model: string, messages: ChatMessage[]): AsyncGenerator<string> {
  const res = await fetch(`${HF_HOST}/v1/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(HF_TOKEN && { Authorization: `Bearer ${HF_TOKEN}` }) },
    body: JSON.stringify({ model, messages, stream: true }),
  })
  if (!res.ok) {
    yield "HF not available"
    return
  }
  const reader = res.body?.getReader()
  const decoder = new TextDecoder()
  while (reader) {
    const { done, value } = await reader.read()
    if (done) break
    const text = decoder.decode(value)
    yield text
  }
}

// Ollama streaming
async function* streamOllama(model: string, messages: ChatMessage[]): AsyncGenerator<string> {
  const prompt = messages.map(m => `${m.role}: ${m.content}`).join("\n")
  const res = await fetch(`${OLLAMA_HOST}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: model || OLLAMA_MODEL, prompt, stream: true }),
  })
  if (!res.ok) {
    yield "Ollama not available"
    return
  }
  const reader = res.body?.getReader()
  const decoder = new TextDecoder()
  while (reader) {
    const { done, value } = await reader.read()
    if (done) break
    const text = decoder.decode(value)
    yield text
  }
}

// OpenRouter streaming (free models)
async function* streamOpenRouter(messages: ChatMessage[]): AsyncGenerator<string> {
  if (!OPENROUTER_KEY) {
    yield "OpenRouter key not set"
    return
  }
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENROUTER_KEY}`,
      "HTTP-Referer": "https://schemaorg-agent.vercel.app",
    },
    body: JSON.stringify({
      model: "meta-llama/llama-3.1-8b-instruct",
      messages,
      stream: true,
    }),
  })
  if (!res.ok) {
    yield "OpenRouter not available"
    return
  }
  const reader = res.body?.getReader()
  const decoder = new TextDecoder()
  while (reader) {
    const { done, value } = await reader.read()
    if (done) break
    const text = decoder.decode(value)
    yield text
  }
}

// HuggingFace Inference API
async function* streamHuggingFace(messages: ChatMessage[]): AsyncGenerator<string> {
  if (!HF_TOKEN) {
    yield "HuggingFace token not set"
    return
  }
  const prompt = messages.map(m => `${m.role}: ${m.content}`).join("\n")
  const res = await fetch("https://api-inference.huggingface.co/models/meta-llama/Llama-3.1-8B-Instruct", {
    method: "POST",
    headers: { Authorization: `Bearer ${HF_TOKEN}` },
    body: JSON.stringify({ inputs: prompt }),
  })
  if (!res.ok) {
    yield "HuggingFace not available"
    return
  }
  const data = await res.json()
  yield data[0]?.generated_text || "No response"
}

async function* streamLocal(messages: ChatMessage[]): AsyncGenerator<string> {
  // Local mode - use fallback response
  // For real local LLM, integrate with db.ts generateText()
  yield FALLBACK_RESPONSE
}

// === API Endpoints ===

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId, model } = await req.json()
    
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // User selects model - no user secrets accepted
    const selectedModel = model || "local"
    const sid = sessionId || "default"
    const searchResults = await searchSchemaOrg(message)
    
    // Get session history
    const history: ChatMessage[] = getHistory(sid) as ChatMessage[]
    
    const messages: ChatMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history,
      { role: "user", content: `User question: ${message}\n\nRelevant information from web search:\n${searchResults}` },
    ]

    // User selects model in UI: local, openai, anthropic, google
    // If fails, tell user and let them choose again
    let fullResponse = ""
    try {
      for await (const chunk of getStreamProvider(selectedModel, messages)) {
        fullResponse += chunk
      }
    } catch (e) {
      // Provider failed - tell user and suggest alternatives
      const models = await getModels()
      const available = Object.keys(models).filter(k => models[k]?.available)
      
      return new NextResponse(JSON.stringify({
        error: `${selectedModel} failed. Available: ${available.join(", ")}`,
        available,
        retry: true
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      })
    }

    // Save to history
    addToHistory(sid, "user", message)
    addToHistory(sid, "assistant", fullResponse)

    // Return streaming response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(fullResponse))
        controller.close()
      },
    })

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    })
  } catch (error) {
    console.error("Chat error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Clear history endpoint
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get("sessionId") || "default"
  clearHistory(sessionId)
  return NextResponse.json({ success: true, message: "History cleared" })
}

// Get available models with provider selection UI
export async function GET() {
  const provider = await autoDetectProvider()
  const models = await getModels()
  
  // All available (for user to choose, not auto)
  const available = Object.entries(models)
    .filter(([_, v]) => v.available)
    .map(([id, v]) => ({ id, ...v }))
  
  return NextResponse.json({
    current: provider,
    autoDetected: models[provider]?.available || false,
    providers: available,
    keyGuides: {
      openrouter: "Get free: https://openrouter.ai/settings",
      groq: "Get free: https://console.groq.com",
      gcloud: "$300 free: https://console.cloud.google.com/billing",
      aws: "$200 free: https://console.aws.amazon.com/billing",
      together: "Get free: https://together.ai",
      huggingface: "Get token: https://huggingface.co/settings/tokens",
    },
  })
}