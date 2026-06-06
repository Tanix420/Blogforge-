# BlogForge Deploy Guide

BlogForge is a single Next.js 15 app in `apps/web`. This guide covers one-click and self-hosted deploys.

## Prerequisites
- Node.js >= 18
- OS-level: curl (for health checks)
- Optional: Docker 20+ for container deploys

## Environment variables
Set these before first deploy:

| Variable | Purpose | Required |
|----------|---------|----------|
| `BLOGFORGE_ADMIN_PASSWORD` | Admin login password | Yes |
| `OPENROUTER_API_KEY` | LLM provider key | Yes |
| `OPENROUTER_MODEL` | Default model ID | No |
| `NEXT_TELEMETRY_DISABLED` | Opt out of telemetry | No |

## Deploys

### Vercel
```bash
vercel --prod
```
- Add env vars in Project Settings → Environment Variables.
- Uses `vercel.json` for headers/redirects and function timeouts.

### Netlify
```bash
netlify deploy --prod --dir=apps/web/.next
```
- Connect repo and Netlify auto-detects Next.js via plugin.

### Fly.io
```bash
fly launch
fly deploy
```
- Uses `fly.toml`; sets HTTP + HTTPS listeners.

### Railway
```bash
railway init
railway up
```
- Uses `railway.json`; healthcheck at `/api/health`.

### Render
- Create new Web Service → Docker → connect repo.
- Uses `render.yaml`.

### Docker (self-hosted)
```bash
docker compose up --build
```

## Health
After deploy, verify:
```bash
curl https://<host>/api/health
```
Expected: `{"status":"ok"}` with services `frontend`, `api`, `agents`, `database`, `search`.

## Notes
- Admin is at `/admin` (login), `/admin/dashboard` is the app shell.
- Static pages: home, about, articles, categories, tags, sitemap, RSS.
- Dynamic routes: `/articles/[slug]` and tag pages.
- Content folder: `content/` holds config and generated assets.
