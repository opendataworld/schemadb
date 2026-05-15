<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Schema.org Agent Knowledge

## What This Agent Does
- Chat UI for schema.org taxonomy Q&A
- Uses Next.js + NextAuth
- Grounded responses with schema.org, Google, Wikipedia, W3C

## Local LLM Priority
1. llama.cpp server (port 8080)
2. HuggingFace TGI (port 8001)
3. Ollama (port 11434)
4. LM Studio (port 1234)

## Philosophy
- Local-first, user-controlled, pay-for-fallback
- No secrets in chat
- Auto-detect available LLMs
- If none running → ask user

## Deployment
- Bun: `bun run src/server.ts`
- Docker: `ghcr.io/opendataworld/schemadb`
- runc: ~10MB (no Docker bloat)

## Key Files
- `src/app/api/chat/route.ts` - LLM detection & streaming
- `src/components/provider-selector.tsx` - dropdown UI
