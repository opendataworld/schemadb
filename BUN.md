# Bun (No Docker - Single Binary)

## Install Bun

```bash
curl -fsSL https://bun.sh/install | bash
```

## Run

```bash
bun install
bun run src/server.ts
```

## Deploy

### Fly.io (no card)

```bash
flyctl launch
flyctl deploy
```

### VPS

```bash
curl -fsSL https://bun.sh/install | bash
bun run src/server.ts
```

## Bun vs Node.js

| | Node.js | Bun |
|--------|-----|
| Size | ~100MB | ~20MB |
| Start | 50ms | 5ms |

## K8s

```yaml
image: oven/bun:1-debian
command: ["bun", "src/server.ts"]
```