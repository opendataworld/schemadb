// All configs from environment variables - no hardcoding

const env = {
  // SurrealDB
  surreal: {
    url: process.env.SURREAL_URL,
    ns: process.env.SURREAL_NS,
    db: process.env.SURREAL_DB,
    user: process.env.SURREAL_USER,
    pass: process.env.SURREAL_PASS
  },
  // HTTP Server
  server: {
    port: process.env.PORT,
    host: process.env.HOST
  },
  // AI Agent
  agent: {
    model: process.env.AGENT_MODEL,
    temp: process.env.AGENT_TEMP,
    maxTokens: process.env.AGENT_MAX_TOKENS
  },
  // External services (optional)
  openai: { apiKey: process.env.OPENAI_API_KEY },
  anthropic: { apiKey: process.env.ANTHROPIC_API_KEY },
  // Feature toggles
  features: {
    rag: process.env.ENABLE_RAG === 'true',
    search: process.env.ENABLE_SEARCH === 'true',
    vector: process.env.ENABLE_VECTOR === 'true'
  }
};

export const Config = Object.fromEntries(
  Object.entries(env).filter(([_, v]) => v != null)
);

export default Config;
