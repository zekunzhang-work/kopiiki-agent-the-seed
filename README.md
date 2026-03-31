# Kopiiki Code: The Seed 🌱

### The ultimate Vercel AI SDK v6 + Next.js baseline.

This repository is a "Seed" project—a pure, minimalist foundation for building AI Coding Agents. It represents the state of the **Kopiiki Code** project at the end of **Lecture 02**.

## ⭐ Features

-   **Next.js 15 (App Router)** & **Shadcn UI** pre-configured.
-   **Vercel AI SDK v6** Core implementation.
-   **Gemini 3 Flash** ready with thinking level medium.
-   **Clean Chat Interface**: A simple, robust basis for adding advanced features like Tools, Loops, and Artifacts.

## 📖 Integrated Lectures

This seed includes the first two foundational lectures in the `Handoff/concepts/` directory:

1.  **[01-streamText.md](Handoff/concepts/01-streamText.md)**: Fundamental streaming with AI SDK Core.
2.  **[02-tools-and-tool-call.md](Handoff/concepts/02-tools-and-tool-call.md)**: Introduction to tool definition and calling.

## 🚀 How to use this Seed

### 1. Clone & Install
```bash
git clone https://github.com/zekunzhang-work/kopiiki-agent-the-seed.git
cd kopiiki-agent-the-seed
npm install
```

### 2. Environment
Add your API key to `.env.local`:
```env
GOOGLE_GENERATIVE_AI_API_KEY=your_key
```

### 3. Start Coding
```bash
npm run dev
```

## 🛤️ Roadmap from here
Use this repository to practice:
-   Implementing `maxSteps` (or `stopWhen`) for multi-step agents.
-   Building a file-system interface (`read_file`, `write_file`).
-   Creating a custom `DataStream` for UI components.

---
Built as part of the **Kopiiki Agent** educational series.
