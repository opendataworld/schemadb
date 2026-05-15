import { NextRequest, NextResponse } from "next/server"

const openaiApiKey = () => process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || ""

interface ChatMessage {
  role: "system" | "user" | "assistant"
  content: string
}

const SYSTEM_PROMPT = `You are the Schema.org Agent, an AI assistant specialized in explaining schema.org taxonomy and vocabulary.

Your purpose is to help users understand:
- What schema.org is and how it works
- The schema.org type hierarchy ( Thing > CreativeWork > Book, etc.)
- Individual types (Person, Product, Organization, Event, etc.)
- Properties for each type
- How to use structured data markup (JSON-LD, Microdata, RDFa)

When answering questions, you MUST:
1. Ground your responses in references from:
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

async function searchSchemaOrg(query: string): Promise<string> {
  const apiKey = process.env.TAVILY_API_KEY
  if (!apiKey) {
    return ""
  }

  try {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, max_results: 5 }),
    })

    const data = await response.json() as { results?: Array<{ title: string; content: string; url: string }> }

    if (!data.results || data.results.length === 0) {
      return ""
    }

    return data.results
      .map((r) => `**${r.title}**\n${r.content}\nSource: ${r.url}`)
      .join("\n\n")
  } catch {
    return ""
  }
}

async function getChatResponse(messages: ChatMessage[]): Promise<string> {
  const key = openaiApiKey()
  if (!key) {
    return `I don't have access to the AI API right now. However, here's what I know about schema.org:

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
  }

  try {
    const response = await fetch(`${process.env.OPENAI_BASE_URL || "https://api.openai.com/v1"}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    const data = await response.json() as { choices?: Array<{ message: { content: string } }> }
    return data.choices?.[0]?.message?.content || "No response generated."
  } catch (error) {
    return `Error: ${error instanceof Error ? error.message : "Unknown error"}`
  }
}

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // First, search for relevant information
    const searchResults = await searchSchemaOrg(message)

    // Build messages with context
    const messages: ChatMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `User question: ${message}\n\nRelevant information from web search:\n${searchResults}`,
      },
    ]

    // Get response from LLM
    const response = await getChatResponse(messages)

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Chat error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}