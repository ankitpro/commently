import type { StorageConfig, LLMConfig, ApiKeyConfig, Tone } from '../types'
import { DEFAULT_TONE_ID } from './tones'

const STORAGE_KEY = 'commently_config'

const DEFAULTS: StorageConfig = {
  llmConfig: { type: 'api', model: 'gpt-3.5-turbo' },
  apiKeys: {},
  isEnabled: false,
  customTones: [],
  selectedToneId: DEFAULT_TONE_ID
}

export const storageUtils = {
  async getConfig(): Promise<StorageConfig> {
    const result = await chrome.storage.sync.get([STORAGE_KEY])
    return { ...DEFAULTS, ...(result[STORAGE_KEY] || {}) }
  },

  async updateLLMConfig(config: LLMConfig): Promise<void> {
    const current = await this.getConfig()
    current.llmConfig = config
    await chrome.storage.sync.set({ [STORAGE_KEY]: current })
  },

  async updateApiKeys(keys: Partial<ApiKeyConfig>): Promise<void> {
    const current = await this.getConfig()
    current.apiKeys = { ...current.apiKeys, ...keys }
    await chrome.storage.sync.set({ [STORAGE_KEY]: current })
  },

  async setEnabled(enabled: boolean): Promise<void> {
    const current = await this.getConfig()
    current.isEnabled = enabled
    await chrome.storage.sync.set({ [STORAGE_KEY]: current })
  },

  async setSelectedTone(toneId: string): Promise<void> {
    const current = await this.getConfig()
    current.selectedToneId = toneId
    await chrome.storage.sync.set({ [STORAGE_KEY]: current })
  },

  async addCustomTone(tone: Tone): Promise<void> {
    const current = await this.getConfig()
    current.customTones = [...(current.customTones || []), tone]
    await chrome.storage.sync.set({ [STORAGE_KEY]: current })
  },

  async updateCustomTone(tone: Tone): Promise<void> {
    const current = await this.getConfig()
    current.customTones = (current.customTones || []).map((t) =>
      t.id === tone.id ? tone : t
    )
    await chrome.storage.sync.set({ [STORAGE_KEY]: current })
  },

  async deleteCustomTone(toneId: string): Promise<void> {
    const current = await this.getConfig()
    current.customTones = (current.customTones || []).filter((t) => t.id !== toneId)
    if (current.selectedToneId === toneId) {
      current.selectedToneId = DEFAULT_TONE_ID
    }
    await chrome.storage.sync.set({ [STORAGE_KEY]: current })
  },

  async clearConfig(): Promise<void> {
    await chrome.storage.sync.remove([STORAGE_KEY])
  },

  onConfigChange(callback: (config: StorageConfig) => void): void {
    chrome.storage.onChanged.addListener((changes) => {
      if (changes[STORAGE_KEY]) {
        callback({ ...DEFAULTS, ...(changes[STORAGE_KEY].newValue || {}) })
      }
    })
  }
}
