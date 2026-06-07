import type { ToolDef } from './llm';

export const BLOG_TOOLS: ToolDef[] = [
  {
    name: 'write_article',
    description: 'Write or rewrite an article body using a given topic, keywords, and tone.',
    inputSchema: {
      type: 'object',
      required: ['title', 'body'],
      properties: {
        title: { type: 'string' },
        body: { type: 'string' },
        keywords: { type: 'array', items: { type: 'string' } },
        tone: { type: 'string', enum: ['informative', 'persuasive', 'educational', 'casual'] },
      },
    },
  },
  {
    name: 'plan_outline',
    description: 'Create an outline for a topic before writing.',
    inputSchema: {
      type: 'object',
      required: ['topic'],
      properties: {
        topic: { type: 'string' },
        sections: { type: 'array', items: { type: 'string' } },
      },
    },
  },
];
