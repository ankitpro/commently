import type { LLMConfig, GenerateCommentRequest } from '../types'
import { storageUtils } from './storage'

function buildSystemPrompt(tonePrompt?: string): string {
  const toneInstruction = tonePrompt
    ? `Tone instruction: ${tonePrompt}`
    : 'Write in a professional tone.'
  return `You are a LinkedIn comment writer. Output ONLY the comment text itself — no preamble, no explanation, no meta-commentary, no quotation marks around the comment. The comment must be ready to post as-is. Keep it to 1-3 sentences, add value to the conversation, and use at most one emoji.\n${toneInstruction}`
}

// Strips lines like "Okay, here's a comment:" or "Here is a professional comment:"
// that some models emit before the actual content.
function stripPreamble(text: string): string {
  const lines = text.trim().split('\n')
  // Drop leading lines that look like meta-commentary (end with ":" or start with
  // "here", "okay", "sure", "certainly", "of course", "as requested")
  const metaPattern = /^(okay|ok|sure|certainly|of course|here(?:'s| is)|as requested|below is|the following)/i
  let start = 0
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    if (metaPattern.test(line) || line.endsWith(':')) {
      start = i + 1
    } else {
      break
    }
  }
  // Also strip surrounding quotes the model may wrap the comment in
  let result = lines.slice(start).join('\n').trim()
  if (result.startsWith('"') && result.endsWith('"')) {
    result = result.slice(1, -1).trim()
  }
  return result
}

export interface OllamaModel {
  name: string
  size: number
  modified_at: string
  details?: {
    family?: string
    parameter_size?: string
    quantization_level?: string
  }
}

function getOllamaBaseUrl(endpoint: string): string {
  try {
    const url = new URL(endpoint)
    return `${url.protocol}//${url.host}`
  } catch {
    return endpoint.replace(/\/api\/.*$/, '')
  }
}

export interface OpenAIModel {
  id: string
  created: number
  owned_by: string
}

// Only surface chat-capable models — filter out embeddings, tts, whisper, dall-e, etc.
const CHAT_MODEL_PREFIXES = ['gpt-', 'o1', 'o3', 'o4', 'chatgpt']

function isChatModel(id: string): boolean {
  const lower = id.toLowerCase()
  return CHAT_MODEL_PREFIXES.some((p) => lower.startsWith(p)) &&
    !lower.includes('instruct') &&
    !lower.includes('realtime') &&
    !lower.includes('audio') &&
    !lower.includes('preview') // optionally hide noisy preview variants — remove this line to show all
}

export const llmUtils = {
  async fetchOpenAIModels(apiKey: string): Promise<OpenAIModel[]> {
    if (!apiKey?.trim()) throw new Error('API key is required')

    const response = await fetch('https://api.openai.com/v1/models', {
      headers: { Authorization: `Bearer ${apiKey}` }
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      throw new Error(err?.error?.message || `OpenAI error ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    const models: OpenAIModel[] = (data.data || []).filter((m: OpenAIModel) => isChatModel(m.id))
    // Sort: newer (higher created timestamp) first
    models.sort((a, b) => b.created - a.created)
    return models
  },

  async fetchOllamaModels(endpoint: string): Promise<OllamaModel[]> {
    const baseUrl = getOllamaBaseUrl(endpoint)
    const tagsUrl = `${baseUrl}/api/tags`

    try {
      const response = await fetch(tagsUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!response.ok) {
        throw new Error(`Ollama returned ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return data.models || []
    } catch (error) {
      throw new Error(
        `Failed to fetch Ollama models from ${tagsUrl}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      )
    }
  },

  async generateComment(request: GenerateCommentRequest): Promise<string> {
    const config = await storageUtils.getConfig()

    if (!config.isEnabled) {
      throw new Error('Commently is disabled')
    }

    if (config.llmConfig.type === 'local') {
      return this.generateWithLocal(request, config.llmConfig)
    } else {
      return this.generateWithApi(request, config)
    }
  },

  async generateWithLocal(
    request: GenerateCommentRequest,
    llmConfig: LLMConfig
  ): Promise<string> {
    if (!llmConfig.endpoint) {
      throw new Error('Local LLM endpoint not configured')
    }

    const systemPrompt = buildSystemPrompt(request.tonePrompt)
    const prompt = `Post: "${request.postText}"\n\nWrite a comment:`

    const isOllama = llmConfig.endpoint.includes('11434') || llmConfig.endpoint.includes('/api/chat') || llmConfig.endpoint.includes('/api/generate')

    try {
      let body: Record<string, any>

      if (isOllama && llmConfig.model) {
        body = {
          model: llmConfig.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          stream: false,
          options: {
            temperature: 0.7,
            num_predict: 150
          }
        }
      } else {
        body = {
          prompt,
          system: systemPrompt,
          max_tokens: 150,
          temperature: 0.7,
          ...(llmConfig.model ? { model: llmConfig.model } : {})
        }
      }

      const response = await fetch(llmConfig.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error(
            'Ollama blocked the request (403 Forbidden). ' +
            'Restart Ollama with: OLLAMA_ORIGINS=* ollama serve\n' +
            'On Windows PowerShell: $env:OLLAMA_ORIGINS="*"; ollama serve'
          )
        }
        throw new Error(`Local LLM error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      const raw =
        data.message?.content ||
        data.response ||
        data.text ||
        data.choices?.[0]?.message?.content ||
        ''
      return stripPreamble(raw)
    } catch (error) {
      throw new Error(
        `Failed to reach local LLM: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      )
    }
  },

  async generateWithApi(
    request: GenerateCommentRequest,
    config: any
  ): Promise<string> {
    const apiKey = config.apiKeys.openai
    if (!apiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const systemPrompt = buildSystemPrompt(request.tonePrompt)
    const prompt = `Post: "${request.postText}"\n\nWrite a comment:`

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: config.llmConfig.model || 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          max_tokens: 150,
          temperature: 0.7
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error?.message || 'OpenAI API error')
      }

      const data = await response.json()
      return stripPreamble(data.choices?.[0]?.message?.content || '')
    } catch (error) {
      throw new Error(
        `Failed to generate comment: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      )
    }
  }
}
