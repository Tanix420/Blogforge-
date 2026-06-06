import { NextResponse } from "next/server";
import { getPublishedArticles } from "@/lib/articles";

export async function GET() {
  const articles = getPublishedArticles();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const blogTitle = process.env.NEXT_PUBLIC_BLOG_TITLE || "BlogForge AI";

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${blogTitle}</title>
    <link>${baseUrl}</link>
    <description>${blogTitle} — AI-Powered Content</description>
    <language>en-us</language>
    ${articles.map((a) => `
    <item>
      <title>${a.title}</title>
      <link>${baseUrl}/articles/${a.slug}</link>
      <guid isPermaLink="true">${baseUrl}/articles/${a.slug}</guid>
      <pubDate>${new Date(a.publishedAt || a.createdAt).toUTCString()}</pubDate>
      <description>${a.excerpt}</description>
    </item>`).join("")}
  </channel>
</rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/xml+rss" } });
}
