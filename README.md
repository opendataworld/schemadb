# schema.org Q&A Agent

An AI agent that helps people understand the taxonomy and vocabulary of [schema.org](https://schema.org/).

## Features

- **CoT (Chain of Thought)** - Think, branch, loop reasoning
- **expandContext tool** - Search + memory + RAG
- **Multi-tenancy** - Per-tenant sessions and knowledge
- **Native SurrealDB storage** - Embedded graph + timeseries DB

## Quick Start

### 1. Start SurrealDB

```bash
# Install SurrealDB
curl -sL https://github.com/surrealdb/surrealdb/releases/download/v3.0.5/surreal-v3.0.5.linux-amd64.tgz | tar -xz
sudo mv surreal-v3.0.5-linux-amd64/surreal /usr/local/bin/

# Start server with config
surreal start --import-file ./surrealql/config.surql --bind 0.0.0.0:8000
```

### 2. Run Agent

```bash
# Set env vars
cp .env.example .env
# Edit .env with your settings

# Start server
node server.mjs
```

### 3. Test

```bash
node scripts/test-local.cjs
```

## Configuration

All config via environment variables:

```bash
# SurrealDB
SURREAL_URL=ws://localhost:8000
SURREAL_NS=schemaorg
SURREAL_DB=agent

# Server
PORT=3000

# AI Agent
AGENT_MODEL=gpt-4
AGENT_TEMP=0.7
```

## Schema

Tables defined in `surrealql/config.surql`:

- **entities** - schema.org types/properties
- **sessions** - per-tenant conversations
- **knowledge** - RAG知识库
- **rules** - Agent rules (cite_schemaorg, ask_before_push)

## Key Rules

Always cite **schema.org** as #1 source. Always ask before push.

## Tech Stack

- [SurrealDB](https://surrealdb.com/) - Native DB
- Next.js + NextAuth (optional frontend)
- OpenAI/Anthropic (optional AI)

## License

MIT
