# Kopiiki Code: The Seed 🌱

> The purest starting point for your AI Coding Agent journey.

[中文版自述文件](./README_zh-CN.md)

## 🎯 Philosophy: "Grow Your Own Agent"

This isn't just a template to clone. It's a **seed**—designed to be grown by YOU.

The belief behind this project: the best way to master AI agents is not to inherit a complete solution, but to **start with the minimum viable foundation and build your capabilities one concept at a time**—learning deeply as you go, until the agent reflects exactly what you imagined.

1. **Learn by Doing**: Every concept you practice comes with a written explanation in `Handoff/concepts/`. You don't just write code—you understand why it works, step by step, in real code.
2. **Practice Makes the Product**: As you master each SDK concept, the agent gets genuinely more powerful. Knowledge and product growth are the same motion.
3. **It's Yours**: No forced architecture. Grow it into a file editor, a code reviewer, a pair-programmer—whatever you need.

## 📖 Foundation Lectures (01 & 02)

Two lectures are included in `Handoff/concepts/` to get you started:

1. **[01-streamText.md](Handoff/concepts/01-streamText.md)** — The art of AI streaming: `streamText`, back-pressure, and the frontend `useChat` hook.
2. **[02-tools-and-tool-call.md](Handoff/concepts/02-tools-and-tool-call.md)** — How to define tools and how the model decides to call them.

## 🚀 Quickstart

```bash
git clone https://github.com/zekunzhang-work/kopiiki-agent-the-seed.git
cd kopiiki-agent-the-seed
npm install
```

Add your key to `.env.local`:
```env
GOOGLE_GENERATIVE_AI_API_KEY=your_key
```

```bash
npm run dev
```

---

Built as the starting point of the [Kopiiki Code](https://github.com/zekunzhang-work/kopiiki-agent) educational series.
