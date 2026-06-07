import type { BlogConfig } from '../config-types';

/* ======== Types ======== */
export type ChatRole = 'system' | 'user' | 'assistant' | 'tool';
export type ToolResult = {
content: string;
raw: any;
toolCalls: Array<{ name: string; arguments: Record<string, unknown> }>;
};
export interface ToolDef {
name: string;
description: string;
inputSchema: Record<string, unknown>;
}
export type ProviderCall = 'openrouter' | 'openai' | 'anthropic' | 'groq' | 'google' | 'deepseek';

function endpointFor(p: ProviderCall): string {
switch (p) {
case 'openrouter': return 'https://openrouter.ai/api/v1/chat/completions';
case 'openai': return 'https://api.openai.com/v1/chat/completions';
case 'anthropic': return 'https://api.anthropic.com/v1/messages';
case 'groq': return 'https://api.groq.com/openai/v1/chat/completions';
case 'google': return 'https://generativelanguage.googleapis.com/v1beta/models';
case 'deepseek': return 'https://api.deepseek.com/v1/chat/completions';
}
}

type ChatMessage =
  | { role: 'system'; content: string }
  | { role: 'user'; content: string }
  | { role: 'assistant'; content?: string; tool_calls?: any[] }
  | { role: 'tool'; content: string; name?: string; tool_call_id?: string };

function buildMessages(
  prompt: string,
  opts?: { systemPrompt?: string; history?: ChatMessage[] }
): ChatMessage[] {
  const out: ChatMessage[] = [];
  if (opts?.systemPrompt) out.push({ role: 'system', content: opts.systemPrompt });
  if (opts?.history?.length) out.push(...opts.history);
  out.push({ role: 'user', content: prompt });
  return out;
}

/* ======== Per provider calls ======== */
async function callOpenRouter(
  model: string,
  apiKey: string,
  messages: ChatMessage[],
  tools: any[] | undefined,
  opts?: { temperature?: number; maxTokens?: number }
) {
  const body: any = {
    model,
    messages,
    temperature: opts?.temperature ?? 0.7,
    max_tokens: opts?.maxTokens ?? 4096,
  };
  if (tools?.length) body.tools = tools;
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(120_000),
  });
  if (!res.ok) throw new Error(`OpenRouter error: ${res.status}`);
  const data = await res.json();
  const choice = data.choices?.[0]?.message ?? {};
  return { content: choice.content ?? '', raw: data, toolCalls: choice.tool_calls ?? [] };
}

async function callOpenAI(
  model: string,
  apiKey: string,
  messages: ChatMessage[],
  tools: any[] | undefined
) {
  const body: any = { model, messages };
  if (tools?.length) body.tools = tools;
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(120_000),
  });
  if (!res.ok) throw new Error(`OpenAI error: ${res.status}`);
  const data = await res.json();
  const choice = data.choices?.[0]?.message ?? {};
  return { content: choice.content ?? '', raw: data, toolCalls: choice.tool_calls ?? [] };
}

async function callAnthropic(
  model: string,
  apiKey: string,
  messages: ChatMessage[],
  tools: any[] | undefined
) {
  const system = messages.find((m) => m.role === 'system')?.content ?? 'You are a helpful assistant.';
  const chatMessages = messages
    .filter((m) => m.role !== 'system')
    .map((m) => {
      if (m.role === 'user') {
        return { role: 'user', content: m.content ?? '' };
      }
      if (m.role === 'assistant') {
        return {
          role: 'assistant',
          content: m.content ?? '',
          tool_calls: m.tool_calls ?? undefined,
        };
      }
      return { role: 'user', content: `Tool result: ${m.content}` };
    });
  const body: any = {
    model,
    max_tokens: 4096,
    temperature: 0.7,
    system,
    messages: chatMessages,
  };
  if (tools?.length) body.tools = tools;
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(120_000),
  });
  if (!res.ok) throw new Error(`Anthropic error: ${res.status}`);
  const data = await res.json();
  const text: string = data?.content?.[0]?.text ?? '';
  return { content: text, raw: data, toolCalls: [] };
}

/* ======== Unified caller ======== */
export async function callWithTools(
  config: BlogConfig,
  prompt: string,
  tools: ToolDef[],
  opts?: {
    systemPrompt?: string;
    history?: ChatMessage[];
    temperature?: number;
    maxTokens?: number;
  }
): Promise<ToolResult> {
  const provider: ProviderCall = (config.provider as ProviderCall) || 'openrouter';
  const apiKey = config.apiKey || '';
  const model = config.model || 'gpt-4o-mini';
  const messages = buildMessages(prompt, opts);

  if (!apiKey) {
    return {
      content: '[MOCK] No API key configured. Set provider + apiKey in Settings.',
      raw: { mock: true },
      toolCalls: [],
    };
  }

  const endpoint = endpointFor(provider);

  if (provider === 'anthropic') {
    return callAnthropic(model, apiKey, messages, tools.map((t) => ({ name: t.name, description: t.description, input_schema: t.inputSchema })));
  }

  const payload: any = {
    model,
    messages,
    temperature: opts?.temperature ?? 0.7,
    max_tokens: opts?.maxTokens ?? 4096,
  };
  if (tools?.length) payload.tools = tools;

  if (provider === 'google') {
    const url = `${endpoint}/${encodeURIComponent(model)}:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: messages.map((m) => ({
          role: m.role === 'assistant' ? 'model' : m.role,
          parts: [{ text: m.content ?? '' }],
        })),
        generationConfig: {
          temperature: payload.temperature,
          maxOutputTokens: payload.max_tokens,
        },
        tools: tools?.length
          ? {
              functionDeclarations: tools.map((t) => ({
                name: t.name,
                description: t.description,
                parameters: t.inputSchema,
              })),
            }
          : undefined,
      }),
      signal: AbortSignal.timeout(120_000),
    });
    if (!res.ok) throw new Error(`${provider} error ${res.status}`);
    const data = await res.json();
    const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    return { content: text, raw: data, toolCalls: [] };
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(120_000),
  });
  if (!res.ok) throw new Error(`${provider} error ${res.status}: ${await res.text()}`);
  const json = await res.json();
  const choice = json?.choices?.[0]?.message ?? {};
  return {
    content: choice.content ?? '',
    raw: json,
    toolCalls: choice.tool_calls ?? [],
  };
}

/* ======== Backwards-compatible client & loop for pipeline ======== */
const inMemoryHistory: ChatMessage[] = [];

export function createClient(config: BlogConfig) {
  return {
    config,
    async complete(prompt: string, opts?: { systemPrompt?: string; history?: ChatMessage[]; temperature?: number; maxTokens?: number }) {
      const r = await callWithTools(config, prompt, [], opts);
      return r.content;
    },
    async completeWithTools(
      prompt: string,
      tools: any[],
      opts?: { systemPrompt?: string; history?: ChatMessage[]; temperature?: number; maxTokens?: number }
    ) {
      const history = opts?.history ?? inMemoryHistory;
      const r = await callWithTools(config, prompt, tools as any, { ...opts, history });
      return { response: r.content, raw: r.raw, toolCalls: r.toolCalls };
    },
  };
}

export interface AgentLoopOpts {
  maxIterations?: number;
  onLog?: (line: string) => void;
}

export class AgentToolLoop {
  private tools = new Map<string, (args: any, ctx: any) => Promise<string>>();
  private maxIterations: number;

  constructor(private opts: AgentLoopOpts = {}) {
    this.maxIterations = this.opts.maxIterations ?? 5;
  }

  register(def: any, handler: (args: any, ctx: any) => Promise<string>) {
    this.tools.set(def.name, handler);
  }

  async run(prompt: string, client: any, systemPrompt?: string, toolDefs?: any[]) {
    const history: ChatMessage[] = [];
    const logs: string[] = [];
    const addLog = (line: string) => {
      logs.push(line);
      this.opts.onLog?.(line);
    };
    let current = prompt;

    for (let i = 0; i < this.maxIterations; i++) {
      const toolDefList = toolDefs ?? Array.from(this.tools.keys()).map((name) => ({ name, description: name }));
      const response: any = await client.completeWithTools(current, toolDefList as any, {
        systemPrompt,
        history,
        temperature: 0.7,
        maxTokens: 4096,
      });

      history.push({ role: 'assistant', content: response.response, tool_calls: (response.toolCalls ?? []) as any });

      if (!response.toolCalls?.length) {
        addLog(`response:${String(response.response).slice(0, 120)}`);
        return { response: response.response, logs };
      }

      for (const tc of (response.toolCalls ?? [])) {
        const handler = this.tools.get(tc.name);
        if (handler) {
          const out = await handler(tc.arguments ?? {}, { prompt });
          addLog(`tool:${tc.name}:${String(out).slice(0, 80)}`);
          history.push({ role: 'tool', content: String(out), name: tc.name, tool_call_id: tc.name });
        } else {
          addLog(`tool:missing:${tc.name}`);
        }
      }
      current = 'Continue. Use tool results above to finish the task.';
    }

    const last = history.filter((h) => h.role === 'assistant').pop();
    return { response: last?.content ?? 'Max iterations reached', logs };
  }
}
