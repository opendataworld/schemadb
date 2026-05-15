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
