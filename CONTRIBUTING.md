# Contributing to Commently

Thank you for your interest in contributing! Commently is an open-source project
by [AgentCoreX](https://agent-corex.com) and we welcome contributions from
the community.

Please read this guide before submitting a pull request.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [License Agreement](#license-agreement)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Reporting Bugs](#reporting-bugs)
- [Requesting Features](#requesting-features)
- [Coding Standards](#coding-standards)

---

## Code of Conduct

Be respectful. Harassment, discrimination, or hostile behaviour toward any
contributor will not be tolerated.

---

## License Agreement

By submitting a contribution (pull request, issue, code snippet, or any other
material) to this repository, you agree that:

1. Your contribution is your original work.
2. You grant **AgentCoreX** a perpetual, worldwide, royalty-free license to use,
   modify, and distribute your contribution, including under future commercial
   licenses.
3. You understand that Commently is licensed under the
   [Commently Non-Commercial License](./LICENSE) — **commercial use without
   written permission from AgentCoreX is prohibited**.

If you are contributing on behalf of an employer or client, ensure you have the
right to assign such rights.

---

## How to Contribute

### Types of contributions we welcome

| Type | Examples |
|------|---------|
| Bug fixes | Fix broken selectors, UI glitches, storage errors |
| New LLM providers | Add Anthropic, Gemini, Cohere support |
| Tone improvements | Better prompts, new preset tones |
| UI/UX improvements | Better popup design, accessibility |
| Documentation | Clearer setup instructions, examples |
| Translations | UI strings in other languages |

### What we don't accept

- Changes that remove the "Powered by AgentCoreX" attribution
- Changes that add commercial monetisation (ads, paywalls) without prior agreement
- Code that introduces tracking, analytics, or data collection on users

---

## Development Setup

### Prerequisites

- Node.js 16+
- npm
- Chrome or Chromium browser

### Steps

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/commently.git
cd commently

# 3. Install dependencies
npm install

# 4. Start the development build (watches for changes)
npm run dev

# 5. Load the extension in Chrome
#    chrome://extensions/ → Enable Developer Mode → Load Unpacked
#    → select the  build/chrome-mv3-dev  folder
```

### Project structure

```
src/
├── background.ts       # Service worker — handles messages & LLM calls
├── content.ts          # Content script — injects UI into LinkedIn
├── popup.tsx           # Popup UI
├── options.tsx         # Settings page
├── types/index.ts      # TypeScript types
├── utils/
│   ├── llm.ts          # OpenAI & local LLM integration
│   ├── storage.ts      # chrome.storage wrapper
│   └── tones.ts        # Preset tones
└── styles/             # CSS
```

### Build commands

```bash
npm run dev      # Development build with hot reload
npm run build    # Production build → build/chrome-mv3-prod
npm run package  # Package as .crx for distribution
```

---

## Submitting a Pull Request

1. **Fork** the repo and create a branch from `main`:
   ```bash
   git checkout -b fix/your-description
   # or
   git checkout -b feat/your-description
   ```

2. **Make your changes** — keep them focused. One PR per concern.

3. **Test manually** in Chrome on `linkedin.com` before submitting.

4. **Commit** with a clear message:
   ```
   fix: correct post text selector for LinkedIn feed
   feat: add Anthropic Claude support
   docs: update Ollama setup instructions
   ```

5. **Open a Pull Request** against the `main` branch with:
   - A clear description of what changed and why
   - Screenshots if it affects the UI
   - Any related issue number (`Fixes #123`)

6. A maintainer will review within a few days. We may request changes before
   merging.

---

## Reporting Bugs

Open an issue at [github.com/ankitpro/commently/issues](https://github.com/ankitpro/commently/issues) and include:

- Chrome version
- Extension version (from `chrome://extensions/`)
- Steps to reproduce
- Expected vs actual behaviour
- Console errors (open DevTools → Console on the LinkedIn page or popup)

---

## Requesting Features

Open a feature request issue with:

- A clear description of the problem you want solved
- Why it would benefit other users
- Any implementation ideas you have

For large features, open an issue to discuss first before writing code.

---

## Coding Standards

- **TypeScript** — all source files must be typed; avoid `any` where possible
- **Formatting** — use the existing code style (2-space indent, single quotes)
- **No console.log** in production paths — use `console.warn`/`console.error` only for real errors
- **No new dependencies** without discussion — keep the bundle lean
- **Preserve attribution** — the "Powered by AgentCoreX" link must remain in popup and settings

---

## Questions?

- Open an issue on GitHub
- Email us at **agentcorex26@gmail.com**
- Visit **[agent-corex.com](https://agent-corex.com)**

We appreciate every contribution, big or small. Thank you! 🙏
