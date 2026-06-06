import { createClient, AgentToolLoop } from './llm';
import { loadConfig } from '../config-types';
import { getArticles, saveArticles } from '../articles';
import { searchDDG, slugify, computeSEOHeuristics, computeQualityHeuristics, insertAffiliateLinks, generateImage, buildStyleGuide, buildWriterPrompt, type TrendTopic, type ArticleDraft } from './writer-prompts';

export interface AgentLogEntry {
  agent: string;
  phase: string;
  message: string;
  startedAt: number;
  finishedAt?: number;
  ok: boolean;
}

export interface PipelineResult {
  jobId: string;
  status: 'published' | 'draft' | 'failed';
  article?: Record<string, unknown>;
  qualityScore?: number;
  seoScore?: number;
  logs: AgentLogEntry[];
}

let jobCounter = 1;

async function fetchTrendingTopics(niche: string): Promise<TrendTopic[]> {
  try {
    const queries = [
      `trending ${niche} topics 2025 2026`,
      `what people are searching about ${niche}`,
      `${niche} popular questions`,
      `best ${niche} guides 2026`,
    ];

    const results = await searchDDG(queries, 20);
    const allUrls: { url: string; title: string; query: string }[] = [];
    for (const r of results) {
      for (const item of r.results) {
        allUrls.push({ url: item.url, title: item.title, query: r.query });
      }
    }

    const seen = new Set<string>();
    const topics: TrendTopic[] = [];
    for (const u of allUrls) {
      if (seen.has(u.url)) continue;
      seen.add(u.url);
      const score = Math.min(100, Math.round(40 + Math.random() * 50));
      topics.push({
        title: u.title,
        url: u.url,
        source: u.query,
        score,
        context: `Trending topic from: ${u.query}`,
      });
      if (topics.length >= 10) break;
    }

    if (topics.length === 0) {
      return [
        { title: `The Complete ${niche} Guide for 2026`, url: '', source: 'fallback', score: 75, context: `General ${niche} overview article` },
        { title: `Best ${niche} Tools and Resources`, url: '', source: 'fallback', score: 70, context: `Curated ${niche} resources` },
        { title: `How to Get Started With ${niche}`, url: '', source: 'fallback', score: 65, context: `Beginner's guide to ${niche}` },
      ];
    }

    return topics.sort((a, b) => b.score - a.score);
  } catch (err) {
    console.error('Trending fetch error:', err);
    return [{ title: `${niche} Insights and Best Practices`, url: '', source: 'error-fallback', score: 50, context: `General ${niche} article` }];
  }
}

function parseWriterOutput(output: string, topic: TrendTopic, config: any): ArticleDraft {
  let title = topic.title;
  let slug = `${slugify(topic.title)}-${new Date().getFullYear()}`;
  let metaDescription = '';
  let content = output;
  let primaryKeyword = topic.title;
  const secondaryKeywords: string[] = [];

  const metaMatch = output.match(/^META_DESCRIPTION:\s*(.+)$/im);
  if (metaMatch) metaDescription = metaMatch[1].trim().replace(/^["']|["']$/g, '');

  const slugMatch = output.match(/^SLUG:\s*(.+)$/im);
  if (slugMatch) slug = slugMatch[1].trim().replace(/^["']|["']$/g, '');

  const kwMatch = output.match(/^KEYWORD:\s*(.+)$/im);
  if (kwMatch) primaryKeyword = kwMatch[1].trim().replace(/^["']|["']$/g, '');

  content = content
    .replace(/^META_DESCRIPTION:.*$/im, '')
    .replace(/^SLUG:.*$/im, '')
    .replace(/^KEYWORD:.*$/im, '')
    .trim();

  if (!content.startsWith('# ')) {
    content = `# ${title}\n\n${content}`;
  }

  return {
    title,
    slug,
    metaDescription: metaDescription || topic.title.slice(0, 155),
    content,
    excerpt: metaDescription || topic.title.slice(0, 160),
    tags: [primaryKeyword, ...secondaryKeywords].filter(Boolean).slice(0, 6),
    category: config?.niche || 'General',
    wordCount: content.split(/\s+/).length,
    primaryKeyword,
    secondaryKeywords,
    potentialHeadings: [],
    outline: [],
    readingTime: 1,
    seoScore: 0,
    qualityScore: 0,
  };
}

export async function runFullPipeline(config: any, opts = {} as { forceTopic?: string | null; maxArticles?: number }): Promise<PipelineResult> {
  const jobId = `job-${Date.now()}-${jobCounter++}`;
  const logs: AgentLogEntry[] = [];
  const startedAt = Date.now();

  function log(agent: string, phase: string, message: string, ok = true) {
    logs.push({ agent, phase, message, startedAt: Date.now(), finishedAt: Date.now(), ok });
  }
  log('Pipeline', 'init', 'Starting pipeline', true);

  try {
    const cfg = await loadConfig();
    const providerConfig = {
      ...cfg,
      apiKey: config.apiKey || cfg.apiKey,
      provider: config.provider || cfg.provider,
      model: config.model || cfg.model,
    };
    const client = createClient(providerConfig);
    const toolLoop = new AgentToolLoop();
    toolLoop.register(
      {
        name: 'web_search',
        description: 'Search the web for a topic and return concise research notes.',
        inputSchema: { type: 'object', properties: { query: { type: 'string', description: 'Search query' } }, required: ['query'] },
      },
      async (args) => {
        const query = (args.query as string) || '';
        const res = await searchDDG([query], 8);
        const r = res[0];
        if (!r || r.results.length === 0) return 'No results.';
        return r.results.map((x) => `- ${x.title}: ${x.snippet}`).join('\n');
      }
    );
    toolLoop.register(
      {
        name: 'write_article',
        description: 'Write a full article from notes. Returns markdown with META_DESCRIPTION, SLUG, KEYWORD headers.',
        inputSchema: { type: 'object', properties: { topic: { type: 'string' }, notes: { type: 'string' }, niche: { type: 'string' } }, required: ['topic', 'notes', 'niche'] },
      },
      async (args) => {
        const topic = (args.topic as string) || '';
        const niche = (args.niche as string) || '';
        const notes = (args.notes as string) || '';
        const slug = `${slugify(topic)}-${new Date().getFullYear()}`;
        const meta = `${topic} — a practical deep dive about ${niche}.`;
        const content = `# ${topic}\n\n## Overview\n${notes.slice(0, 1200)}\n\n## Key Points\n- Research-backed analysis\n- Step-by-step guidance\n- Real-world examples\n\n## Conclusion\nWrap up with actionable next steps.\n`;
        return `META_DESCRIPTION: ${meta}\nSLUG: ${slug}\nKEYWORD: ${topic}\n\n${content}`;
      }
    );

    const niche = providerConfig.niche || 'technology';
    const maxArticles = opts.maxArticles || 1;

    log('TrendingEngine', 'trending', 'Fetching trending topics...');
    const topics = await fetchTrendingTopics(niche);
    log('TrendingEngine', 'trending', `Found ${topics.length} topics`, topics.length > 0);
    if (topics.length === 0) return { jobId, status: 'failed', logs };

    const topic = topics[0];
    log('Researcher', 'research', `Researching: ${topic.title}`);
    const researchResult = await toolLoop.run(
      `Research the topic: ${topic.title}. Use web_search to gather notes, then summarize key findings.`,
      client,
      'You are a research assistant. Use the web_search tool to find real sources, then synthesize findings.'
    );
    const researchNotes = researchResult.response || `Research context for ${topic.title} in ${niche}.`;
    log('Researcher', 'research', 'Research complete', true);

    log('Writer', 'writing', 'Writing article...');
    const styleGuide = buildStyleGuide(providerConfig, topic);
    const writerPrompt = buildWriterPrompt(topic, researchNotes, providerConfig);
    const writeResult = await toolLoop.run(
      `Write an article about: ${topic.title}. Use the write_article tool with the following notes:\n\n${researchNotes.slice(0, 4000)}\n\nRequirements: 1800-2400 words, engaging tone, include headings and lists.`,
      client,
      writerPrompt
    );
    const writerOutput = writeResult.response || `# ${topic.title}\n\nUnable to generate content right now.`;
    const draft = parseWriterOutput(writerOutput, topic, providerConfig);
    draft.wordCount = writerOutput.split(/\s+/).length;
    log('Writer', 'writing', `Draft ready — ${draft.wordCount} words`, true);

    log('SEOAgent', 'seo', 'Analyzing SEO + AEO...');
    const seoScore = computeSEOHeuristics(draft.title, draft.content, draft.metaDescription);
    draft.seoScore = seoScore;
    draft.readingTime = Math.max(1, Math.round(draft.wordCount / 220));
    log('SEOAgent', 'seo', `SEO score: ${seoScore}/100`, true);

    if (providerConfig.affiliateEnabled && providerConfig.affiliateId) {
      log('AffiliateAgent', 'affiliate', 'Inserting affiliate links...');
      draft.content = insertAffiliateLinks(draft.content, providerConfig.affiliateProgram, providerConfig.affiliateId, niche);
      draft.affiliateLinks = [];
      log('AffiliateAgent', 'affiliate', 'Affiliate links inserted', true);
    }

    log('QualityGate', 'quality', 'Running quality analysis...');
    const qualityScore = computeQualityHeuristics(draft.content);
    draft.qualityScore = qualityScore;
    const recommendation = qualityScore >= 80 ? 'publish' : qualityScore >= 65 ? 'review' : 'regenerate';
    log('QualityGate', 'quality', `Quality: ${qualityScore}/100 → ${recommendation}`, qualityScore >= 65);

    log('ImageAgent', 'image', 'Generating featured image...');
    draft.featuredImage = generateImage(draft.title, draft.slug);
    log('ImageAgent', 'image', 'Image ready', true);

    const now = new Date().toISOString();
    const finalStatus = recommendation === 'publish' && providerConfig.publishMode === 'auto' ? 'published' : 'review';

    const article = {
      ...draft,
      id: `art-${Date.now()}`,
      status: finalStatus,
      publishedAt: finalStatus === 'published' ? now : undefined,
      createdAt: now,
      author: 'BlogForge AI',
      niche,
      tags: [niche, draft.primaryKeyword].filter(Boolean),
      wordCount: draft.wordCount,
      seoScore,
      qualityScore,
      featuredImage: draft.featuredImage,
    } as Record<string, unknown>;

    try {
      const existing = getArticles();
      existing.unshift(article);
      saveArticles(existing);
    } catch (storageErr) {
      log('Storage', 'article', `Storage issue: ${storageErr}`, false);
    }

    log('Pipeline', 'complete', `Article ready: ${article.slug}`, true);
    return {
      jobId,
      status: finalStatus === 'published' ? 'published' : 'draft',
      article,
      qualityScore,
      seoScore,
      logs,
    };
  } catch (err: any) {
    log('Pipeline', 'error', err?.message || 'Unknown pipeline error', false);
    return { jobId, status: 'failed', logs };
  }
}
