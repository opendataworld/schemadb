# Bun (No Docker needed)

## Install Bun (single binary)

```bash
curl -fsSL https://bun.sh/install | bash
```

## Run

```bash
# Install deps
bun install

# Start
bun run src/server.ts
# or
bun --bun src/server.ts
```

## Build Binary (optional, ~50MB)

```bash
bun build src/server.ts --compile --outfile schemaorg-agent
./schemaorg-agent
```

## Deploy without Docker

### 1. Railway/Brender (drop-in)

```bash
# Install bun in Dockerfile
RUN curl -fsSL https://bun.sh/install | bash
ENV BUN_INSTALL="/root/.bun"
ENV PATH="$BUN_INSTALL/bin:$PATH"

# Run
bun --bun src/server.ts
```

### 2. Fly.io (best)

```bash
flyctl launch
flyctl deploy
```

### 3. VPS (any Linux)

```bash
# Install
curl -fsSL https://bun.sh/install | bash

# Run as service
sudo tee /etc/systemd/schemaorg.service <<EOF
[Service]
ExecStart=/root/.bun/bin/bun --bun /app/src/server.ts
WorkingDirectory=/app
Restart=always

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl enable schemaorg
```

## Bun vs Node.js

| | Node.js | Bun |
|--------|-----|
| Size | ~100MB | ~20MB |
| Startup | 50ms | 5ms |
| API | Web Streams | Native |
| Package manager | npm | Built-in |

## With K8s

```yaml
containers:
- name: app
  image: oven/bun:1-debian
  command: ["bun", "--bun", "src/server.ts"]
```