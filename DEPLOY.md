# Deploy to Vercel (Free)

## Option 1: CLI (Fastest)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy (in project folder)
cd schemadb
vercel
```

**Follow the prompts:**
```
? Set up and deploy? [Y/n] → Y
? Which scope? → Your name
? Want to override settings? [Y/n] → N
```

**Add environment variable (free AI):**
```bash
vercel env add GROQ_KEY
# Paste your key from https://console.groq.com
```

Done! You'll get a URL like `https://schemadb-xxx.vercel.app`

---

## Option 2: GitHub (Auto-deploy)

### Step 1: Connect to Vercel

1. Go to https://vercel.com
2. Click **"Add New..."** → **Project**
3. Import your GitHub repo: `opendataworld/schemadb`
4. Click **"Deploy"**

### Step 2: Add Environment Variables

After first deploy, go to:

**Settings → Environment Variables**

Add these:

| Name | Value |
|------|-------|
| `GROQ_KEY` | Get free at https://console.groq.com |
| `NEXTAUTH_SECRET` | Run: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your Vercel URL |

### Step 3: Redeploy

Go to **Deployments** → Click the latest → **"Redeploy"**

---

## Option 3: Docker

```bash
# Build
docker build -t schemaorg-agent .

# Run
docker run -p 3000:3000 \
  -e GROQ_KEY=sk-your-key \
  -e NEXTAUTH_SECRET=your-secret \
  -e NEXTAUTH_URL=http://localhost:3000 \
  schemaorg-agent
```

---

## FAQ

**Is Vercel really free?** Yes, hobby tier requires no credit card.

**How long does it take?** ~2 minutes first deploy, ~30 seconds after.

**Can I use my own domain?** Yes, add in Settings → Domains.

**What if I run out of bandwidth?** You'll get an email. For free, 100GB/month is plenty.

**Does it work with OAuth?** Yes, add Google credentials in Environment Variables.

---

## Test Your Deployment

1. Visit your Vercel URL
2. Sign in (or skip if not configured)
3. Type: "What is schema.org?"
4. Should get a streaming response citing schema.org

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| 500 Internal Error | Check `GROQ_KEY` is set |
| 401 Unauthorized | Check `NEXTAUTH_SECRET` |
| Build failed | Run `npm run build` locally first |