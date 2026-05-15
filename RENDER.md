# Deploy to Render (Free)

## Prerequisites

1. **Get free API key** at https://console.groq.com
2. **Get NEXTAUTH_SECRET**: `openssl rand -base64 32`

---

## Deploy Steps

### Step 1: Connect GitHub

1. Go to https://render.com
2. Click **"Connect GitHub"**
3. Authorize your GitHub account
4. Search for `schemadb`

### Step 2: Create Web Service

1. Click **"New"** → **"Web Service"**
2. Find `opendataworld/schemadb`
3. Click **"Connect"**

### Step 3: Configure

| Setting | Value |
|---------|-------|
| **Name** | schemaorg-agent |
| **Branch** | main |
| **Build Command** | `npm run build` |
| **Start Command** | `npm run start` |
| **Plan** | Free |

Click **"Deploy"** (first deploy takes ~3-5 minutes)

---

## Step 4: Add Environment Variables

After deploy, go to **"Environment"** tab:

```env
GROQ_KEY=sk-your-groq-key
NEXTAUTH_SECRET=your-secret-from-openssl
NEXTAUTH_URL=https://schemaorg-agent.onrender.com
NODE_ENV=production
```

Click **"Save Changes"** → Redeploy

---

## Step 5: Verify

Visit: `https://schemaorg-agent.onrender.com`

Type: "What is schema.org?"

Should get streaming response!

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| Build timed out | Increase timeout to 10 min |
| 503 Service Unavailable | Cold start, wait 30s |
| 500 Error | Check GROQ_KEY |
| 401 Error | Check NEXTAUTH_SECRET |

---

## Notes

- **Free tier**: 750 hours/month, sleeps after 15 min inactivity
- **Wake up**: ~30 seconds
- **Custom domain**: Settings → Custom Domains
- **Logs**: Dashboard → Logs tab

---

## Free Alternatives to Compare

| Platform | Sleep | RAM | Bandwidth |
|----------|-------|-----|-----------|
| **Render** | 15 min | 512MB | 100GB |
| **Railway** | No | 512MB | $5 credit |
| **Fly.io** | No | 3 apps | Shared |