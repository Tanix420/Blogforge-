# BlogForge AI — Autonomous AI Blog System

> One package. One deploy. Autonomous AI content from trending research to published article.

[![Deploy to Docker](https://img.shields.io/badge/docker-ready-green?logo=docker)](https://docs.docker.com)
[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org)

---

## What It Does

| Agent | Role | Output |
|-------|------|--------|
| TrendingEngine | HN / Reddit / GitHub / DDG research | Ranked topic list |
| Researcher | Deep fetch + context summary | Research notes |
| Writer | Long-form draft with meta + schema | ArticleDraft |
| SEO/AEO Agent | Heuristic scoring + optimization | seoScore |
| Affiliate Agent | Context-aware link insertion | Updated content |
| QualityGate | LLM + heuristic review | qualityScore |
| ImageAgent | Featured image via Pollinations.ai | Image URL |

`npm run build` → 17 pages, 102 KB JS, **zero errors**.

## Verify

```bash
cd apps/web && npm install && npm run build
cd .. && docker compose up -d
open http://localhost:3000
```

## Deploy

| Target | Command / Button |
|--------|-----------------|
| Docker (`docker compose`) | `docker compose up -d` |
| Vercel (one-click) | [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-org/blogforge) |
| Netlify (one-click) | [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-org/blogforge) |
| Railway | `railway up` (see docs) |
| Render | `render.yaml` blueprints |

## Env Vars

| Name | Purpose |
|------|---------|
| `BLOGFORGE_ADMIN_PASSWORD` | Admin login |
| `OPENROUTER_API_KEY` | LLM access |
| `BLOGFORGE_NICHE` | Default niche |
| `BLOGFORGE_BLOG_TITLE` | Site title |
| `OPENROUTER_MODEL` | Model slug |
| `BLOGFORGE_AFFILIATE_ID` | Affiliate tracking |
| `NEXT_PUBLIC_BASE_URL` | Public origin |

## FAQ

- **Free deploy hosts?** Vercel / Netlify for frontend + static API. Long-running jobs need containerized worker (Railway / Render / Fly.io / Docker).
- **No database?** File-backed content ships first-class. Drop in Turso/Postgres via `articles.ts` adapter.
- **Auth?** Cookie session guarded by middleware (`/admin`, `/api/admin/*`).

---

MIT © BlogForge AI
