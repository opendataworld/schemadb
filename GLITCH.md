# Deploy to Glitch (Free)

## No credit card required!

---

## Deploy Steps

### Option 1: Import from GitHub

1. Go to https://glitch.com
2. Click **"New Project"** → **"Import from GitHub"**
3. Enter: `opendataworld/schemadb`
4. Wait for import (~1 min)

### Option 2: Manual Import

1. Go to https://glitch.com
2. Click **"New Project"**
3. Delete all files except `README.md`
4. Paste project files
5. Or use: https://github.com/glitchdotcom/glitch-template-nextjs

---

## Add Environment Variables

1. Click **".env"** file
2. Add:

```
GROQ_KEY=sk-your-groq-key
NEXTAUTH_SECRET=your-secret-generate-with-openssl
NEXTAUTH_URL=https://your-project.glitch.me
```

3. Click **"Save"**
4. Click **"Show"** → **"In a New Window"**

---

## Important: Enable API Routes

Glitch defaults to static. To enable API:

1. Click **"Package.json"**
2. Change `"start": "next start"` to:

```json
"start": "next start",
"prisma": "npx prisma generate"
```

3. Edit `next.config.ts`:

```typescript
const nextConfig = {
  // Add this:
  apiRoute: {
    bodyParser: false,
  },
}
export default nextConfig
```

Or better - Glitch may need a custom server:

1. Create `server.js`:

```javascript
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    const parsed = parse(req.url, true)
    handle(req, res, parsed)
  }).listen(3000, () => {
    console.log('> Ready on http://localhost:3000')
  })
})
```

2. Update package.json start:
```json
"start": "node server.js"
```

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| API 404 | Use custom server.js above |
| Build fails | Check npm packages installed |
| 500 Error | Check GROQ_KEY in .env |

---

## Notes

- **Free tier**: 1000 hours/month
- **Sleeps**: After 5 min no activity
- **Wake**: ~20 seconds
- **Custom domain**: Settings → Custom Domain

---

## Alternative: Glitch + Vercel

Deploy static to Glitch, API to Vercel:
- Landing page: Glitch (free)
- Chat API: Vercel (free, has API)