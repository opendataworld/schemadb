# Kubernetes (CNCF) Setup

## Local: KIND (Kubernetes IN Docker)

### Install KIND + kubectl

```bash
# KIND
curl -Lo /usr/local/bin/kind https://kind.sigs.k8s.io/dl/v0.22.0/kind-linux-amd64
chmod +x /usr/local/bin/kind

# kubectl
curl -LO https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl
chmod +x kubectl && sudo mv kubectl /usr/local/bin/
```

### Create Cluster

```bash
kind create cluster --name schemaorg
```

## Production: k3s

```bash
# Single server
curl -sfL https://get.k3s.io | sh -

# Or withHA
curl -sfL https://get.k3s.io | K3S_TOKEN=xxx K3S_URL=https://server:6443 sh -
```

## Deploy

```bash
# Build & load
docker build -t schemaorg-agent .
kind load docker-image schemaorg-agent

# Apply manifests
kubectl apply -f k8s.yaml

# Check
kubectl get pods,svc,ingress
```

## k8s.yaml features

| Feature | Implementation |
|--------|---------------|
| **2 replicas** | Anti-affinity |
| **Rolling update** | maxSurge: 1, maxUnavailable: 0 |
| **HPA** | 2-10 replicas, 70% CPU |
| **Secrets** | Kubernetes Secrets |
| **Ingress** | Traefik |
| **Health checks** | Liveness + Readiness + Startup |
| **Resources** | Requests + Limits |