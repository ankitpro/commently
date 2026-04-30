<p align="center">
  <img src="logo.png" alt="Commently — AI-Powered LinkedIn Comments" width="600" />
</p>

# Commently — AI Comment Generator for LinkedIn

> Free, open-source Chrome extension by [AgentCoreX](https://agent-corex.com)

[![Buy us a dev book](https://img.shields.io/badge/📚%20Buy%20us%20a%20dev%20book-FFDD00?style=for-the-badge&logoColor=black)](https://buymeacoffee.com/chillbaba)

A Chrome extension that uses AI to generate professional LinkedIn comments. Supports both cloud APIs (OpenAI) and local LLMs (Ollama, LM Studio, and more).

## Features

- ✨ **AI-Powered Comments** - Generate engaging LinkedIn comments with one click
- 🤖 **Local LLM Support** - Use open-source models like Llama 2, Mistral, or Dolphin
- 🔐 **API Key Management** - Securely store API keys for OpenAI and other providers
- ⚡ **Easy Toggle** - Enable/disable the extension from the popup
- 🎨 **Clean UI** - Modern, intuitive interface for settings and generation

## Prerequisites

- Node.js 16+ and npm
- Chrome/Chromium-based browser
- (For local LLM) A local LLM service running (Ollama, LM Studio, oobabooga, etc.)
- (For API mode) An OpenAI API key

## Installation & Setup

### 1. Install Dependencies

```bash
cd commently
npm install
```

### 2. Development Mode

```bash
npm run dev
```

This will:
- Build the extension in development mode
- Watch for file changes
- Create a `.plasmo` folder with the extension bundle

### 3. Load in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Navigate to `commently/build/chrome-mv3-dev` and select it
5. The extension should now appear in your extensions list

## Configuration

### Option 1: Using OpenAI API

1. Click the extension icon in Chrome
2. Click "⚙️ Settings"
3. Select "Use API (OpenAI)"
4. Enter your OpenAI API key (get it from https://platform.openai.com/api-keys)
5. Click "💾 Save Settings"

### Option 2: Using Local LLM

#### With Ollama (Recommended)

```bash
# Install Ollama from https://ollama.ai
# Run Ollama with a model
ollama pull mistral  # or llama2, neural-chat, etc.
set OLLAMA_ORIGINS=*
ollama serve
```

Then in extension settings:
1. Select "Use Local LLM"
2. Enter endpoint: `http://localhost:11434/api/chat`
3. Click "💾 Save Settings"

#### With LM Studio

1. Download from https://lmstudio.ai
2. Load a model and start the server (default: `http://localhost:1234/v1/chat/completions`)
3. In extension settings:
   - Select "Use Local LLM"
   - Enter endpoint: `http://localhost:1234/v1/chat/completions`
   - Click "💾 Save Settings"

#### With oobabooga (Text Generation WebUI)

```bash
# Clone and setup https://github.com/oobabooga/text-generation-webui
# Run with API enabled
python server.py --api
```

Then:
1. In extension settings, select "Use Local LLM"
2. Enter endpoint: `http://localhost:5000/api/chat`
3. Click "💾 Save Settings"

## Usage

1. Navigate to https://www.linkedin.com
2. Find a post you want to comment on
3. Click in the comment box
4. Click the **✨ Generate Comment** button
5. Wait for AI to generate a comment
6. Edit if needed, then post!

## Development

### Project Structure

```
src/
├── background.ts       # Service worker (handles messages)
├── contents.ts         # Content script (injects UI into LinkedIn)
├── popup.tsx          # Popup UI
├── options.tsx        # Settings page
├── types/
│   └── index.ts       # TypeScript types
├── utils/
│   ├── storage.ts     # Chrome storage management
│   └── llm.ts         # LLM API integration
└── styles/
    ├── popup.css      # Popup styling
    └── options.css    # Settings page styling
```

### File Descriptions

- **background.ts**: Handles message passing between content scripts and LLM APIs
- **contents.ts**: Injects the "Generate Comment" button into LinkedIn comment boxes
- **popup.tsx**: Shows extension status and quick toggle
- **options.tsx**: Settings interface for API keys and LLM configuration
- **storage.ts**: Manages Chrome's sync storage for configuration
- **llm.ts**: Handles API calls to OpenAI or local LLM endpoints

### Building for Production

```bash
npm run build
```

This creates optimized builds in `.plasmo/chrome-mv3-prod`.

### Packaging the Extension

```bash
npm run package
```

Creates a `.crx` file ready for distribution.

## Testing Checklist

- [x] Settings page loads and saves configuration
- [x] API mode works with valid OpenAI key
- [x] Local LLM mode connects to endpoint
- [x] Extension button appears in LinkedIn comment boxes
- [x] Comment generation works on sample posts
- [x] Enable/disable toggle works
- [x] Generated comments are reasonable quality
- [x] Error handling for missing API keys
- [x] Error handling for unreachable endpoints

## Troubleshooting

### "Cannot find module '@lib/browserly'"

Delete `.plasmo` folder and rebuild:
```bash
rm -rf .plasmo
npm run dev
```

### Local LLM not responding

- Check that your LLM service is running (`localhost:11434`, `localhost:1234`, etc.)
- Verify the endpoint in settings matches your service
- Check browser console (F12) for error messages

### OpenAI API errors

- Verify your API key is correct
- Check your OpenAI account has credits/isn't rate limited
- Look at browser console for specific error messages

### Button not appearing on LinkedIn

- Ensure the extension is enabled (toggle in popup)
- Refresh the LinkedIn page (Ctrl+R or Cmd+R)
- Check browser console for JavaScript errors
- Verify you're in a comment input box

## Architecture

### Message Flow

```
Content Script (LinkedIn page)
    ↓ (sendMessage)
Background Service Worker
    ↓ (calls LLM)
Local LLM OR OpenAI API
    ↓
Background Service Worker (returns response)
    ↓
Content Script (inserts into comment box)
```

### Storage

All configuration is stored in Chrome's `chrome.storage.sync`, which:
- Automatically syncs across devices with the same Chrome account
- Persists across sessions
- Is only accessible to your extension

## API Documentation

### generateComment Message

Sent from content script to background service worker:

```typescript
{
  action: 'generateComment',
  payload: {
    postText: string,      // The LinkedIn post text
    context?: string,      // Additional context (optional)
    tone?: 'professional' | 'casual' | 'engaging'  // Comment tone
  }
}
```

Response:

```typescript
{
  success: boolean,
  comment: string,
  error?: string
}
```

## Security Considerations

- API keys are stored in Chrome's encrypted storage
- Never logs API keys to console
- Keys are not transmitted outside of official API endpoints
- Local LLM requests go only to your specified endpoint

## Future Features

- [ ] Multiple API provider support (Anthropic, Cohere, HuggingFace)
- [ ] Comment history and favorites
- [ ] Tone/style customization UI
- [x] Batch comment generation
- [x] Integration with other platforms
- [x] User-defined system prompts
- [ ] Rate limiting and usage tracking

## License

Commently is released under the **[Commently Non-Commercial License](./LICENSE)**.

- ✅ Free for personal, educational, and non-commercial use
- ✅ You may modify and contribute back to this project
- ❌ Commercial use (monetising the extension, selling it, white-labelling) is **not permitted** without written permission

**Want to use Commently commercially?**
Contact us at [agentcorex26@gmail.com](mailto:agentcorex26@gmail.com) or visit [agent-corex.com](https://agent-corex.com) to obtain a commercial license.

## Contributing

We welcome contributions! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before submitting a pull request.

## Support

For bugs or feature requests, open an issue on [GitHub](https://github.com/ankitpro/commently/issues).

---

Built with ❤️ by [AgentCoreX](https://agent-corex.com) · **Happy commenting! 💬**

---

### Support Our Work

If Commently saves you time, consider helping us level up:

[![📚 Buy us a dev book](https://img.shields.io/badge/📚%20Buy%20us%20a%20dev%20book-FFDD00?style=for-the-badge&logoColor=black)](https://buymeacoffee.com/chillbaba)

Your support helps us take courses, buy books, and ship better features for you.
