# Commently — AI Comment Generator for LinkedIn

> Free, open-source Chrome extension by [AgentCoreX](https://agent-corex.com)

Commently generates professional, tone-aware LinkedIn comments using AI.
It works with OpenAI's cloud API **or** a fully local LLM — your choice.

---

## Quick Links

| | |
|---|---|
| [Installation](./installation.md) | Set up the extension in Chrome |
| [Configuration](./configuration.md) | Connect your AI provider |
| [Usage](./usage.md) | Generate your first comment |
| [Tones](./tones.md) | All 24 built-in tones + custom tones |
| [Local LLM](./local-llm.md) | Run Ollama, LM Studio, oobabooga |
| [Contributing](./contributing.md) | Help improve Commently |

---

## What It Does

1. You open LinkedIn and click into any comment box
2. A **tone selector** and a **💬 Generate with Commently** button appear
3. Pick a tone (Professional, Casual, Inspirational, …)
4. Click generate — the AI reads the post and writes a ready-to-post comment
5. Edit if you want, then post

---

## Key Features

- **24 preset tones** — Professional, Casual, Inspirational, Humorous, Analytical, and more
- **Custom tones** — create your own tone with a custom prompt
- **OpenAI API** — use GPT-4o, GPT-4, GPT-3.5-turbo (model selector included)
- **Local LLM** — works with Ollama, LM Studio, oobabooga, GPT4All
- **Privacy-first** — local LLM mode sends zero data to external servers
- **Powered by AgentCoreX** — open source, free to use

---

## Requirements

- Chrome, Edge, or any Chromium-based browser
- Node.js 16+ (for building from source)
- One of:
  - An OpenAI API key, **or**
  - A local LLM service running (Ollama recommended)
