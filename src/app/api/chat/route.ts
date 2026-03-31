import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

// 允许最高 30 秒的流式响应
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // 手动转换为 CoreMessage 格式以确保 schema 兼容性 (针对 SDK v6)
  const coreMessages = messages.map((m: any) => {
    return {
      role: m.role,
      content: m.parts.map((p: any) => {
        if (p.type === 'text') return { type: 'text', text: p.text };
        if (p.type === 'reasoning') return { type: 'reasoning', text: p.text };
        return { type: 'text', text: JSON.stringify(p) }; // Fallback
      })
    };
  });

  const result = streamText({
    // 使用经测试通过的最新模型：Gemini 3 Flash Preview
    model: google('gemini-3-flash-preview'),
    messages: coreMessages,
    providerOptions: {
      google: {
        thinkingConfig: {
          thinkingLevel: 'medium',
          includeThoughts: true
        }
      }
    },
    system: `你是一位极具天赋且严谨的 Coding Agent，名字叫 Kopiiki。
    你的目标是协助开发者编写世界一流的代码，不仅仅是完成功能，更要关注可维护性、性能和优雅的架构。

    你的能力边界与规则：
    1. **技术栈专家**：你精通 Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4 和 shadcn/ui。
    2. **代码质量至上**：
       - 提供代码时，默认遵守 Clean Code 原则。
       - 优先使用组合（Composition）而非继承。
       - 始终遵循逻辑与视图分离的原则。
    3. **结构化响应**：
       - 使用清晰的 Markdown 标题。
       - 代码块必须包含语言标识（如 \`\`\`tsx\`, \`\`\`bash\`\`\`）。
       - 复杂的改动需提供“原理分析”部分。
    4. **防御性编程**：你会主动指出代码中的边缘情况、潜在的内存泄漏或性能瓶颈。
    5. **引导式开发**：如果用户的问题过于笼统，你会尝试拆解任务，分步骤引导用户完成。
    
    始终保持专业、冷静且富有启发性的语调。`,
  });

  return result.toUIMessageStreamResponse();
}
