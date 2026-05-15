# Deploy to Koyeb (Free)

## Prerequisites

1. **Get free API key** at https://console.groq.com
2. **Get NEXTAUTH_SECRET**: `openssl rand -base64 32`

---

## Option 1: Koyeb Dashboard (GUI)

### Step 1: Create Account

1. Go to https://koyeb.com
2. Sign up with GitHub (free)
3. Verify email

### Step 2: Create App

1. Click **"Create App"**
2. Choose **"GitHub"** as source
3. Select repo: `opendataworld/schemadb`
4. Branch: `main`

### Step 3: Configure

| Setting | Value |
|---------|-------|
| **Name** | schemaorg-agent |
| **Region** | Frankfurt (or closest) |
| **Builder** | Dockerfile (or Nixpacks) |
| **HTTP Port** | 3000 |

### Step 4: Environment Variables

Add in **"Variables"** tab:

```
GROQ_KEY=sk-your-key-here
NEXTAUTH_SECRET=your-generated-secret
NEXTAUTH_URL=https://your-app.koyeb.app
NODE_ENV=production
```

### Step 5: Deploy

Click **"Deploy"**

Wait ~2 minutes. You'll get URL: `https://schemaorg-agent-xxx.koyeb.app`

---

## Option 2: Koyeb CLI

```bash
# Install Koyeb CLI
brew install koyeb/cli/koyeb

# Or curl
curl -fsSL https://get.koyeb.com | bash

# Login
koyeb login

# Create app
koyeb app create schemaorg-agent \
  --source github:opendataworld/schemadb \
  --regions fra \
  --env GROQ_KEY=sk-xxx,NEXTAUTH_SECRET=xxx,NEXTAUTH_URL=https://xxx.koyeb.app
```

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| Build failed | Check `npm run build` works locally |
| 500 error | Check `GROQ_KEY` is set correctly |
| 401 error | Regenerate `NEXTAUTH_SECRET` |
| Timeout | Increase timeout in settings |

---

## Verify It Works

1. Visit your Koyeb URL
2. Sign in (if using auth)
3. Ask: "What is schema.org?"
4. Should stream response citing schema.org

---

## Notes

- **Free tier**: 1 app, 512MB RAM, sleeps after 5 min inactivity
- **Wake up**: Takes ~10 seconds (first request)
- **Custom domain**: Add in Settings → Domains