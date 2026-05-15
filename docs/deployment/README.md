# Deployment

## Docker
```bash
docker run -p 3000:3000 ghcr.io/opendataworld/schemadb
```

## Bun
```bash
bun run src/server.ts
```

## runc (no Docker bloat)
```bash
runc run schemaorg
```
