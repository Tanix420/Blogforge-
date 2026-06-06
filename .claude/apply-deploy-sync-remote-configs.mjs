import fs from "fs";
import path from "path";

const root = process.cwd();

function write(relative, content) {
  const out = path.join(root, relative);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, content, "utf-8");
}

function addPlatform(name) {
  return {
    name,
    deployCommand: "npm install && npm run build && npm start",
    environment: {
      NODE_ENV: "production",
      NEXT_TELEMETRY_DISABLED: "1",
      BLOGFORGE_ADMIN_PASSWORD: "${ADMIN_PASSWORD:-admin}",
      OPENROUTER_API_KEY: "${OPENROUTER_API_KEY:-}",
    },
  };
}

const manifest = {
  generatedAt: new Date().toISOString(),
  apps: {
    web: {
      root: "apps/web",
      framework: "nextjs",
      buildCommand: "npm run build",
      startCommand: "npm start",
      platformDefaults: {
        vercel: {
          ...addPlatform("vercel"),
          vercelConfig: {
            version: 2,
            builds: [{ src: "apps/web/package.json", use: "@vercel/nextjs" }],
            routes: [{ src: "/(.*)", dest: "apps/web/$1" }],
          },
          envTemplate: {
            OPENROUTER_API_KEY: "Your OpenRouter key",
            ANTHROPIC_API_KEY: "Optional fallback",
            BLOGFORGE_ADMIN_PASSWORD: "admin",
          },
        },
        netlify: {
          ...addPlatform("netlify"),
          netlifyConfig: {
            build: {
              base: "apps/web",
              command: "npm run build",
              publish: ".next",
            },
            redirects: [{ from: "/*", to: "/index.html", status: 200, force: true }],
          },
          envTemplate: {
            OPENROUTER_API_KEY: "Your OpenRouter key",
            BLOGFORGE_ADMIN_PASSWORD: "admin",
          },
        },
        fly: {
          ...addPlatform("fly.io"),
          flyConfig: {
            app: "blogforge-web",
            primary_region: "iad",
            build: {
              dockerfile: "Dockerfile",
            },
          },
          envTemplate: {
            OPENROUTER_API_KEY: "Your OpenRouter key",
            BLOGFORGE_ADMIN_PASSWORD: "admin",
          },
        },
        railway: {
          ...addPlatform("railway"),
          railwayConfig: {
            build: {
              builder: "NIXPACKS",
              buildCommand: "cd apps/web && npm install && npm run build",
            },
            deploy: {
              startCommand: "cd apps/web && npm start",
              restartPolicyType: "ON_FAILURE",
            },
          },
          envTemplate: {
            OPENROUTER_API_KEY: "Your OpenRouter key",
            BLOGFORGE_ADMIN_PASSWORD: "admin",
          },
        },
        render: {
          ...addPlatform("render"),
          renderConfig: {
            type: "web",
            runtime: "node",
            plan: "free",
            buildCommand: "cd apps/web && npm install && npm run build",
            startCommand: "cd apps/web && npm start",
          },
          envTemplate: {
            OPENROUTER_API_KEY: "Your OpenRouter key",
            BLOGFORGE_ADMIN_PASSWORD: "admin",
          },
        },
        docker: {
          ...addPlatform("docker"),
          dockerfile: "Dockerfile",
          envTemplate: {
            OPENROUTER_API_KEY: "Your OpenRouter key",
            BLOGFORGE_ADMIN_PASSWORD: "admin",
            BLOGFORGE_PORT: "3000",
          },
        },
      },
      supportedProviders: [
        { id: "openrouter", label: "OpenRouter", models: ["anthropic/claude-opus-4", "openai/gpt-4o"] },
        { id: "openai", label: "OpenAI", models: ["gpt-4o", "gpt-4o-mini"] },
        { id: "anthropic", label: "Anthropic", models: ["claude-opus-4", "claude-sonnet-4"] },
        { id: "groq", label: "Groq", models: ["llama-4-maverick", "llama-4-scout"] },
        { id: "google", label: "Google AI", models: ["gemini-2.5-pro", "gemini-2.5-flash"] },
        { id: "deepseek", label: "DeepSeek", models: ["deepseek-chat", "deepseek-reasoner"] },
      ],
      toolLayer: {
        builtIn: ["web_search"],
        providerSupplied: true,
        loopEngine: "AgentToolLoop",
        maxIterations: 8,
        retryPolicy: { attempts: 4, baseMs: 400, maxMs: 5000, backoff: 1.25 },
      },
      agents: [
        { id: "trending", label: "Trending Engine", role: "topic discovery" },
        { id: "researcher", label: "Researcher", role: "source discovery + note synthesis" },
        { id: "writer", label: "Writer", role: "long-form drafting with optional tool use" },
        { id: "seo", label: "SEO/AEO Agent", role: "score + optimize" },
        { id: "affiliate", label: "Affiliate Agent", role: "insert + disclose" },
        { id: "quality", label: "Quality Gate", role: "approve / revise / reject" },
        { id: "publisher", label: "Publisher", role: "finalize route" },
      ],
      auth: {
        adminCookie: "blogforge_admin",
        loginRoute: "/api/admin/auth",
        adminRoute: "/admin",
        loginPage: "/admin/login",
      },
    },
  },
};

const dirs = [`${root}/.claude`, `${root}/.wrangler`, `${root}/apps/web/.claude`, `${root}/apps/web/.wrangler`];
for (const d of dirs) {
  fs.mkdirSync(d, { recursive: true });
}

const portableManifest = {
  generatedAt: new Date().toISOString(),
  app: "blogforge",
  location: root,
  webAppDir: `${root}/apps/web`,
  framework: "nextjs",
  buildCommand: "npm run build",
  startCommand: "npm run start",
  // Deploy command simply builds + starts from the web app directory.
  deployCommand: "npm install && npm run build && npm run start",
  auth: { adminCookie: "blogforge_admin" },
  env: {
    supportedEnvKeys: [
      "BLOGFORGE_ADMIN_PASSWORD",
      "OPENROUTER_API_KEY",
      "OPENAI_API_KEY",
      "ANTHROPIC_API_KEY",
      "GROQ_API_KEY",
      "GOOGLE_GENERATIVE_AI_API_KEY",
      "DEEPSEEK_API_KEY",
    ],
    required: ["BLOGFORGE_ADMIN_PASSWORD"],
  },
  providers: [
    { id: "openrouter", envKey: "OPENROUTER_API_KEY", baseUrl: "https://openrouter.ai/api/v1/chat/completions" },
    { id: "openai", envKey: "OPENAI_API_KEY", baseUrl: "https://api.openai.com/v1/chat/completions" },
    { id: "anthropic", envKey: "ANTHROPIC_API_KEY", baseUrl: "https://api.anthropic.com/v1/messages" },
    { id: "groq", envKey: "GROQ_API_KEY", baseUrl: "https://api.groq.com/openai/v1/chat/completions" },
    { id: "google", envKey: "GOOGLE_GENERATIVE_AI_API_KEY", baseUrl: "https://generativelanguage.googleapis.com/v1beta/models" },
    { id: "deepseek", envKey: "DEEPSEEK_API_KEY", baseUrl: "https://api.deepseek.com/chat/completions" },
  ],
};

const plaintextArtifact = `${root}/blogforge-deployable-devcontainer-artifacts.txt`;
fs.writeFileSync(
  plaintextArtifact,
  [
    `================================`,
    `BLOGFORGE AI - DEV CONTAINER ARTIFACTS`,
    `================================`,
    `CLAUDE/GEMINI USE PORTABLE ARTIFACT FIRST.`,
    `If using a separate host, recreate using this file.`,
    ``,
    `ROOT: ${root}`,
    `WEB_APP: ${root}/apps/web`,
    ``,
    `--- DEPLOY COMMAND ---`,
    portableManifest.deployCommand,
    ``,
    `--- ENV (add these in your platform) ---`,
    portableManifest.env.supportedEnvKeys.join(", "),
    ``,
    `--- PLATFORMS ---`,
    "Vercel/Netlify/Fly.io/Railway/Render/Docker - supported from root with one command above",
  ].join("\n"),
  "utf-8"
);

fs.writeFileSync(`${root}/deployment-manifest.json`, JSON.stringify(manifest, null, 2), "utf-8");
fs.writeFileSync(`${root}/portable-dev-manifest.json`, JSON.stringify(portableManifest, null, 2), "utf-8");

console.log(JSON.stringify({ ok: true, artifacts: [plaintextArtifact, `${root}/deployment-manifest.json`, `${root}/portable-dev-manifest.json`] }, null, 2));
