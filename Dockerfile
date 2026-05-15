# Stage 1: Install dependencies
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Build the application
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Production runtime
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/chat || exit 1

CMD ["node", "server.js"]

---

# Lightweight CNCF: K3s (5MB)

## Install (one line)

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
  selector:
    app: schemaorg-agent
  ports:
  - port: 80
    targetPort: 3000
  type: NodePort
EOF
```

## Check

```bash
kubectl get pods,svc
curl http://localhost/api/chat
```

**Total: ~5MB vs k8s 1GB**