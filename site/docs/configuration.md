# Configuration

Open the settings page: click the Commently icon → **⚙️ Settings**.

---

## Step 1 — Enable Commently

Toggle **Enable Commently** at the top of the settings page.
When disabled, the generate button does not appear on LinkedIn.

---

## Step 2 — Choose Your AI Provider

### Option A: OpenAI API

Best for: cloud-based generation, highest quality, requires an API key.

1. Select **Use API (OpenAI)**
2. Enter your API key in the **OpenAI API Key** field
3. Click **🔄 Fetch Models** — this loads all your available GPT models
4. Select a model from the dropdown:
   | Model | Speed | Quality | Cost |
   |-------|-------|---------|------|
   | `gpt-4o` | Fast | Excellent | Medium |
   | `gpt-4` | Medium | Excellent | High |
   | `gpt-3.5-turbo` | Very fast | Good | Low |
5. Click **💾 Save Settings**

> **Get an API key:** [platform.openai.com/api-keys](https://platform.openai.com/api-keys)

---

### Option B: Local LLM

Best for: privacy, no API costs, offline use.

1. Select **Use Local LLM**
2. Start your local LLM service (see [Local LLM guide](./local-llm.md))
3. Enter the **endpoint URL** — default for Ollama:
   ```
   http://localhost:11434/api/chat
   ```
4. Click **🔄 Fetch Models** — lists all models installed on your machine
5. Select your model from the dropdown
6. Click **💾 Save Settings**

> **Ollama CORS fix:** If Fetch Models fails, restart Ollama with:
> ```bash
> # macOS / Linux
> OLLAMA_ORIGINS=* ollama serve
>
> # Windows PowerShell
> $env:OLLAMA_ORIGINS="*"; ollama serve
> ```

---

## Step 3 — Set a Default Tone

In the **🎭 Comment Tones** section, click any tone chip to set it as your default.
You can also change the tone per-comment directly on the LinkedIn page.

→ See [all available tones](./tones.md)

---

## Step 4 — Create Custom Tones (Optional)

Scroll to **Create Custom Tone** in the Tones section:

1. Pick an emoji icon
2. Enter a **Name** (e.g. "Thought Leader")
3. Enter a **Description** (shown as tooltip)
4. Write a **Tone Instruction Prompt** — this is sent to the AI:
   > *Write in a bold, thought-leadership style that challenges conventional thinking and invites reflection.*
5. Click **➕ Add Tone**

Your custom tone immediately appears in the LinkedIn tone selector.

---

## Popup Status Indicators

| Status | Meaning |
|--------|---------|
| ✅ Ready to generate comments | All configured, good to go |
| ⏸️ Extension disabled | Toggle it on in settings |
| ⚠️ Please configure settings | API key or endpoint missing |

---

## Next Step

→ [Learn how to use Commently on LinkedIn](./usage.md)
