export interface LLMConfig {
  type: 'local' | 'api'
  model?: string
  endpoint?: string
  apiKey?: string
}

export interface ApiKeyConfig {
  openai?: string
  anthropic?: string
  gemini?: string
  huggingface?: string
}

export interface Tone {
  id: string
  name: string
  description: string
  icon: string
  prompt: string
  isCustom?: boolean
}

export interface StorageConfig {
  llmConfig: LLMConfig
  apiKeys: ApiKeyConfig
  isEnabled: boolean
  customTones: Tone[]
  selectedToneId: string
}

export interface GenerateCommentRequest {
  postText: string
  tonePrompt?: string
}

export interface GenerateCommentResponse {
  success: boolean
  comment: string
  error?: string
}
