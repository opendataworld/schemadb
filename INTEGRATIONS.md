# Schema.org Agent API

## What is `/api/chat`?

This is the main API endpoint for the Schema.org Q&A Agent. It handles:

1. **GET** - Returns available AI providers (called on page load)
2. **POST** - Processes user messages and returns AI responses

### Usage Flow

```
┌─────────────────┐     GET      ┌──────────────────┐
│   Chat Page     │ ──────────► │   /api/chat    │
│   (browser)    │             │   (returns    │
└─────────────────┘             │   providers)  │
        │                     └──────────────────┘
        │ POST {message, model}
        ▼                     ┌──────────────────┐
┌─────────────────┐ ──────────► │   /api/chat    │
│   Send button   │             │   (returns    │
│               │             │   response)   │
└─────────────────┘             └──────────────────┘
```

## Hosting

This is a Next.js application. Host it anywhere that supports Next.js:

### Local Development

```bash
npm run dev
# Opens http://localhost:3000
```

### Production Deployment

| Platform | Command | Notes |
|----------|---------|-------|
| **Vercel** | `vercel deploy` | Auto-detects Next.js, sets env vars in dashboard |
| **Netlify** | `netlify deploy` | Needs `next.config.ts` output: 'standalone' |
| **Railway** | `railway deploy` | Set env vars in Railway dashboard |
| **Docker** | `docker build -t app .` | Multi-stage build, see Dockerfile |
| **AWS Amplify** | Connect repo | Auto-builds Next.js |

### Required Env Variables

Set these in your hosting platform:

```bash
# At least ONE of these:
GROQ_KEY=sk-xxx           # Free (Groq)
OPENROUTER_KEY=sk-or-xxx  # Free (OpenRouter)
OPENAI_API_KEY=sk-xxx      # Paid
ANTHROPIC_API_KEY=sk-ant-xxx  # Paid

# Optional:
NEXTAUTH_SECRET=xxx     # Required for auth
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
```

### Example: Vercel Setup

1. `npm install -g vercel`
2. `vercel login`
3. `vercel` (in project folder)
4. In Vercel dashboard → Settings → Environment Variables:
   - Add `GROQ_KEY` (from https://console.groq.com)
   - Add `NEXTAUTH_SECRET` (run `openssl rand -base64 32`)
5. Deploy!

---

## All API Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/chat` | Get available providers |
| POST | `/api/chat` | Send message, get response |
| DELETE | `/api/chat?sessionId=xxx` | Clear chat history |

---

## All 12 AI Providers Supported

### Cloud APIs (require env var)

| Provider | Env Variable | Free? | Endpoint |
|----------|--------------|-------|-----------|
| **Groq** | `GROQ_KEY` | Yes | `https://api.groq.com/openai/v1/chat/completions` |
| **OpenRouter** | `OPENROUTER_KEY` | Yes | `https://openrouter.ai/api/v1/chat/completions` |
| **OpenAI** | `OPENAI_API_KEY` | No | `https://api.openai.com/v1/chat/completions` |
| **Anthropic** | `ANTHROPIC_API_KEY` | No | `https://api.anthropic.com/v1/messages` |
| **Google Cloud** | `GCLOUD_KEY` | $300 | `https://generativelanguage.googleapis.com` |
| **Google AI** | `GOOGLE_KEY` | No | `https://generativelanguage.googleapis.com` |
| **Together AI** | `TOGETHER_KEY` | Some | `https://api.together.ai/v1/chat/completions` |
| **HuggingFace** | `HF_TOKEN` | Some | `https://api-inference.huggingface.co` |
| **AWS** | `AWS_ACCESS_KEY` + `AWS_SECRET_KEY` | $200 | AWS Bedrock |

### Local Runtimes (auto-detected)

| Runtime | Default Port | Env Variable |
|---------|-------------|-------------|
| **Ollama** | 11434 | `OLLAMA_HOST` |
| **LM Studio** | 1234 | `LMSTUDIO_HOST` |
| **Docker Ollama** | 11434 | `DOCKER_OLLAMA` |
| **Podman Ollama** | 11434 | `PODMAN_OLLAMA` |
| **TinyLlama** | - | Always available as fallback |

---

## All Environment Variables

```bash
# === Required for Auth ===
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://your-site.com

# === At least ONE AI provider (free options) ===
GROQ_KEY=sk-xxx           # https://console.groq.com
OPENROUTER_KEY=sk-or-xxx  # https://openrouter.ai/settings

# === Optional AI providers ===
OPENAI_API_KEY=sk-xxx         # https://platform.openai.com
ANTHROPIC_API_KEY=sk-ant-xxx # https://console.anthropic.com
GOOGLE_KEY=xxx               # https://aistudio.google.com
GCLOUD_KEY=xxx              # https://console.cloud.google.com
GCLOUD_PROJECT=xxx          # Your GCP project ID
TOGETHER_KEY=xxx            # https://together.ai
HF_TOKEN=xxx               # https://huggingface.co/settings/tokens

# === AWS (requires both) ===
AWS_ACCESS_KEY=xxx
AWS_SECRET_KEY=xxx
AWS_REGION=us-east-1

# === OAuth (optional) ===
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx

# === Local runtimes (optional) ===
OLLAMA_HOST=http://localhost:11434
LMSTUDIO_HOST=http://localhost:1234
DOCKER_OLLAMA=http://localhost:11434
PODMAN_OLLAMA=http://localhost:11434
```

---

## All Helper Functions

| Function | Location | Purpose |
|-----------|----------|---------|
| `autoDetectProvider()` | Line 30 | Returns best available provider |
| `getModels()` | Line 55 | Returns all providers with availability |
| `getStreamProvider()` | Line 390 | Routes to correct AI API |
| `searchSchemaOrg()` | External | Searches schema.org for context |
| `getHistory()` | Line 136 | Returns session chat history |
| `addToHistory()` | Line 140 | Saves message to history |
| `clearHistory()` | Line 150 | Clears session history |

### Provider Streaming Functions

| Function | Provider | Line |
|----------|----------|------|
| `streamOllama()` | Ollama | 187 |
| `streamLMStudio()` | LM Studio | 228 |
| `streamDocker()` | Docker Ollama | 268 |
| `streamHuggingFace()` | HuggingFace | 305 |
| `streamOpenRouter()` | OpenRouter | 382 |
| `streamGroq()` | Groq | 434 |
| `streamGCloud()` | Google Cloud | 498 |
| `streamAWS()` | AWS Bedrock | 556 |
---

## Code Translation (Human-Readable)

### autoDetectProvider() - How It Chooses the AI

Located at line 30 of `src/app/api/chat/route.ts`:

```typescript
export async function autoDetectProvider(sessionUser?: any) {
  // Priority 1: If user signed in with Google, use GCP ($300 credit)
  if (sessionUser?.email?.endsWith("gmail.com")) return "gcp-oauth"
  
  // Priority 2: Paid cloud APIs (in order of credit amount)
  if (GCLOUD_KEY) return "gcloud"       // $300 Google Cloud
  if (AWS_ACCESS_KEY && AWS_SECRET_KEY) return "aws"   // $200 AWS
  if (OPENAI_KEY) return "openai"        // Paid
  if (ANTHROPIC_KEY) return "anthropic" // Paid
  if (GOOGLE_KEY) return "google"       // Paid
  
  // Priority 3: Free tier APIs
  if (OPENROUTER_KEY) return "openrouter" // Free credits
  if (GROQ_KEY) return "groq"             // Free
  if (TOGETHER_KEY) return "together"      // Some free
  if (HF_TOKEN) return "huggingface"      // Some free
  
  // Priority 4: Local runtime (always works)
  return "local"
}
```

### getModels() - What Providers Are Available

Located at line 55 of `src/app/api/chat/route.ts`:

```typescript
async function getModels() {
  const models = {}
  
  // Check cloud API keys exist
  if (GROQ_KEY) models["groq"] = { name: "Groq", available: true }
  if (OPENROUTER_KEY) models["openrouter"] = { name: "OpenRouter", available: true }
  if (OPENAI_KEY) models["openai"] = { name: "OpenAI GPT-4", available: true }
  // ... etc for each provider
  
  // Try local runtimes
  try {
    const res = await fetch(`${OLLAMA_HOST}/api/tags`)
    if (res.ok) {
      const data = await res.json()
      for (const m of data.models) {
        models[`ollama:${m.name}`] = { name: `Ollama: ${m.name}`, available: true }
      }
    }
  } catch { /* not running */ }
  
  // Always include fallback
  models["local"] = { name: "TinyLlama", available: true }
  
  return models
}
```

**Meaning:** Checks which API keys exist and tries connecting to local runtimes. Returns list of what's actually working.

---

### getStreamProvider() - Route to Correct AI

Located at line 390 of `src/app/api/chat/route.ts`:

```typescript
function getStreamProvider(model: string, messages: ChatMessage[]) {
  if (model.startsWith("ollama:")) return streamOllama(model.replace("ollama:", ""), messages)
  if (model.startsWith("docker:")) return streamDocker(model.replace("docker:", ""), messages)
  if (model.startsWith("lmstudio:")) return streamLMStudio(model.replace("lmstudio:", ""), messages)
  
  switch (model) {
    case "openrouter": return streamOpenRouter(messages)
    case "groq": return streamGroq(messages)
    case "gcloud": return streamGCloud(messages)
    case "aws": return streamAWS(messages)
    case "local": return streamOllama("tinyllama", messages)
    default: return streamOllama("tinyllama", messages)
  }
}
```

**Meaning:** Routes user message to the correct AI provider based on what they selected in the dropdown.

### streamGroq() - How a Provider Streams Response

Located at line 434 of `src/app/api/chat/route.ts`:

```typescript
function streamGroq(messages: ChatMessage[]): AsyncGenerator<string> {
  const oaiMessages = messages.slice(-6).map(m => ({ role: m.role, content: m.content }))
  
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${GROQ_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama-3.1-70b-versatile",
      messages: oaiMessages,
      temperature: 0.7,
      max_tokens: 2000,
      stream: true
    })
  })
  
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    
    const chunk = decoder.decode(value, { stream: true })
    for (const line of chunk.split("\n")) {
      if (line.startsWith("data: ")) {
        try {
          const data = JSON.parse(line.slice(6))
          const content = data.choices?.[0]?.delta?.content
          if (content) yield content  // Send chunk to user
        } catch { /* skip */ }
      }
    }
  }
}
```

**Meaning:** Sends message to Groq API, receives response in chunks, yields each chunk to the user as it arrives.

---

### POST /api/chat - Full Request Flow

Located at line 657 of `src/app/api/chat/route.ts`:

```typescript
export async function POST(req: NextRequest) {
  const { message, sessionId, model } = await req.json()
  
  // 1. Search schema.org for context
  const searchResults = await searchSchemaOrg(message)
  
  // 2. Get chat history
  const history = getHistory(sessionId)
  
  // 3. Build messages
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history,
    { role: "user", content: "Question: " + message + "\n\nContext: " + searchResults }
  ]
  
  // 4. Call provider
  let response = ""
  try {
    for await (const chunk of getStreamProvider(model, messages)) {
      response += chunk
    }
  } catch (error) {
    return NextResponse.json({
      error: `${model} failed`,
      available: Object.keys(await getModels()).filter(k => k.available),
      retry: true
    }, { status: 400 })
  }
  
  // 5. Save history
  addToHistory(sessionId, "user", message)
  addToHistory(sessionId, "assistant", response)
  
  return NextResponse.json({ response })
}
```

**Meaning:**
1. User sends message
2. Search schema.org for related info
3. Build full conversation with history
4. Send to AI, stream response back
5. Save to history for next turn

---

### System Prompt (AI Instructions)

Located at line 154 of `src/app/api/chat/route.ts`:

```
You are the Schema.org Agent, specialized in explaining schema.org.

Your job:
1. Answer questions about schema.org types and properties
2. Give examples using JSON-LD, Microdata, or RDFa
3. Explain the type hierarchy (Thing > CreativeWork > Book)
4. Always cite https://schema.org as your source
5. Also reference Google, Wikipedia, or W3C when helpful
```

**Meaning:** This tells the AI how to behave - must cite sources from schema.org, Google, Wikipedia, or W3C.

---

### GET /api/chat

**curl:**
```bash
curl https://your-site.com/api/chat
```

**Response:**
```json
{
  "current": "openrouter",
  "autoDetected": true,
  "providers": [
    { "id": "local", "name": "TinyLlama (offline)", "available": true },
    { "id": "openrouter", "name": "OpenRouter (free)", "available": true },
    { "id": "groq", "name": "Groq (free)", "available": false }
  ],
  "keyGuides": {
    "openrouter": "Get free: https://openrouter.ai/settings",
    "groq": "Get free: https://console.groq.com",
    "gcloud": "$300 free: https://console.cloud.google.com/billing",
    "aws": "$200 free: https://console.aws.amazon.com/billing",
    "together": "Get free: https://together.ai",
    "huggingface": "Get token: https://huggingface.co/settings/tokens"
  }
}
```

**Fields:**
- `current`: Best available provider (auto-detected)
- `autoDetected`: Whether current is actually available
- `providers`: Array of { id, name, available }
- `keyGuides`: URLs to get API keys for each provider

---

### POST /api/chat

**When called:** User sends message

**Request:** FormData (not JSON - supports file uploads too)

```javascript
const formData = new FormData()
formData.append("message", "What is schema.org?")
formData.append("model", "openrouter")
// Optional files:
formData.append("images", fileObject)
```

**Response (success):**
```json
{ "response": "Schema.org is a vocabulary..." }
```

**Response (failure):**
```json
{
  "error": "openrouter failed. Rate limit exceeded",
  "available": ["local", "groq"],
  "retry": true
}
```

---

## Environment Variables

Set these in your deployment (Vercel, Netlify, etc.):

| Variable | Provider | Free? | URL |
|----------|----------|-------|-----|
| `GROQ_KEY` | Groq | Yes | https://console.groq.com |
| `OPENROUTER_KEY` | OpenRouter | Yes | https://openrouter.ai/settings |
| `TOGETHER_KEY` | Together AI | Some | https://together.ai |
| `HF_TOKEN` | HuggingFace | Some | https://huggingface.co |
| `GCLOUD_KEY` | Google Cloud | $300 | https://console.cloud.google.com |
| `AWS_ACCESS_KEY` + `AWS_SECRET_KEY` | AWS | $200 | https://console.aws.amazon.com |
| `OPENAI_API_KEY` | OpenAI | No | https://platform.openai.com |
| `ANTHROPIC_API_KEY` | Anthropic | No | https://console.anthropic.com |

Local runtimes (auto-detected if running):

| Variable | Default | Description |
|----------|---------|-------------|
| `OLLAMA_HOST` | localhost:11434 | Ollama API |
| `LMSTUDIO_HOST` | localhost:1234 | LM Studio API |
| `DOCKER_OLLAMA` | localhost:11434 | Docker Ollama |
| `PODMAN_OLLAMA` | localhost:11434 | Podman Ollama |

---

## Provider Selection Logic

### Auto-detection (GET returns "current")

Priority order:
```
1. GCLOUD_KEY → Google Cloud ($300)
2. AWS keys → AWS ($200)
3. OPENAI_API_KEY → OpenAI
4. ANTHROPIC_API_KEY → Anthropic
5. GOOGLE_API_KEY → Google AI
6. OPENROUTER_KEY → OpenRouter (free)
7. GROQ_KEY → Groq (free)
8. TOGETHER_KEY → Together
9. HF_TOKEN → HuggingFace
→ Local Ollama/LM Studio/Docker (if running)
→ local: TinyLlama (always)
```

### User selection (POST uses "model")

- User picks from dropdown
- API tries that provider
- If fails → returns error with available alternatives
- User picks new one

---

## Security

**No user secrets stored:**
- Users cannot provide their own API keys
- Only deployer-set env vars work
- Safer for production

**What works:**
- Env vars set by deployer
- Local runtimes (Ollama, LM Studio)
- OAuth (future: user's GCP credits)

---

## Frontend Integration

### Fetch providers on load
```javascript
useEffect(() => {
  fetch("/api/chat")
    .then(r => r.json())
    .then(data => {
      setProviders(data.providers)
      setModel(data.current)  // Auto-selected best
    })
}, [])
```

### Send message with model
```javascript
const sendMessage = async () => {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, model })
  })
  
  if (!res.ok) {
    const err = await res.json()
    // Show error + available list
    // Let user pick new model
    return
  }
  
  const data = await res.json()
  // Show response
}
```

### Model dropdown
```jsx
<select value={model} onChange={setModel}>
  {providers.filter(p => p.available).map(p => (
    <option key={p.id} value={p.id}>{p.name}</option>
  ))}
</select>
```