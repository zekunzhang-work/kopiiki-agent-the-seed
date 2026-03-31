# 概念讲义 02 — `tool()` 与 Tool Call 机制

> **所属阶段**：Phase 0 ｜ **掌握状态**：✅ 已掌握  
> **对应文件**：`src/lib/tools.ts`

---

## 一、它解决了什么问题？

纯语言模型能做什么？**只能说话**。它没有手脚，无法访问互联网，无法读写文件，无法执行代码。

`tool()` 解决的是**给 AI 一双手**的问题。通过定义工具，你把真实世界的操作能力（读文件、搜索、调用 API）交给 AI 来决定何时调用。

```
没有工具的 AI：用户问"我的 page.tsx 有多少行？" → AI："我不知道您的文件内容。"
有工具的 AI：  用户问"我的 page.tsx 有多少行？" → AI 调用 read_file → 得到内容 → AI："205 行。"
```

---

## 二、Tool Call 的通信协议

AI 和工具之间的通信遵循一个非常具体的"握手"协议：

```
① 用户: "读一下 src/app/page.tsx"

② LLM 输出（不是文字，是结构化 JSON）：
   {
     "type": "tool-call",
     "toolName": "read_file",
     "toolCallId": "call_abc123",
     "args": { "filePath": "src/app/page.tsx" }
   }

③ SDK（streamText 内部）自动执行 tool.execute()

④ 工具返回结果：
   {
     "type": "tool-result",
     "toolCallId": "call_abc123",
     "result": { "path": "src/app/page.tsx", "content": "..." }
   }

⑤ SDK 把结果加入消息历史，LLM 继续生成下一步
```

**关键理解**：LLM 本身不执行代码，它只是输出一个"我想调用这个工具"的 JSON。**真正执行的是你的 Node.js 代码**（`execute` 函数）。

---

## 三、代码解析（`tools.ts`）

```typescript
export const read_file = tool({
  // ① description：LLM 读这个来决定"该用这个工具吗？"
  //    写得越清晰，AI 越能准确调用。
  description: '读取指定文件的文本内容。',
  
  // ② inputSchema：用 Zod 定义 AI 必须提供哪些参数
  //    AI 无法传递 schema 之外的参数，类型安全保证。
  inputSchema: z.object({
    filePath: z.string().describe('相对于项目根目录的文件路径。'),
  }),
  
  // ③ execute：真正运行的 Node.js 代码
  //    这里可以调用文件系统、数据库、外部 API——任何事情。
  execute: async ({ filePath }) => {
    const content = await fs.readFile(filePath, 'utf-8');
    return { path: filePath, content }; // 返回值会被发给 LLM
  },
});
```

**为什么用 Zod？**

Zod Schema 会被 SDK 自动转换成 JSON Schema，发送给 LLM。LLM 按照这个 Schema 格式化它的输出。这样：
- 参数类型安全（TypeScript 层面）
- AI 不能传递格式错误的参数
- `describe()` 里的文字会成为参数的文档，帮助 AI 理解

---

## 四、安全设计解析

```typescript
function getSafePath(requestedPath: string = '.') {
  const absolutePath = path.resolve(process.cwd(), requestedPath);
  
  // 核心安全检查：绝对路径必须在项目根目录内
  if (!absolutePath.startsWith(process.cwd())) {
    throw new Error('Access denied: Path is outside of project root.');
  }
  return absolutePath;
}
```

**为什么需要这个？**

AI 是强大的，但也可能被"越狱"（jailbreak）。如果有人让 AI 读取 `../../etc/passwd`，经过 `path.resolve` 解析后会变成一个项目根目录之外的路径，这个检查会拦截它。

这是**防御性编程**在 Agent 工具设计中的标准实践。

---

## 五、多工具如何注册？

```typescript
// tools.ts 最后
export const tools = {
  read_directory,
  read_file,
  // 将来添加：write_file, run_command...
};

// route.ts
const result = streamText({
  ...
  tools,  // 把整个工具对象传进去，SDK 会自动处理
});
```

工具集合实际上就是一个普通的 JavaScript 对象，key 就是工具名。SDK 读取这个对象，把所有工具的 `description` + `inputSchema` 格式化后发给 LLM，让 LLM 知道"我有这些工具可用"。

---

## 六、你掌握了什么？

- [x] Tool Call 的完整握手协议（LLM → JSON → Node.js → 结果 → LLM）
- [x] `tool()` 的三要素：description、inputSchema、execute
- [x] 为什么用 Zod Schema 而不是普通类型
- [x] 工具注册机制（普通 JS 对象）
- [x] 文件系统工具的安全设计模式

---

## 七、延伸思考

> **问**：`description` 写得不好会怎样？  
> **答**：AI 可能不知道什么时候该用这个工具，或者用错工具。比如把 `read_file` 的描述写成"获取数据"，AI 可能在任何需要数据的时候都尝试调用它，包括它实际上不需要读文件的场景。清晰的描述是工具设计的核心。

> **问**：tool 的 execute 函数能异步吗？失败了怎么办？  
> **答**：完全支持异步。目前的设计是用 try-catch 捕获错误后返回 `{ error: "..." }` 对象，这样 AI 会收到错误信息并能决定下一步（比如重试、换一个路径、或者告知用户）。

> **问**：下一步我们要新增 `write_file` 工具，它需要哪些新概念？  
> **答**：`write_file` 本身不复杂，但它的**输出要怎么展示给用户**是关键——这就是下一个要学的 `createDataStream` 概念。
