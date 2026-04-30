# Local LLM Setup

Run AI comment generation entirely on your own machine — no API keys, no costs,
complete privacy.

---

## Supported Services

| Service | Default Endpoint | Difficulty | Notes |
|---------|-----------------|-----------|-------|
| **Ollama** | `http://localhost:11434/api/chat` | Easy | Recommended |
| **LM Studio** | `http://localhost:1234/v1/chat/completions` | Easy | GUI app |
| **oobabooga** | `http://localhost:5000/api/chat` | Medium | Most features |
| **GPT4All** | `http://localhost:4891/v1/chat/completions` | Easy | Simplest |

---

## Ollama (Recommended)

### Install

- **macOS / Windows:** Download from [ollama.ai](https://ollama.ai)
- **Linux:**
  ```bash
  curl -fsSL https://ollama.ai/install.sh | sh
  ```

### Pull a Model and Start

```bash
ollama pull mistral        # Good balance of speed and quality
ollama serve
```

**Recommended models for LinkedIn comments:**

| Model | Size | Speed | Quality |
|-------|------|-------|---------|
| `mistral` | 4 GB | Fast | ⭐⭐⭐⭐⭐ |
| `neural-chat` | 4 GB | Fast | ⭐⭐⭐⭐ |
| `llama2` | 4–7 GB | Medium | ⭐⭐⭐⭐ |
| `dolphin-2.6` | 2 GB | Very fast | ⭐⭐⭐ |

### Fix CORS (Required for Chrome Extensions)

Ollama blocks browser-origin requests by default. Restart with:

```bash
# macOS / Linux
OLLAMA_ORIGINS=* ollama serve

# Windows PowerShell
$env:OLLAMA_ORIGINS="*"; ollama serve

# Windows CMD
set OLLAMA_ORIGINS=*
ollama serve
```

### Configure in Commently

1. Settings → **Use Local LLM**
2. Endpoint: `http://localhost:11434/api/chat`
3. Click **🔄 Fetch Models** → select your model
4. **💾 Save Settings**

---

## LM Studio

1. Download from [lmstudio.ai](https://lmstudio.ai)
2. Open LM Studio → browse and download a model (e.g. `mistral-7b-instruct`)
3. Go to **Local Server** tab → select model → **Start Server**
4. Configure in Commently:
   - Endpoint: `http://localhost:1234/v1/chat/completions`

---

## oobabooga (Text Generation WebUI)

```bash
git clone https://github.com/oobabooga/text-generation-webui
cd text-generation-webui
pip install -r requirements.txt
python server.py --api --listen
```

Configure in Commently:
- Endpoint: `http://localhost:5000/api/chat`

---

## GPT4All

1. Download from [nomic.ai/gpt4all](https://www.nomic.ai/gpt4all)
2. Install, open the app, download a model
3. Enable the API server in GPT4All settings
4. Configure in Commently:
   - Endpoint: `http://localhost:4891/v1/chat/completions`

---

## Troubleshooting

### "403 Forbidden"
Ollama is blocking the request. See the [CORS fix](#fix-cors-required-for-chrome-extensions) above.

### "Failed to fetch" / "Connection refused"
Your LLM service isn't running. Start it and try again.

### Comments are slow
- Use a smaller model (e.g. `dolphin-2.6` instead of `llama2-13b`)
- Enable GPU acceleration in your LLM service settings

### Poor comment quality
- Use a larger model if you have the RAM
- Use an instruction-tuned variant (models ending in `-instruct` or `-chat`)
- `mistral` and `neural-chat` are optimised for conversation tasks

---

## Hardware Requirements

| Setup | RAM | Model |
|-------|-----|-------|
| Minimum | 8 GB | Dolphin 3B or Mistral 7B (Q4) |
| Recommended | 16 GB | Mistral 7B or Neural-Chat 7B |
| Best quality | 32 GB+ | Llama2-13B or Hermes-13B |
