# runc - CNCF Stable

## Install

```bash
# Binary (~10MB)
curl -LO https://github.com/opencontainers/runc/releases/download/v1.1.12/runc.amd64
chmod +x runc.amd64 && sudo mv runc.amd64 /usr/local/bin/runc
```

## Build rootfs

```bash
mkdir -p rootfs/{bin,lib}
# Copy your compiled app here
cp schemaorg-agent rootfs/bin/
```

## config.json

```json
{
  "ociVersion": "1.0.2",
  "process": {
    "terminal": false,
    "user": { "uid": 0, "gid": 0 },
    "args": ["/bin/schemaorg-agent"],
    "env": ["PATH=/bin"]
  },
  "root": {
    "path": "rootfs",
    "readonly": true
  },
  "hostname": "schemaorg",
  "mounts": [
    {
      "destination": "/",
      "type": "tmpfs"
    }
  ]
}
```

## Run

```bash
runc run schemaorg
```

## Why runc?

| | Docker | runc |
|--------|------|
| Size | ~100MB | ~10MB |
| Layers | 10+ | 1 |
| Security | Large | Minimal |

**runc** = Pure CNCF, no bloat.