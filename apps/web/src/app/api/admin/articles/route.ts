import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getArticles, saveArticles } from "@/lib/articles";

const SESSION_COOKIE = "blogforge_admin";

async function requireAuth() {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value === "1";
}

export async function GET() {
  if (!(await requireAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(getArticles());
}

export async function POST(req: NextRequest) {
  if (!(await requireAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const articles = getArticles();
  const now = new Date().toISOString();
  const article = {
    id: body.id || `art-${Date.now()}`,
    slug: body.slug || `article-${Date.now()}`,
    title: body.title || "Untitled",
    excerpt: body.excerpt || "",
    content: body.content || "",
    featuredImage: body.featuredImage || "",
    status: body.status || "draft",
    publishedAt: body.publishedAt || now,
    createdAt: body.createdAt || now,
    updatedAt: now,
    tags: body.tags || [],
    niche: body.niche || "",
    wordCount: typeof body.wordCount === "number" ? body.wordCount : (body.content || "").split(/\s+/).length,
    seoScore: body.seoScore ?? 0,
    qualityScore: body.qualityScore ?? 0,
    author: body.author || "BlogForge AI",
    metaDescription: body.metaDescription || "",
  };
  const idx = articles.findIndex((a: any) => a.slug === article.slug);
  if (idx >= 0) articles[idx] = article;
  else articles.unshift(article);
  saveArticles(articles);
  return NextResponse.json(article, { status: idx >= 0 ? 200 : 201 });
}

export async function DELETE(req: NextRequest) {
  if (!(await requireAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const slug = new URL(req.url).searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });
  saveArticles(getArticles().filter((a: any) => a.slug !== slug));
  return NextResponse.json({ ok: true });
}
