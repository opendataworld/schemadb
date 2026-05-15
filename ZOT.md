# Zot Registry (CNCF OCI-native)

## Why Zot?

| | Docker Registry | Zot |
|--|----------------|-----|
| Standard | V2 | OCI |
| Speed | Slow | Fast |
| Storage | Blob GC | Dedupe |
| Security | Basic | Notary, SBOM |
| Size | ~50MB | ~15MB |

## Install (single binary)

```bash
# Binary
curl -sfL https://github.com/anchore/zot/releases/download/v2.0.0/zot-2.0.0-linux-amd64
chmod +x zot && sudo mv zot /usr/local/bin/

# Or container
docker run -d -p 5000:5000 -v zot-data:/var/lib/zot ghcr.io/project-zot/zot:latest
```

## config.yaml

```yaml
version: 0.1.0
name: schemaorg
storage:
  rootDirectory: /var/lib/zot
http:
  address: 0.0.0.0
  port: 5000
log:
  level: debug
```

## Run

```bash
zot serve config.yaml
```

## Push/Pull

```bash
# Tag
docker tag schemaorg-agent localhost:5000/schemaorg-agent

# Push
docker push localhost:5000/schemaorg-agent

# Pull
docker pull localhost:5000/schemaorg-agent
```

## Deploy with K3s

```yaml
apiVersion: apps/v1
kind: Deployment
spec:
  template:
    spec:
      containers:
      - name: app
        image: localhost:5000/schemaorg-agent:latest
```