import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'content', 'articles');
const INDEX_PATH = path.join(DATA_DIR, 'index.json');

function ensureDir(): void {
  try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch {}
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
      const keys = Object.keys(parsed);
      if (keys.length && keys.every(k => /^\d+$/.test(k))) {
        return keys.sort((a, b) => Number(a) - Number(b)).map(k => (parsed as any)[k]);
      }
    }
    return [];
  } catch {
    return [];
  }
}

export function saveArticles(articles: any[]): void {
  ensureDir();
  fs.writeFileSync(INDEX_PATH, JSON.stringify(articles, null, 2), 'utf-8');
}

export function getPublishedArticles(): any[] {
  return getArticles().filter((a: any) => a.status === 'published');
}

export function getArticleBySlug(slug: string): any | undefined {
  return getArticles().find((a: any) => a.slug === slug);
}

export function publishArticle(slug: string): boolean {
  const articles = getArticles();
  const article = articles.find((a: any) => a.slug === slug);
  if (!article) return false;
  article.status = 'published';
  article.publishedAt = new Date().toISOString();
  saveArticles(articles);
  return true;
}

export function unpublishArticle(slug: string): boolean {
  const articles = getArticles();
  const article = articles.find((a: any) => a.slug === slug);
  if (!article) return false;
  article.status = 'draft';
  saveArticles(articles);
  return true;
}
