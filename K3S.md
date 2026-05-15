# K3s (Lightweight K8s)

## Install (single command, ~5MB)

```bash
curl -sfL https://get.k3s.io | sh -
```

## Deploy

```bash
kubectl apply -f - <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: schemaorg-agent
spec:
  replicas: 1
  selector:
    matchLabels:
      app: schemaorg-agent
  template:
    metadata:
      labels:
        app: schemaorg-agent
    spec:
      containers:
      - name: app
        image: schemaorg-agent:latest
        ports:
        - containerPort: 3000
        env:
        - name: GROQ_KEY
          value: "sk-your-key"
        - name: NEXTAUTH_SECRET
          value: "your-secret"
        - name: NEXTAUTH_URL
          value: "https://your-domain.com"
        livenessProbe:
          httpGet:
            path: /api/chat
            port: 3000
          initialDelaySeconds: 30
---
apiVersion: v1
kind: Service
metadata:
  name: schemaorg-agent
spec:
  type: NodePort
  selector:
    app: schemaorg-agent
  ports:
  - port: 80
    targetPort: 3000
EOF
```

## Check

```bash
kubectl get pods,svc
curl http://localhost
```

---

## Build & Run

```bash
# Build
docker build -t schemaorg-agent .

# Run container
docker run -d -p 3000:3000 \
  -e GROQ_KEY=sk-your-key \
  -e NEXTAUTH_SECRET=your-secret \
  schemaorg-agent
```

---

## K3s vs K8s

| | K3s | K8s |
|---|-----|-----|
| Size | 5MB | 1GB |
| RAM | 512MB | 2GB |
| SQL | Built-in | Add etcd |
| Ingress | Traefik | Add Nginx |
## llama.cpp in k3s

```yaml
# k3s-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: llama-cpp
spec:
  replicas: 1
  selector:
    matchLabels:
      app: llama-cpp
  template:
    metadata:
      labels:
        app: llama-cpp
    spec:
      containers:
      - name: llama
        image: ghcr.io/ggerganov/llama.cpp:server-cuda
        ports:
        - containerPort: 8080
        resources:
          limits:
            nvidia.com/gpu: 1
---
apiVersion: v1
kind: Service
metadata:
  name: llama-cpp
spec:
  ports:
  - port: 8080
  selector:
    app: llama-cpp
```

```bash
kubectl apply -f k3s-deployment.yaml
export LLAMA_CPP_HOST=llama-cpp:8080
```
