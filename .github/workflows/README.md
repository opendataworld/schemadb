# Deploy Schema.org Agent to GitHub Pages

**Note:** GitHub Pages is static-only. The chat API requires a server (Vercel, Railway, etc.).

## Quick Deploy Options

### Option 1: Vercel (Free, Recommended)

```bash
npm install -g vercel
vercel
```

Then add `GROQ_KEY` in Vercel dashboard → Settings → Environment Variables.

https://vercel.com

### Option 2: Static Landing Page Only

If you only want the landing page (no chat), create this workflow:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: write
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'npm'
      
      - name: Install
        run: npm ci
      
      - name: Build static
        run: npm run build
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deploy.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4
```

And in `next.config.ts`:
```typescript
const nextConfig = {
  output: "export",
  trailingSlash: true,
}
```

### Option 3: Railway

```bash
npm install -g @railway/cli
railway login
railway init
railway deploy
```

### Option 4: Docker

```bash
docker build -t schemaorg-agent .
docker run -p 3000:3000 -e GROQ_KEY=sk-xxx schemaorg-agent
```

## Environment Variables

| Variable | Required | Value |
|----------|----------|-------|
| `NEXTAUTH_SECRET` | Yes | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Yes | Your deployment URL |
| `GROQ_KEY` | One required | From https://console.groq.com |

## GitHub Pages Settings

1. Go to Settings → Pages
2. Under "Build and deployment":
   - Source: Deploy from a branch
   - Branch: gh-pages (Wait for workflow to create)
3. Under "Build and deployment" → Select "GitHub Actions"

**For full chat functionality, use Vercel or Railway instead.**