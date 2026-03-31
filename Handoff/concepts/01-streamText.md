# 概念讲义 01 — `streamText` 与 Agent Loop 的基础

> **所属阶段**：Phase 0 ｜ **掌握状态**：✅ 已掌握  
> **对应文件**：`src/app/api/chat/route.ts`

---

## 一、它解决了什么问题？

普通的 API 调用是"请求-响应"模式：你问，等待，得到全部答案。

对于 AI 来说，生成一个完整回复可能需要 10-30 秒。如果等到全部生成完再返回，用户体验极差。

`streamText` 解决的是**流式传输**问题：AI 生成一个词，立刻发给前端一个词，用户看到打字机效果。

```
普通模式：[用户提问] ──等待10秒──→ [收到完整回复]
流式模式：[用户提问] → 收到"你" → 收到"好" → 收到"，" → ... (即时显示)
```

---

## 二、`streamText` 在 Agent Loop 中的角色

`streamText` 不只是"流式输出文字"，它是整个 **Agent Loop 的状态机**。

```
                     ┌─────────────────────────────────────────┐
                     │           streamText 状态机              │
                     │                                          │
用户消息 ──────────→ │  Step 1: LLM 思考                        │
                     │    ↓ 需要工具？                           │
                     │  Step 2: 执行 Tool Call                  │
                     │    ↓ 把结果给 LLM                         │
                     │  Step 3: LLM 继续思考                     │
                     │    ↓ 还需要工具？继续循环                  │
                     │  Step N: LLM 输出最终回复 ─────────────→ │ 流式返回给用户
                     └─────────────────────────────────────────┘
```

这个循环**完全自动**，你不需要手动控制。`streamText` 内部会一直循环，直到满足 `stopWhen` 条件。

---

## 三、代码解析（`route.ts`）

```typescript
const result = streamText({
  model: google('gemini-3-flash-preview'),  // ① 选择模型
  messages: coreMessages,                   // ② 历史对话（上下文）
  tools,                                    // ③ 工具箱（Agent 能做什么）
  stopWhen: stepCountIs(5),                 // ④ 最多 5 轮工具调用后强制停止
  system: `...`,                            // ⑤ Agent 的"人格"定义
});

return result.toUIMessageStreamResponse();  // ⑥ 转换为前端可消费的流格式
```

**关键点 ④ — `stopWhen: stepCountIs(5)`**：

这是 SDK v6 新语法，替代了旧版的 `maxSteps: 5`。

为什么需要它？假设 Agent 在读文件 A 时发现需要读文件 B，读 B 时又发现需要读 C... 如果没有限制，理论上可以无限循环。`stepCountIs(5)` 就是强制的"刹车"。

**关键点 ⑥ — `toUIMessageStreamResponse()`**：

SDK 内部的数据格式（`CoreMessage`）和前端的 UI 格式（`UIMessage`）是不同的。这个方法自动做了转换，并将数据封装成 HTTP 流响应（使用 `data:` 前缀的 SSE 格式）。

---

## 四、与前端的连接：`useChat`

前端的 `useChat()` Hook 是 `streamText` 的"另一半"：

```typescript
// page.tsx
const { messages, sendMessage, status } = useChat();
//      ↑消息列表   ↑发送方法      ↑流状态('idle'|'streaming'|'error')
```

`useChat` 内部自动：
1. 向 `/api/chat` 发 POST 请求
2. 监听 SSE 数据流
3. 把流式文本实时追加到 `messages` 状态
4. UI 自动重渲染，实现打字机效果

---

## 五、你掌握了什么？

- [x] 流式 HTTP 响应的基本原理（SSE）
- [x] `streamText` 作为 Agent Loop 状态机的概念
- [x] `stopWhen` 的作用（防止死循环）
- [x] `useChat` 与后端流的自动连接机制

---

## 六、延伸思考

> **问**：`streamText` 和 `generateText` 的区别是什么？  
> **答**：功能相同，`generateText` 等待全部生成完毕后一次性返回。适合后台任务（用户不需要实时看结果）。`streamText` 用于需要即时反馈的用户界面。

> **问**：`stopWhen: stepCountIs(5)` 的 5 怎么选？  
> **答**：取决于任务复杂度。简单 Q&A 用 1-3 步，复杂的多文件分析用 10-20 步。步数越多，消耗 Token 越多，响应越慢。目前的 5 步对于读文件任务已经够用。
