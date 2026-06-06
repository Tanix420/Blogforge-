import fs from "fs";
import path from "path";

export type Provider = "openrouter" | "openai" | "anthropic" | "groq" | "google" | "deepseek";
export type Theme = 
  | "dark-prestige" 
  | "neon-glass" 
  | "brutalism" 
  | "editorial" 
  | "warm-sepia"
  | "ocean"
  | "forest"
  | "tokyo"
  | "polar"
  | "aurora";
export type PublishMode = "auto" | "review" | "draft";
export type Schedule = "hourly" | "every-3h" | "every-6h" | "daily" | "every-2d" | "weekly";

export interface BlogConfig {
  blogTitle: string;
  blogDescription: string;
  blogUrl: string;
  niche: string;
  provider: Provider;
  model: string;
  apiKey: string;
  adminPassword: string;
  schedule: Schedule;
  articlesPerWeek: number;
  publishMode: PublishMode;
  theme: Theme;
  affiliateProgram: string;
  affiliateId: string;
  affiliateEnabled: boolean;
  seoOptimize: boolean;
  aeoOptimize: boolean;
  humanize: boolean;
  autoInternalLinks: boolean;
  language: string;
  wordCountMin: number;
  wordCountMax: number;
  qualityThreshold: number;
  maxConcurrentJobs: number;
}

export const DEFAULT_CONFIG: BlogConfig = {
  blogTitle: "My AI Blog",
  blogDescription: "An autonomous AI-powered blog",
  blogUrl: "https://myblog.com",
  niche: "Technology",
  provider: "openrouter",
  model: "anthropic/claude-opus-4",
  apiKey: "",
  adminPassword: "admin",
  schedule: "daily",
  articlesPerWeek: 5,
  publishMode: "review",
  theme: "dark-prestige",
  affiliateProgram: "Amazon Associates",
  affiliateId: "",
  affiliateEnabled: true,
  seoOptimize: true,
  aeoOptimize: true,
  humanize: true,
  autoInternalLinks: true,
  language: "en",
  wordCountMin: 2000,
  wordCountMax: 3500,
  qualityThreshold: 70,
  maxConcurrentJobs: 2,
};

const NICHES = [
  "Technology", "AI & Machine Learning", "Web Development", "SaaS & Startups",
  "Personal Finance", "Health & Wellness", "Cooking & Food", "Travel",
  "Productivity", "Science", "Gaming", "Photography", "Parenting", "Marketing",
];

export const NICHES_LIST = NICHES;

export const PROVIDERS = [
  { 
    id: "openrouter", 
    name: "OpenRouter (recommended)",
    models: ["anthropic/claude-opus-4", "openai/gpt-4o", "google/gemini-2.5-pro", "meta-llama/llama-4-maverick"],
    url: "https://openrouter.ai", 
    docs: "https://openrouter.ai/docs",
    freeTier: "No free tier, pay-per-token. Cheap models from $0.10/M tokens.",
  },
  { 
    id: "openai", 
    name: "OpenAI",
    models: ["gpt-4o", "gpt-4o-mini", "o3-mini"],
    url: "https://openai.com", 
    docs: "https://platform.openai.com/docs",
    freeTier: "No free tier since GPT-3.5 deprecation. GPT-4o-mini from $0.15/1M tokens.",
  },
  { 
    id: "anthropic", 
    name: "Anthropic",
    models: ["claude-opus-4", "claude-sonnet-4", "claude-haiku"],
    url: "https://anthropic.com", 
    docs: "https://docs.anthropic.com",
    freeTier: "No free tier. Haiku is cheapest.",
  },
  { 
    id: "groq", 
    name: "Groq (ultra-fast)",
    models: ["llama-4-maverick", "llama-4-scout", "mixtral-8x7b"],
    url: "https://groq.com", 
    docs: "https://console.groq.com/docs",
    freeTier: "Free tier: 30 req/min, 14,400 req/day. LPU hardware — 10-100x faster text generation.",
  },
  { 
    id: "google", 
    name: "Google AI",
    models: ["gemini-2.5-pro", "gemini-2.5-flash", "gemini-2.0-flash"],
    url: "https://ai.google.dev", 
    docs: "https://ai.google.dev/docs",
    freeTier: "Generous free tier via AI Studio: 15 req/min, 1500 req/day.",
  },
  { 
    id: "deepseek", 
    name: "DeepSeek",
    models: ["deepseek-chat", "deepseek-reasoner"],
    url: "https://deepseek.com", 
    docs: "https://platform.deepseek.com/docs",
    freeTier: "Very cheap. DeepSeek-V3 from ~$0.27/M tokens.",
  },
];

export const THEMES_LIST: { id: Theme; name: string; desc: string }[] = [
  { id: "dark-prestige", name: "Dark Prestige", desc: "Dark with purple accents, subtle glass" },
  { id: "neon-glass", name: "Neon Glass", desc: "Glassmorphism cards, neon glow, cyberpunk" },
  { id: "brutalism", name: "Brutalist", desc: "High contrast, bold borders, raw" },
  { id: "editorial", name: "Editorial", desc: "Magazine layout, serif headings, classic" },
  { id: "warm-sepia", name: "Warm Sepia", desc: "Warm tones, paper-like, cozy" },
  { id: "ocean", name: "Ocean Depths", desc: "Deep blues, teal, calm" },
  { id: "forest", name: "Forest Dark", desc: "Dark green, earthy, organic" },
  { id: "tokyo", name: "Tokyo Cyber", desc: "Neon pink+cyan, JDM vibes" },
  { id: "polar", name: "Polar Light", desc: "Clean white, minimal, airy" },
  { id: "aurora", name: "Aurora", desc: "Animated gradients, dreamy" },
];

export const SCHEDULES: { id: Schedule; label: string; cron: string }[] = [
  { id: "hourly", label: "Every hour", cron: "0 * * * *" },
  { id: "every-3h", label: "Every 3 hours", cron: "0 */3 * * *" },
  { id: "every-6h", label: "Every 6 hours", cron: "0 */6 * * *" },
  { id: "daily", label: "Daily at 9 AM", cron: "0 9 * * *" },
  { id: "every-2d", label: "Every 2 days", cron: "0 9 */2 * *" },
  { id: "weekly", label: "Weekly (Monday 9 AM)", cron: "0 9 * * 1" },
];

export const AFFILIATE_PROGRAMS = [
  "Amazon Associates",
  "ShareASale",
  "CJ Affiliate",
  "Impact",
  "Rakuten",
  "Awin",
  "None",
];

// ─── Config file storage ───
const CONFIG_DIR = path.join(process.cwd(), "content", "config");
const CONFIG_PATH = path.join(CONFIG_DIR, "config.json");

export async function loadConfig(): Promise<BlogConfig> {
  try {
    const raw = fs.readFileSync(CONFIG_PATH, "utf-8");
    return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

export async function saveConfig(config: BlogConfig): Promise<void> {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8");
}
