# Deploy to Fly.io (Free)

## Prerequisites

1. **Get API key** at https://console.groq.com
2. **Install CLI**: `npm install -g flyctl`

---

## Deploy Steps

### Step 1: Login

```bash
flyctl auth login
```

### Step 2: Init

```bash
cd schemadb
flyctl launch --name schemaorg-agent --org personal
```

**Prompts:**
- App name: `schemaorg-agent`
- Region: `fra` (Frankfurt) or closest
- DB: `No` (not needed)

This creates `fly.toml`

### Step 3: Secrets

```bash
flyctl secrets set GROQ_KEY=sk-your-key
flyctl secrets set NEXTAUTH_SECRET=$(openssl rand -base64 32)
flyctl secrets set NEXTAUTH_URL=https://schemaorg-agent.fly.dev
```

### Step 4: Deploy

```bash
flyctl deploy
```

---

## Verify

```bash
flyctl open
```

Should open: `https://schemaorg-agent.fly.dev`

---

## Common Commands

| Command | Description |
|---------|-------------|
| `flyctl status` | Check app status |
| `flyctl logs` | View logs |
| `flyctl restart` | Restart app |
| `flyctl scale show` | Show resources |

---

## Notes

- **Free**: 3 shared-CPU apps
- **No sleep**: Always on
- **Auto-suspend**: After 5 min no traffic (disable with `flyctl scale memory 256`)
- **Custom domain**: `flyctl certs add`

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| Build failed | Check Dockerfile |
| 500 error | Verify GROQ_KEY secret |
| timeout | Increase in fly.toml |