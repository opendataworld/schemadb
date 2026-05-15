# Individual OCI Components

## 1. runc (~10MB) - Deploy

```bash
# Install
curl -LO https://github.com/opencontainers/runc/releases/download/v1.1.12/runc.amd64
chmod +x runc.amd64 && sudo mv runc.amd64 /usr/local/bin/runc

# Build app rootfs
mkdir -p rootfs/bin
cp schemaorg-agent rootfs/bin/

# Run
runc run schemaorg
```

## 2. Zot (~15MB) - Registry

```bash
# Install
curl -sfL https://github.com/anchore/zot/releases/download/v2.0.0/zot-2.0.0-linux-amd64 -o zot
chmod +x zot && sudo mv zot /usr/local/bin/

# Run
zot serve config.yaml
```

## 3. Bun (~20MB) - Runtime

```bash
# Install
curl -fsSL https://bun.sh/install | bash

# Run
bun run src/server.ts
```

## 4. Deno (~20MB) - Runtime (CNCF)

```bash
# Install  
curl -fsSL https://deno.land/install.sh | sh

# Run
deno run --allow-all src/server.ts
```

## Stack

| Component | Size | Run |
|-----------|------|-----|
| runc | 10MB | `runc run` |
| Zot | 15MB | `zot serve` |
| Bun | 20MB | `bun run` |
| Deno | 20MB | `deno run` |

**Total: ~65MB** (vs Docker ~1GB)

## Deploy Each

```bash
# VPS
curl -LO component-binary
chmod +x component-binary
./component-binary &

# Or systemd
sudo tee /etc/systemd/schemaorg.service <<EOF
ExecStart=/usr/local/bin/component-binary
Restart=always
EOF
```