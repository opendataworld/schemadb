This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Push to GHCR (Free)

```bash
# Login
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Tag
docker tag schemaorg-agent ghcr.io/opendataworld/schemaorg-agent:latest

# Push
docker push ghcr.io/opendataworld/schemaorg-agent:latest
```

## Pull

```bash
docker pull ghcr.io/opendataworld/schemaorg-agent:latest
```

## Push to Docker Hub (Free)

```bash
# Login
docker login -u USERNAME -p $DOCKERHUB_TOKEN

# Tag
docker tag schemaorg-agent username/schemaorg-agent:latest

# Push
docker push username/schemaorg-agent:latest
```

## Run with runc

```bash
# Install runc (~10MB)
curl -LO https://github.com/opencontainers/runc/releases/download/v1.1.12/runc.amd64
chmod +x runc.amd64 && sudo mv runc.amd64 /usr/local/bin/runc

# Pull image
docker pull ghcr.io/opendataworld/schemaorg-agent:latest

# Export to rootfs
docker create ghcr.io/opendataworld/schemaorg-agent:latest
docker export CONTAINER_ID | tar -C rootfs -xf -

# Run
runc run schemaorg
```

Or directly:

```bash
runc run -b container-id schemaorg
```

## Local LLM (no API key needed)

Check available models:

```bash
# Ollama
ollama list

# LM Studio
lm-studio list

# Local AI
curl http://localhost:1234/v1/models
```

Use local model by setting:

```bash
export OLLAMA_BASE_URL=http://localhost:11434
# or
export LMSTUDIO_BASE_URL=http://localhost:1234/v1
```

No API key needed if using local LLM.

## Auto-detect Local Models

The app checks local models first:

1. Check Ollama
2. Check LM Studio
3. Fall back to API key

## Llama.cpp (local)

```bash
# Install
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp
make

# Download model
curl -L -o model.gguf https://huggingface.co/TheBloke/Llama-2-7B-GGUF/resolve/main/llama-2-7b.Q4_K_M.gguf

# Run server
./server -m model.gguf -c 4096

# Set in app
export LLAMA_CPP_HOST=http://localhost:8080/v1
```

## Local LLM (just model)

### Option 1: Ollama (recommended)

```bash
# Install + run model
curl -fsSL https://ollama.ai/install.sh
ollama run llama3
```

### Option 2: LM Studio

Download: lmstudio.ai

```bash
# Just download model, run in app
export LMSTUDIO_BASE_URL=http://localhost:1234/v1
```

That's it. No server setup.

## llama.cpp in Docker

```bash
# CPU
docker run -d -p 8080:8080 -v /path/to/models:/models ghcr.io/ggerganov/llama.cpp:server

# GPU
docker run -d -p 8080:8080 --gpus all -v /path/to/models:/models ghcr.io/ggerganov/llama.cpp:server-cuda

# Run model
export LLAMA_CPP_HOST=http://localhost:8080
```

## Fallback: If nothing running

If no local LLM detected, use runc to spin up one:

```bash
# Install runc (~10MB)
curl -LO https://github.com/opencontainers/runc/releases/download/v1.1.12/runc.amd64
chmod +x runc.amd64 && sudo mv runc.amd64 /usr/local/bin/runc

# Run llama.cpp in runc
docker pull ghcr.io/ggerganov/llama.cpp:server-cuda
docker export -o rootfs.tar ghcr.io/ggerganov/llama.cpp:server-cuda
mkdir rootfs && tar -xf rootfs.tar -C rootfs

# Or run Ollama
docker pull ollama/ollama
docker export -o rootfs.tar ollama/ollama
mkdir rootfs && tar -xf rootfs.tar -C rootfs

# Run with runc
runc run llama
```

## Philosophy

**Local-first, User-controlled, Pay-for-fallback**

1. Check local LLMs (llama.cpp → HF TGI → Ollama → LM Studio)
2. If nothing running → ask user what to do
3. Cloud APIs as last resort

| | Local | Cloud |
|-------|-------|
| Privacy | ✅ |
| Free | Paid |
| User controls | User controls |

## Search Sources (Trust-Ordered)

| Source | Trust | Type |
|--------|-------|------|
| schema.org | 100 | Primary |
| W3C | 95 | Trust |
| Wikipedia | 90 | Trust |
| MDN | 85 | Trust |
| Google Dev | 80 | Trust |
| DuckDuckGo | 50 | Web (FOSS) |

**Super Search modes:**
- `fast` - schema.org only
- `deep` - top 3 trust + 2 web
- `comprehensive` - all sources

## Modules

```
src/lib/
├── super/     # Super search (all sources)
├── fallback/  # Unified fallback + citations
├── trust/     # Trusted sources
├── search/    # Web search
├── cot/       # Chain of thought
├── rag/       # Knowledge retrieval
├── memory/    # Session storage
├── iam/       # Access control
├── audit/     # Audit logs
└── monitoring # Health + errors
```

## Environment Variables

All configs in `.env.example`:

```bash
# Search
SUPER_ENABLED=false
SUPER_MODE=deep

# Chain of Thought
COT_ENABLED=false

# Trusted Sources
TRUST_SOURCES=schemaorg,wikipedia,w3c,mdn
```
