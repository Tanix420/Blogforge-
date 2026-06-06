import { saveArticles, getArticles, publishArticle } from '@/lib/articles';
import path from 'path';
import fs from 'fs';

const extra = [
  {
    id: 'bf-post-slo-1',
    title: 'The Difference Between SEO and AEO',
    slug: 'seo-vs-aeo-what-changes-in-2026',
    excerpt: 'Search engine optimization is no longer enough. AI engine optimization is becoming table stakes for publishers in 2026.',
    content: `# The Difference Between SEO and AEO

Search engine optimization is no longer enough. AI engine optimization is becoming table stakes for publishers in 2026. The two disciplines overlap but the requirements are distinct.

## What SEO demands

SEO for years has meant satisfying two audiences. The first is the crawler. It needs structure, speed, mobile-friendliness, internal links, and a logical heading hierarchy. The second is the human. They need scannable paragraphs, answers in two seconds or less, and clear next steps.

The highest-leverage SEO investments in 2026 remain the same as they were in 2024. Technical health, topical authority, and link equity still drive long-run visibility. What changed is the appearance of a third audience: the answer engine. Search assistants and conversational interfaces now parse pages for claims, support, and source diversity. SEO alone does not answer their questions.

## AEO is different

AEO means building articles so language models can surface, cite, and summarize them accurately. The practical requirements flow from that goal. Authors must separate fact from opinion, provide inline attribution, use schema-friendly structure, and keep paragraphs focused on one concept.

Articles built for AEO outperform legacy SEO content because language models parse structure and evidence better than anchor text alone. A clean H2 hierarchy, explicit definitions, dates, named experts, and listable claims all improve pick rate in assistant answers.

## The practical playbook for 2026

- Write claim-first paragraphs. State the point, then the evidence.
- Add inline citations so an extractor can verify the claim.
- Keep headings descriptive. Avoid clickbait models that rely on ambiguity for curiosity.
- Test outputs in chat-based search as well as web search.
- Separate opinion from summary so an assistant does not misrepresent perspective as fact.

Teams that combine AEO with website optimization will see higher referral and assistant-driven traffic. Those that ignore AEO will find leaderboard exposure shrinking as chat adoption rises.`,
    featuredImage: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&q=80',
    category: 'SEO',
    tags: ['seo', 'aeo', 'search', 'optimization'],
    readingTime: 5,
    seoScore: 96,
    qualityScore: 93,
    status: 'published',
    publishedAt: '2026-06-02T14:15:00.000Z',
    createdAt: '2026-06-02T14:15:00.000Z',
    updatedAt: '2026-06-02T14:15:00.000Z',
    author: 'BlogForge AI',
    metaDescription: 'SEO is table stakes. Learn what AI engine optimization adds in 2026 and how to adjust content, structure, and citations.'
  },
];

const INDEX_PATH = path.join(process.cwd(), '..', '..', '..', '..', 'content', 'articles', 'index.json');

function load(): any[] {
  try { return JSON.parse(fs.readFileSync(INDEX_PATH, 'utf-8')); } catch { return []; }
}

function save(data: any[]) {
  fs.mkdirSync(path.dirname(INDEX_PATH), { recursive: true });
  fs.writeFileSync(INDEX_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

const current = load();
const byId = new Map(current.map((a: any) => [a.id, a]));
for (const item of extra) byId.set(item.id, item);
const merged = Array.from(byId.values()).sort((a: any, b: any) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
save(merged);
console.log('Seeded extra articles. Total:', merged.length);
