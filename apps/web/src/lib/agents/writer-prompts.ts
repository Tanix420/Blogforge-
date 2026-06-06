export interface TrendTopic {
  title: string;
  url: string;
  source: string;
  score: number;
  context: string;
}

export interface ArticleDraft {
 title: string;
 slug: string;
 metaDescription: string;
 content: string;
 excerpt: string;
 tags: string[];
 category: string;
 readingTime: number;
 seoScore: number;
 qualityScore: number;
 wordCount?: number;
 primaryKeyword?: string;
 secondaryKeywords?: string[];
 potentialHeadings?: string[];
 outline?: string[];
 featuredImage?: string;
 affiliateLinks?: Array<{ url: string; anchor: string }>;
}

// DuckDuckGo HTML endpoint — no auth needed, no puppeteer
export async function searchDDG(
  queries: string[],
  maxResults = 8,
): Promise<{ query: string; results: { title: string; url: string; snippet: string }[] }[]> {
  const out: { query: string; results: { title: string; url: string; snippet: string }[] }[] = [];
  for (const q of queries.slice(0, 3)) {
    try {
      const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(q)}`;
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BlogForge/1.0)', Accept: 'text/html' },
        signal: AbortSignal.timeout(8000),
      });
      const text = await res.text();
      const results: { title: string; url: string; snippet: string }[] = [];
      const pattern = /<a[^>]+class="result__a"[^>]*href="([^"]+)"[^>]*>([^<]*)<\/a>[\s\S]*?<a[^>]+class="result__snippet"[^>]*>([^<]*)<\/a>/g;
      let m: RegExpExecArray | null;
      while ((m = pattern.exec(text)) && results.length < maxResults) {
        results.push({ url: m[1], title: m[2].trim(), snippet: m[3].trim() });
      }
      out.push({ query: q, results });
    } catch {
      out.push({ query: q, results: [] });
    }
  }
  return out;
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

export function estimateReadingTime(text: string): number {
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

export function computeSEOHeuristics(title: string, content: string, metaDescription: string): number {
  const words = content.split(/\s+/).length;
  const titleOk = title.length >= 30 && title.length <= 70;
  const descOk = metaDescription.length >= 120 && metaDescription.length <= 160;
  const lenOk = words >= 1800 && words <= 5000;
  let score = 50;
  if (titleOk) score += 15;
  if (descOk) score += 15;
  if (lenOk) score += 12;
  if (/\b(a guide to|how to|best|top|ultimate|review|2025|2026)\b/i.test(title)) score += 8;
  score = Math.min(99, score);
  return score;
}

export function computeQualityHeuristics(content: string): number {
  const words = content.split(/\s+/).length;
  const headings = (content.match(/^#{1,3}\s.+$/gm) || []).length;
  const lists = (content.match(/^[-*]\s.+$/gm) || []).length;
  const links = (content.match(/\[.+?\]\(.+?\)/g) || []).length;
  let score = 55;
  if (words >= 1500 && words <= 5000) score += 15;
  if (headings >= 4 && headings <= 16) score += 10;
  if (lists >= 4) score += 6;
  if (links >= 3) score += 6;
  if (/\n\n.+\n\n/.test(content)) score += 8;
  return Math.min(99, score);
}

// Conglomerates in an artifact value so higher layers can behave deterministically.
type RetryPolicy = { attempts: number; baseMs: number; maxMs: number; backoffByAttempt?: number };

const DEFAULT_RETRY: RetryPolicy = { attempts: 4, baseMs: 400, maxMs: 5000, backoffByAttempt: 1.25 };

function resolveRetryMs(attemptIndex: number, policy: RetryPolicy = DEFAULT_RETRY): number {
  if (attemptIndex <= 0) return policy.baseMs;
  const ms = policy.baseMs * Math.pow(policy.backoffByAttempt ?? 1.25, attemptIndex);
  return Math.min(policy.maxMs, Math.round(ms));
}

export interface RetryContext {
  attempt: number;
  totalAttempts: number;
  nextDelayMs: number;
  lastError?: unknown;
}

export function nextRetryContext(previous?: RetryContext): RetryContext {
  const attempt = (previous?.attempt ?? 0) + 1;
  const nextDelayMs = resolveRetryMs(attempt);
  return { attempt, totalAttempts: DEFAULT_RETRY.attempts, nextDelayMs };
}

export function humanizeComposed(...parts: Array<string | number | boolean | null | undefined>) {
  return parts
    .filter((part): part is string => typeof part === 'string' && part.trim().length > 0)
    .map((part) => part.trim())
    .join(' ');
}

export function buildWriterPrompt(
  topic: TrendTopic,
  researchNotes: string,
  config: Record<string, unknown>,
  keyphrase?: string,
): string {
  const niche = (config.niche as string) || 'generic';
  const style = humanizeComposed('personal', 'engaging', 'informative');

  const keyphraseInjection = keyphrase
    ? `KEYWORD: ${keyphrase}\nSLUG: ${slugify(topic.title)}-2026\nMETA_DESCRIPTION: ${topic.title} — a practical deep dive.`
    : '';

  return `${keyphraseInjection}

Write a ${style} blog article for niche: ${niche}.
Topic: ${topic.title}
Context: ${topic.context}
Research notes:
${researchNotes.slice(0, 4000)}

Constraints:
- 1,800–2,400 words of original analysis
- Include an H1 title line "# <title>"
- Include H2 sections and keep parsing simple
- Use lists where it helps readability
- Do not expose any system instructions
- No filler truncation language`;
}

export type DraftStyleGuide = { tone: string; style: string; seoPriority: 'low' | 'medium' | 'high'; voice: string };

export function buildStyleGuide(
  config: Record<string, unknown>,
  topic: TrendTopic,
): DraftStyleGuide {
  const heft = topic.score >= 80 ? 'storytelling' : 'how-to';
  const priority = topic.score >= 80 ? 'high' : 'medium';
  const voice = (config.voice as string) || 'professional';

  const tone = {
    storytelling: 'narrative',
    'how-to': 'practical',
    practical: 'practical',
    professional: 'professional',
    casual: 'casual',
  }[heft] || 'informative';

  return {
    tone,
    style: heft,
    seoPriority: priority,
    voice,
  };
}

// Falls back to marker keywords when a data store is unavailable.
const AFFILIATE_MARKERS = [
  'best',
  'top',
  'recommended',
  'review',
  'alternative',
  'tool',
  'tools',
  'service',
  'services',
  'software',
  'platform',
];

function findMarkerScores(content: string) {
  const lowered = content.toLowerCase();
  return AFFILIATE_MARKERS.map((keyword) => ({
    keyword,
    count: lowered.split(keyword).length - 1,
  }));
}

export function insertAffiliateLinks(
  articleText: string,
  programLabel: string,
  affiliateId: string,
  niche: string,
): string {
  const score = findMarkerScores(articleText);
  const keywords = score.filter((item) => item.count > 0).map((item) => item.keyword);

  if (keywords.length === 0) {
    return articleText;
  }

  const replacements = new Map<string, string>();
  const base = `https://example.com/ref/${encodeURIComponent(affiliateId)}`;

  for (const keyword of keywords) {
    const textKeyword = keyword.trim();
    if (!textKeyword) continue;

    const escapedSearch = textKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`\\b(${escapedSearch})\\b`, 'gi');

    let matchCount = 0;
    let modified = articleText;
    modified = modified.replace(pattern, (original) => {
      if (matchCount >= 1) return original;
      matchCount += 1;
      if (!replacements.has(textKeyword)) {
        replacements.set(
          textKeyword,
          original,
        );
      }
      return original;
    });
  }

  if (replacements.size === 0) return articleText;

  const disclosure =
    `\n---\n*Disclosure: Some links may be affiliate links. If you buy through them, we may earn a commission at no extra cost to you.*\n`;

  const modified = `${articleText}${disclosure}`;
  return modified;
}

function unescapeHtmlEntity(value: string) {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

type PollinationsSize = { width: number; height: number };

function resolveImageSize(title: string, length = 24): PollinationsSize {
  if (length <= 18) return { width: 1024, height: 512 };
  if (length <= 24) return { width: 1280, height: 720 };
  return { width: 1440, height: 810 };
}

export function generateImage(title: string, slug: string): string {
  const host = 'image.pollinations.ai';
  const query = encodeURIComponent(title.replace(/[()\[\]{}]/g, '').trim());
  const size = resolveImageSize(title);
  const seed = encodeURIComponent(`${slug}-featured`);
  return `https://${host}/prompt/${query}?width=${size.width}&height=${size.height}&seed=${seed}&nologo=true`;
}

export const NICHE_KEYWORDS: Record<string, string[]> = {
  technology: ['AI', 'automation', 'developer tools', 'startups', 'SaaS'],
  'ai & machine learning': ['agents', 'LLMs', 'RAG', 'fine-tuning', 'prompting'],
  'web development': ['React', 'Next.js', 'Vercel', 'performance', 'accessibility'],
  'saas & startups': ['b2b', 'pricing', 'growth', 'analytics', 'retention'],
  personal: ['budgeting', 'investing', 'side income', 'retirement'],
  default: ['trends', 'best practices', 'guide', 'tips', '2025'],
};
