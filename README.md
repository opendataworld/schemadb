# schema.org Q&A Agent

An AI agent that helps people understand the taxonomy and vocabulary of [schema.org](https://schema.org/).

## Features

- **CoT (Chain of Thought)** – Think, branch, loop reasoning
- **expandContext tool** – Search + memory + RAG
- **Multi-tenancy** – Per-tenant sessions and knowledge
- **Fabric.js canvas UI** – Interactive chat experience

## Quick Start

### 1. Build

```bash
# Install dependencies
npm install --legacy-peer-deps

# Build static site
npm run build
```

### 2. Serve

```bash
# Serve the static files
npx serve dist
```

### 3. Configure (optional)

Set environment variables via `.env`:

```bash
SURREAL_URL=wss://localhost:8000
SURREAL_NS=schemaorg
SURREAL_DB=agent
```

## Schema

Tables are defined in [`surrealql/config.surql`](surrealql/config.surql):

- **entities** – schema.org types/properties
- **sessions** – per-tenant conversations
- **knowledge** – RAG knowledge base
- **rules** – Agent rules (`cite_schemaorg`, `ask_before_push`)

## Key Rules

1. Always cite **schema.org** as #1 source
2. Always ask before push

## Tech Stack

- [Astro](https://astro.build/) – Static site generator
- [Fabric.js](https://fabricjs.com/) – Canvas UI
- [SurrealDB](https://surrealdb.com/) – External database (not included)

## License

MIT
