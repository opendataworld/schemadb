# Deployment

## Docker
```bash
# Full image
docker run -d -p 3000:3000 ghcr.io/opendataworld/schemadb

# Build locally
docker build -t schemaorg .
```

## Bun
```bash
bun run src/server.ts
```

## runc (no Docker bloat - ~10MB)
```bash
# Install runc
curl -LO https://github.com/opencontainers/runc/releases/download/v1.1.12/runc.amd64
chmod +x runc.amd64 && sudo mv runc.amd64 /usr/local/bin/runc

# Deploy container
runc run schemaorg
```
