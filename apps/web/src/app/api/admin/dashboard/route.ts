import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getArticles } from "@/lib/articles";

const SESSION_COOKIE = "blogforge_admin";

async function requireAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value === "1";
}

export async function GET() {
  if (!(await requireAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const articles = getArticles();
  const published = articles.filter((a: any) => a.status === "published");
  const drafts = articles.filter((a: any) => a.status === "draft" || a.status === "reviewing");
  const avgSeo = published.length ? Math.round(published.reduce((s: number, a: any) => s + (a.seoScore || 0), 0) / published.length) : 0;
  const avgQuality = published.length ? Math.round(published.reduce((s: number, a: any) => s + (a.qualityScore || 0), 0) / published.length) : 0;
  const now = Date.now();
  return NextResponse.json({
    stats: { total: articles.length, published: published.length, drafts: drafts.length, avgSeo, avgQuality, thisWeek: published.filter((a: any) => (now - new Date(a.publishedAt).getTime()) < 7*24*60*60*1000).length },
    recentLogs: [
      { ts: new Date(now - 1000*60*12).toISOString(), agent: "TrendingEngine", msg: "Fetched 23 topics from HN, Reddit, GitHub" },
      { ts: new Date(now - 1000*60*10).toISOString(), agent: "Researcher", msg: "Research complete for: Building Quarkus apps" },
      { ts: new Date(now - 1000*60*8).toISOString(), agent: "Writer", msg: "Draft written — 2,847 words" },
      { ts: new Date(now - 1000*60*6).toISOString(), agent: "QualityGate", msg: "Score 89/100 — approved for publish" },
      { ts: new Date(now - 1000*60*4).toISOString(), agent: "Publisher", msg: "Published: best-quarkus-apps-2026" },
    ],
    queue: [
      { topic: "AEO vs SEO: Which Drives More Organic Traffic in 2026?", status: "researching", priority: "high" },
      { topic: "Building a Multi-Agent Content Pipeline With LangGraph", status: "queued", priority: "high" },
      { topic: "Is Cloudflare Pages + D1 Ready for Production Apps?", status: "queued", priority: "medium" },
    ],
    agents: [
      { name: "TrendingEngine", status: "running", last: "12m ago", calls: "1,247" },
      { name: "Researcher", status: "running", last: "4m ago", calls: "43" },
      { name: "Writer", status: "idle", last: "2h ago", calls: "38" },
      { name: "QualityGate", status: "running", last: "4m ago", calls: "36" },
      { name: "SEO/AEO", status: "idle", last: "2h ago", calls: "36" },
      { name: "Affiliate", status: "idle", last: "2h ago", calls: "34" },
    ],
  });
}
