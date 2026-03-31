# Kopiiki Code: 星火种子 🌱

> 骑上马，然后才能学会驾驭。

[English Version](./README.md)

## 🎯 核心理念："亲手养大你的 Agent"

这不是一个让你直接 clone 就能用的完整项目，而是一粒**种子**——它等待被你亲自浇灌、生长。

这个项目背后的信念是：**掌握 AI Agent 的最好方式，不是继承一个现成的复杂系统，而是从最小可运行的基础出发，每次只深入学习一个核心概念，直到 Agent 真正长成你想要的样子。**

1. **一边教学，一边实践**：每学会一个新能力，你就在 `Handoff/concepts/` 里写下一篇讲义。写代码的同时，你也在彻底搞懂它为什么这样运作。
2. **知识增长就是产品增长**：每掌握一个 SDK 概念，Agent 就真正变得更强大一些。学习和产品演进，是同一个动作。
3. **它是你的**：没有强制架构。你可以把它养成文件编辑器、代码审查助手、结对编程伙伴——任何你需要的样子。

## 📖 初始讲义（01 & 02）

`Handoff/concepts/` 里附带了两篇起步讲义：

1. **[01-streamText.md](Handoff/concepts/01-streamText.md)** — 流式输出的本质：`streamText`、背压控制，以及前端的 `useChat` hook。
2. **[02-tools-and-tool-call.md](Handoff/concepts/02-tools-and-tool-call.md)** — 如何定义工具，以及模型是如何决定调用它们的。

## 🚀 快速开始

```bash
git clone https://github.com/zekunzhang-work/kopiiki-agent-the-seed.git
cd kopiiki-agent-the-seed
npm install
```

在根目录下新建 `.env.local` 文件：
```env
GOOGLE_GENERATIVE_AI_API_KEY=your_key
```

```bash
npm run dev
```

---

本项目是 [Kopiiki Code](https://github.com/zekunzhang-work/kopiiki-agent) 教学系列的起点。
