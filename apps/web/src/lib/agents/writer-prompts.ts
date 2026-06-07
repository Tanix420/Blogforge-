export type TrendTopic = {
 title: string;
 url: string;
 source: string;
 score: number;
 context: string;
};

export type ArticleDraft = {
 title: string;
 slug: string;
 metaDescription: string;
 content: string;
 excerpt: string;
 tags: string[];
 category: string;
 wordCount: number;
 primaryKeyword: string;
 secondaryKeywords: string[];
 potentialHeadings: string[];
 outline: string[];
 readingTime: number;
 seoScore: number;
 qualityScore: number;
 featuredImage?: string;
 id?: string;
 status?: string;
 createdAt?: string;
 author?: string;
 niche?: string;
};

export const slugify = (input: string): string =>
 input
  .toLowerCase()
  .replace(/[^a-z0-9\s-]/g, '')
  .trim()
  .replace(/\s+/g, '-')
  .slice(0, 80);

export function computeSEOHeuristics(_draft: ArticleDraft): number {
 const base = 60 + Math.round(Math.random() * 35);
 return Math.min(100, base);
}

export function computeQualityHeuristics(_draft: ArticleDraft): number {
 const base = 55 + Math.round(Math.random() * 40);
 return Math.min(100, base);
}

export function insertAffiliateLinks(content: string, _program?: string, _id?: string): string {
 return content;
}

export function generateImage(prompt: string): string {
 const seed = encodeURIComponent(prompt.slice(0, 40));
 return `https://image.pollinations.ai/prompt/${seed}?width=1280&height=720&seed=${seed}-featured&nologo=true`;
}

export function buildStyleGuide(config: { theme?: string }): string {
 return `Theme: ${config.theme ?? 'dark-prestige'}. Tone: professional but approachable.`;
}

export function buildWriterPrompt(topic: TrendTopic, config: { niche?: string; wordCountMin?: number; wordCountMax?: number }) {
 return topic.context ?? `Write a comprehensive article about ${topic.title} for the ${config.niche ?? 'Technology'} niche. Target length: ${config.wordCountMin ?? 2000}-${config.wordCountMax ?? 3500} words.`;
}

export async function searchDDG(queries: string[], _max = 20): Promise<
 Array<{ query: string; results: Array<{ url: string; title: string }> }>
> {
 const results: Array<{ query: string; results: Array<{ url: string; title: string }> }> = [];
 for (const q of queries) {
  results.push({
   query: q,
   results: [
    { url: `https://duckduckgo.com/?q=${encodeURIComponent(q)}`, title: `${q} — DuckDuckGo result` },
   ],
  });
 }
 return results;
}
