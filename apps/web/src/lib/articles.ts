import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "content", "articles");
const INDEX_PATH = path.join(DATA_DIR, "index.json");

function ensureDir(): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export function getArticles(): any[] {
 ensureDir();
 try {
  const raw = fs.readFileSync(INDEX_PATH, 'utf-8');
  const parsed = JSON.parse(raw);
  if (Array.isArray(parsed)) return parsed;
  if (parsed && typeof parsed === 'object') {
   if (Array.isArray((parsed as any).articles)) return (parsed as any).articles;
   if (Array.isArray((parsed as any).default)) return (parsed as any).default;
   if (Array.isArray((parsed as any).items)) return (parsed as any).items;
   // Object with numeric keys {"0": {...}, "1": {...}, ...}
   if (Object.keys(parsed).length > 0 && Object.keys(parsed).every(k => /^\d+$/.test(k))) {
    return Object.keys(parsed).sort((a, b) => parseInt(a) - parseInt(b)).map(k => (parsed as any)[k]);
   }
  }
  return [];
 } catch {
  return [];
 }
}

export function saveArticles(articles: any[]): void {
  ensureDir();
  fs.writeFileSync(INDEX_PATH, JSON.stringify(articles, null, 2), "utf-8");
}

export function getPublishedArticles(): any[] {
  return getArticles().filter((a) => a.status === "published");
}

export function getArticleBySlug(slug: string): any | undefined {
  return getArticles().find((a) => a.slug === slug);
}

export function publishArticle(slug: string): boolean {
  const articles = getArticles();
  const article = articles.find((a) => a.slug === slug);
  if (!article) return false;
  article.status = "published";
  article.publishedAt = new Date().toISOString();
  saveArticles(articles);
  return true;
}

export function unpublishArticle(slug: string): boolean {
  const articles = getArticles();
  const article = articles.find((a) => a.slug === slug);
  if (!article) return false;
  article.status = "draft";
  saveArticles(articles);
  return true;
}
