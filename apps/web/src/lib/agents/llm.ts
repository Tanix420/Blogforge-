import type { BlogConfig } from '../config-types';

export type ProviderClient = {
  complete: (prompt: string, model: string, apiKey: string, opts?: { temperature?: number; maxTokens?: number; systemPrompt?: string }) => Promise<string>;
  completeWithTools: (
    prompt: string,
    model: string,
    apiKey: string,
    tools: ToolDef[],
    opts?: { temperature?: number; maxTokens?: number; systemPrompt?: string; history?: ChatMessage[] },
  ) => Promise<ToolResult>;
};

export interface ToolDef {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

export interface ToolResult {
  content: string;
  raw: any;
  toolCalls: Array<{ name: string; arguments: Record<string, unknown> }>;
}

type ChatMessage = { role: 'system' | 'user' | 'assistant' | 'tool'; content?: string; name?: string; tool_call_id?: string; tool_calls?: any[] };

function buildMessages(prompt: string, opts?: { systemPrompt?: string; history?: ChatMessage[] }): ChatMessage[] {
  const msgs: ChatMessage[] = [];
  if (opts?.systemPrompt) msgs.push({ role: 'system', content: opts.systemPrompt });
  if (opts?.history?.length) msgs.push(...opts.history);
  msgs.push({ role: 'user', content: prompt });
  return msgs;
}

async function callOpenRouter(model: string, apiKey: string, messages: ChatMessage[], tools: ToolDef[] | undefined, opts?: { temperature?: number; maxTokens?: number }) {
  const body: any = { model, messages, temperature: opts?.temperature ?? 0.7, max_tokens: opts?.maxTokens ?? 4096 };
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

async function callOpenAI(model: string, apiKey: string, messages: ChatMessage[], tools: ToolDef[] | undefined, opts?: { temperature?: number; maxTokens?: number }) {
  const body: any = { model, messages, temperature: opts?.temperature ?? 0.7, max_tokens: opts?.maxTokens ?? 4096 };
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

async function callAnthropic(model: string, apiKey: string, messages: ChatMessage[], tools: ToolDef[] | undefined, opts?: { temperature?: number; maxTokens?: number }): Promise<ToolResult> {
  const systemPrompt = messages.find(m => m.role === 'system')?.content ?? 'You are a helpful assistant.';
  const chatMessages = messages
    .filter(m => m.role !== 'system')
    .map(m => {
      if (m.role === 'user') return { role: 'user' as const, content: m.content ?? '' };
      if (m.role === 'assistant') return { role: 'assistant' as const, content: m.content ?? '', tool_calls: m.tool_calls as any };
      if (m.role === 'tool') return { role: 'user' as const, content: `Tool result: ${m.content}` };
      return { role: 'user' as const, content: m.content ?? '' };
    });
  const body: any = {
    model,
    max_tokens: opts?.maxTokens ?? 4096,
    temperature: opts?.temperature ?? 0.7,
    system: systemPrompt,
    messages: chatMessages,
  };
  if (tools?.length) body.tools = tools;
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(120_000),
  });
  if (!res.ok) throw new Error(`Anthropic error: ${res.status}`);
  const data = await res.json();
  const toolCalls: Array<{ name: string; arguments: Record<string, unknown> }> = (data.content ?? [])
    .filter((b: any) => b.type === 'tool_use')
    .map((b: any) => ({ name: b.name, arguments: b.input, id: b.id }));
  const textBlock = (data.content ?? []).find((b: any) => b.type === 'text');
  return { content: textBlock?.text ?? '', raw: data, toolCalls };
}

async function callGroq(model: string, apiKey: string, messages: ChatMessage[], tools: ToolDef[] | undefined, opts?: { temperature?: number; maxTokens?: number }) {
  const body: any = { model, messages, temperature: opts?.temperature ?? 0.7, max_tokens: opts?.maxTokens ?? 4096 };
  if (tools?.length) body.tools = tools;
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(120_000),
  });
  if (!res.ok) throw new Error(`Groq error: ${res.status}`);
  const data = await res.json();
  const choice = data.choices?.[0]?.message ?? {};
  return { content: choice.content ?? '', raw: data, toolCalls: choice.tool_calls ?? [] };
}

async function callGoogle(model: string, apiKey: string, messages: ChatMessage[], tools: ToolDef[] | undefined, opts?: { temperature?: number; maxTokens?: number }) {
  const withoutSystem = messages.filter(m => m.role !== 'system');
  const systemPrompt = messages.find(m => m.role === 'system')?.content;
  const contents = withoutSystem.map(m => {
    if (m.role === 'user') return { role: 'user', parts: [{ text: m.content ?? '' }] };
    if (m.role === 'assistant') return { role: 'model', parts: [{ text: m.content ?? '' }] };
    return { role: 'user', parts: [{ text: m.content ?? '' }] };
  });
  const genConfig: any = { temperature: opts?.temperature ?? 0.7, maxOutputTokens: opts?.maxTokens ?? 4096 };
  if (systemPrompt) genConfig.systemInstruction = { parts: [{ text: systemPrompt }] };
  if (tools?.length) genConfig.tools = [{ functionDeclarations: tools }];
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents, generationConfig: genConfig }),
    signal: AbortSignal.timeout(120_000),
  });
  if (!res.ok) throw new Error(`Google AI error: ${res.status}`);
  const data = await res.json();
  const parts = data.candidates?.[0]?.content?.parts ?? [];
  const text = parts.map((p: any) => p.text ?? '').join('');
  const toolCalls: Array<{ name: string; arguments: Record<string, unknown> }> = [];
  return { content: text, raw: data, toolCalls };
}

async function callDeepSeek(model: string, apiKey: string, messages: ChatMessage[], tools: ToolDef[] | undefined, opts?: { temperature?: number; maxTokens?: number }) {
  const body: any = { model, messages, temperature: opts?.temperature ?? 0.7, max_tokens: opts?.maxTokens ?? 4096 };
  if (tools?.length) body.tools = tools;
  const res = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(120_000),
  });
  if (!res.ok) throw new Error(`DeepSeek error: ${res.status}`);
  const data = await res.json();
  const choice = data.choices?.[0]?.message ?? {};
  return { content: choice.content ?? '', raw: data, toolCalls: choice.tool_calls ?? [] };
}

export function createClient(config: BlogConfig): ProviderClient {
  if (!config.apiKey) {
    return {
      complete: async () => '[MOCK] No API key configured.',
      completeWithTools: async () => ({ content: '[MOCK] No API key configured.', raw: null, toolCalls: [] }),
    };
  }

  const executor = async (messages: ChatMessage[], tools: ToolDef[] | undefined, opts?: { temperature?: number; maxTokens?: number; systemPrompt?: string; history?: ChatMessage[] }) => {
    const msgs = opts?.history ?? buildMessages(messages[0]?.content ?? '', { systemPrompt: opts?.systemPrompt, history: messages.slice(1) });
    switch (config.provider) {
      case 'openai': return callOpenAI(config.model, config.apiKey, msgs, tools, opts);
      case 'anthropic': return callAnthropic(config.model, config.apiKey, msgs, tools, opts);
      case 'groq': return callGroq(config.model, config.apiKey, msgs, tools, opts);
      case 'google': return callGoogle(config.model, config.apiKey, msgs, tools, opts);
      case 'deepseek': return callDeepSeek(config.model, config.apiKey, msgs, tools, opts);
      case 'openrouter':
      default: return callOpenRouter(config.model, config.apiKey, msgs, tools, opts);
    }
  };

  return {
    complete: async (prompt, model, apiKey, opts) => {
      const msgs = buildMessages(prompt, opts);
      const result = await executor(msgs, undefined, opts);
      return result.content;
    },
    completeWithTools: async (prompt, model, apiKey, tools, opts) => {
      const msgs = buildMessages(prompt, opts);
      return executor(msgs, tools, opts);
    },
  };
}

type ToolHandler = (args: Record<string, unknown>, context: Record<string, unknown>) => Promise<string>;

export class AgentToolLoop {
  private tools: Map<string, ToolDef>;
  private handlers: Map<string, ToolHandler>;
  private maxIterations = 8;

  constructor() {
    this.tools = new Map();
    this.handlers = new Map();
  }

  register(def: ToolDef, handler: ToolHandler) {
    this.tools.set(def.name, def);
    this.handlers.set(def.name, handler);
  }

  getToolDefs(): ToolDef[] {
    return Array.from(this.tools.values());
  }

  async run(initialPrompt: string, client: ProviderClient, systemPrompt?: string): Promise<{ response: string; logs: string[] }> {
    const logs: string[] = [];
    let prompt = initialPrompt;
    const history: ChatMessage[] = [];

    for (let i = 0; i < this.maxIterations; i++) {
      const result = await client.completeWithTools(prompt, '', '', this.getToolDefs(), {
        temperature: 0.2,
        systemPrompt,
        history,
      });
      logs.push(`[agent iter=${i}] content=${result.content.slice(0, 120)} toolCalls=${result.toolCalls.length}`);

      if (result.toolCalls.length > 0) {
        history.push({ role: 'assistant', content: result.content, tool_calls: result.toolCalls });

        for (const tc of result.toolCalls) {
          const handler = this.handlers.get(tc.name);
          if (!handler) {
            logs.push(`[tool error] no handler for ${tc.name}`);
            continue;
          }
          try {
            const output = await handler(tc.arguments, {});
            history.push({ role: 'tool', name: tc.name, content: output, tool_call_id: tc.name });
            logs.push(`[tool] ${tc.name} => ${output.slice(0, 100)}`);
          } catch (err) {
            const msg = (err as Error).message;
            history.push({ role: 'tool', name: tc.name, content: `error: ${msg}`, tool_call_id: tc.name });
            logs.push(`[tool error] ${tc.name}: ${msg}`);
          }
        }

        prompt = 'Continue. Use tool results above to finish the task.';
      } else {
        return { response: result.content, logs };
      }
    }

    const lastHistory = history.filter(h => h.role === 'assistant').pop();
    return { response: lastHistory?.content ?? 'Max iterations reached', logs };
  }
}
