# Project Handoff: kopiiki-agent

## 📌 当前状态 (Current State)
该项目已完成核心架构升级。目前是一个功能完备、高响应速度的 **Kopiiki Coding Agent**。已成功集成 Google 最新的 **Gemini 3 Flash Preview** 模型，并全面适配 Vercel AI SDK v6 版本。

### 1. 核心技术栈 (Tech Stack)
- **Framework**: Next.js 16 (App Router, TypeScript, Tailwind CSS v4)
- **UI Architecture**: shadcn/ui (已集成 `button`, `input`, `card`, `scroll-area`, `progress`)
- **AI SDK**: **Vercel AI SDK v6.0.140** (核心组件为 `@ai-sdk/react` 和 `ai`)
- **Model Provider**: Google Gemini (`@ai-sdk/google`) 
- **Current Model**: **`gemini-3-flash-preview`** (已验证此实验性模型在当前配置下可用，拥有更前沿的速度和推理能力)

### 2. 关键功能与架构更新 (Key Updates)
- **Gemini 3 深度推理**: 已正式开启 **`thinkingLevel: medium`**。Agent 在给出回答前会进行平衡深度的逻辑推理，该过程在 UI 中实时可见。
- **v6 协议深度适配**: 修复了 SDK v6 中的 `ModelMessage[]` 架构不匹配问题。通过手动映射 UIMessage 到 CoreMessage，确保了对话流的稳定性。
- **推理过程可视化**: UI 支持渲染 `reasoning` 片段。Agent 现在的思考过程会直观展示给用户。
- **Identity 更新**: Agent 正式更名为 **Kopiiki**（去掉了 "Code" 冗余），并细化了系统提示词。
- **免费档位优化**: 已在文档中明确免费档位的速率限制与隐私政策，并提供了相应的生产级升级方案建议。

## 📂 关键文件结构 (Key Files)
- `src/app/api/chat/route.ts`: Agent 的后端逻辑。包含 Gemini 3 集成、手动消息格式转换以及详细的系统人格定义。
- `src/app/page.tsx`: 升级后的聊天界面。支持 v6 的多部分消息 (Multi-part Messages) 渲染，包含 `text`、`reasoning` 和 `error`。
- `Handoff/handoff.md`: 本文档，用于跟踪项目交付状态。

## 🚀 后续开发路线 (Next Steps)
1. **第二阶段：工具集成 (Tool Use)**: 接入 `read_directory`, `read_file`, `write_file` 等文件系统工具，使 Agent 具备读写代码的能力。
2. **Thinking 功能启用**: 在 `route.ts` 中根据需求配置 `thinkingLevel: 'high'` 以开启深度推理模式。
3. **Artifacts 功能**: 实现类似 Claude 的侧边栏预览功能，用于展示生成的代码、图表或预览网页。

## 💡 维护建议
- **模型切换**: 如果需要更换模型，请修改 `route.ts` 中的 `model: google('gemini-3-flash-preview')`。
- **SDK 升级**: 如果 `ai` 包更新，请关注 `convertToModelMessages` 等辅助函数的命名变化。

---
*Updated by Antigravity on 2026-03-30*
