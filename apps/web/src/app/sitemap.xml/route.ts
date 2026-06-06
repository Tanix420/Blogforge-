import { Metadata } from "next";
import { getArticles } from "@/lib/articles";

export async function GET() {
  const articles = getArticles();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const urls = articles.map((article: any) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: article.publishedAt || article.createdAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const staticUrls = [
    { url: baseUrl, lastModified: new Date().toISOString(), changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date().toISOString(), changeFrequency: "monthly" as const, priority: 0.3 },
  ];

  const allUrls = [...staticUrls, ...urls];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allUrls.map(({ url, lastModified, changeFrequency, priority }) => `  <url>
    <loc>${url}</loc>
    <lastmod>${new Date(lastModified).toISOString()}</lastmod>
    <changefreq>${changeFrequency}</changefreq>
    <priority>${priority}</priority>
  </url>`).join("\n")}
</urlset>`;

  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
}
