import { useEffect, useState } from 'react'
import { storageUtils } from './utils/storage'
import { llmUtils, type OllamaModel, type OpenAIModel } from './utils/llm'
import type { StorageConfig, LLMConfig, Tone } from './types'
import { PRESET_TONES } from './utils/tones'
import './styles/options.css'

const TONE_ICONS = ['🎯','😊','👔','✨','😂','🤗','📚','🤔','✅','🙅','🤝','💡','🔥','💼','🚀','❤️','🌟','💬','🎉','👏']

const BLANK_TONE: Omit<Tone, 'id'> = { name: '', description: '', icon: '🎯', prompt: '', isCustom: true }

const DEFAULT_OLLAMA_ENDPOINT = 'http://localhost:11434/api/chat'

export default function Options() {
  const [config, setConfig] = useState<StorageConfig | null>(null)
  const [llmType, setLlmType] = useState<'local' | 'api'>('api')
  const [apiKey, setApiKey] = useState('')
  const [localEndpoint, setLocalEndpoint] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [availableModels, setAvailableModels] = useState<OllamaModel[]>([])
  const [isLoadingModels, setIsLoadingModels] = useState(false)
  const [modelFetchError, setModelFetchError] = useState('')
  const [saved, setSaved] = useState(false)

  // OpenAI model state
  const [openAIModels, setOpenAIModels] = useState<OpenAIModel[]>([])
  const [selectedOpenAIModel, setSelectedOpenAIModel] = useState('gpt-3.5-turbo')
  const [isFetchingOpenAIModels, setIsFetchingOpenAIModels] = useState(false)
  const [openAIModelError, setOpenAIModelError] = useState('')

  // Tone state
  const [customTones, setCustomTones] = useState<Tone[]>([])
  const [editingTone, setEditingTone] = useState<Tone | null>(null)
  const [toneForm, setToneForm] = useState<Omit<Tone, 'id'>>(BLANK_TONE)
  const [toneError, setToneError] = useState('')

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    const cfg = await storageUtils.getConfig()
    setConfig(cfg)
    setCustomTones(cfg.customTones || [])
    setLlmType(cfg.llmConfig.type)
    setLocalEndpoint(cfg.llmConfig.endpoint || DEFAULT_OLLAMA_ENDPOINT)
    setSelectedModel(cfg.llmConfig.model || '')
    setApiKey(cfg.apiKeys.openai || '')
    if (cfg.llmConfig.type === 'api' && cfg.llmConfig.model) {
      setSelectedOpenAIModel(cfg.llmConfig.model)
    }
  }

  const handleFetchOpenAIModels = async (key: string) => {
    if (!key.trim()) return
    setIsFetchingOpenAIModels(true)
    setOpenAIModelError('')
    try {
      const models = await llmUtils.fetchOpenAIModels(key)
      setOpenAIModels(models)
      // Keep existing selection if still valid, otherwise default to first
      setSelectedOpenAIModel((prev) => {
        const stillExists = models.some((m) => m.id === prev)
        return stillExists ? prev : (models[0]?.id || 'gpt-3.5-turbo')
      })
    } catch (err) {
      setOpenAIModelError(err instanceof Error ? err.message : 'Failed to fetch models')
    } finally {
      setIsFetchingOpenAIModels(false)
    }
  }

  const isOllamaEndpoint = (endpoint: string): boolean => {
    return (
      endpoint.includes('11434') ||
      endpoint.includes('/api/chat') ||
      endpoint.includes('/api/generate') ||
      endpoint.includes('/api/tags')
    )
  }

  const handleFetchModels = async () => {
    if (!localEndpoint.trim()) {
      setModelFetchError('Please enter a local LLM endpoint first')
      return
    }

    setIsLoadingModels(true)
    setModelFetchError('')
    setAvailableModels([])

    try {
      const models = await llmUtils.fetchOllamaModels(localEndpoint)
      setAvailableModels(models)

      if (models.length === 0) {
        setModelFetchError(
          'No models found. Run "ollama pull mistral" or another model first.'
        )
      } else if (!selectedModel && models.length > 0) {
        setSelectedModel(models[0].name)
      }
    } catch (error) {
      setModelFetchError(
        error instanceof Error ? error.message : 'Failed to fetch models'
      )
    } finally {
      setIsLoadingModels(false)
    }
  }

  const handleSave = async () => {
    if (llmType === 'api' && !apiKey.trim()) {
      alert('Please enter an API key')
      return
    }
    if (llmType === 'local' && !localEndpoint.trim()) {
      alert('Please enter a local LLM endpoint')
      return
    }
    if (llmType === 'local' && isOllamaEndpoint(localEndpoint) && !selectedModel) {
      alert('Please fetch and select an Ollama model')
      return
    }

    const llmConfig: LLMConfig = {
      type: llmType,
      ...(llmType === 'local'
        ? {
            endpoint: localEndpoint,
            ...(selectedModel ? { model: selectedModel } : {})
          }
        : { model: selectedOpenAIModel || 'gpt-3.5-turbo' })
    }

    await storageUtils.updateLLMConfig(llmConfig)
    if (apiKey) {
      await storageUtils.updateApiKeys({ openai: apiKey })
    }

    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const toggleEnabled = async () => {
    if (config) {
      await storageUtils.setEnabled(!config.isEnabled)
      setConfig({ ...config, isEnabled: !config.isEnabled })
    }
  }

  // ── Tone handlers ────────────────────────────────────────────────────────────
  const handleSaveTone = async () => {
    setToneError('')
    if (!toneForm.name.trim()) { setToneError('Name is required'); return }
    if (!toneForm.prompt.trim()) { setToneError('Prompt is required'); return }

    if (editingTone) {
      const updated = { ...editingTone, ...toneForm }
      await storageUtils.updateCustomTone(updated)
      setCustomTones((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
    } else {
      const newTone: Tone = {
        ...toneForm,
        id: `custom_${Date.now()}`,
        isCustom: true
      }
      await storageUtils.addCustomTone(newTone)
      setCustomTones((prev) => [...prev, newTone])
    }
    setEditingTone(null)
    setToneForm(BLANK_TONE)
  }

  const handleEditTone = (tone: Tone) => {
    setEditingTone(tone)
    setToneForm({ name: tone.name, description: tone.description, icon: tone.icon, prompt: tone.prompt, isCustom: true })
    setToneError('')
  }

  const handleDeleteTone = async (toneId: string) => {
    await storageUtils.deleteCustomTone(toneId)
    setCustomTones((prev) => prev.filter((t) => t.id !== toneId))
  }

  const handleCancelToneEdit = () => {
    setEditingTone(null)
    setToneForm(BLANK_TONE)
    setToneError('')
  }

  const formatModelSize = (bytes: number): string => {
    const gb = bytes / (1024 * 1024 * 1024)
    return gb >= 1 ? `${gb.toFixed(1)} GB` : `${(bytes / (1024 * 1024)).toFixed(0)} MB`
  }

  if (!config) {
    return <div className="options-container">Loading...</div>
  }

  const showOllamaModels = llmType === 'local' && isOllamaEndpoint(localEndpoint)

  return (
    <div className="options-container">
      <div className="options-card">
        <h1>⚙️ Commently Settings</h1>

        <div className="settings-section">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={config.isEnabled}
              onChange={toggleEnabled}
            />
            <span>Enable Commently</span>
          </label>
        </div>

        <div className="settings-section">
          <h2>LLM Configuration</h2>

          <div className="radio-group">
            <label>
              <input
                type="radio"
                value="api"
                checked={llmType === 'api'}
                onChange={(e) => setLlmType(e.target.value as 'api')}
              />
              Use API (OpenAI)
            </label>
            <label>
              <input
                type="radio"
                value="local"
                checked={llmType === 'local'}
                onChange={(e) => setLlmType(e.target.value as 'local')}
              />
              Use Local LLM
            </label>
          </div>

          {llmType === 'api' ? (
            <div className="form-group">
              <label htmlFor="apiKey">OpenAI API Key</label>
              <div className="model-selector">
                <input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value)
                    setOpenAIModels([])
                    setOpenAIModelError('')
                  }}
                  placeholder="sk-..."
                  style={{ fontFamily: 'monospace' }}
                />
                <button
                  type="button"
                  className="fetch-models-button"
                  onClick={() => handleFetchOpenAIModels(apiKey)}
                  disabled={!apiKey.trim() || isFetchingOpenAIModels}>
                  {isFetchingOpenAIModels ? '⏳ Loading...' : '🔄 Fetch Models'}
                </button>
              </div>
              <p className="help-text">
                Get your API key from{' '}
                <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer">
                  OpenAI Dashboard
                </a>
              </p>

              {openAIModelError && (
                <p className="error-text">⚠️ {openAIModelError}</p>
              )}

              {openAIModels.length > 0 && (
                <div className="form-group" style={{ marginTop: 12 }}>
                  <label htmlFor="openaiModel">Model</label>
                  <select
                    id="openaiModel"
                    value={selectedOpenAIModel}
                    onChange={(e) => setSelectedOpenAIModel(e.target.value)}
                    style={{
                      width: '100%', padding: '10px 12px', border: '1px solid #ddd',
                      borderRadius: 6, fontSize: 14, background: 'white', cursor: 'pointer'
                    }}>
                    {openAIModels.map((m) => (
                      <option key={m.id} value={m.id}>{m.id}</option>
                    ))}
                  </select>
                  <p className="help-text">✅ {openAIModels.length} models found</p>
                </div>
              )}

              {openAIModels.length === 0 && apiKey && !isFetchingOpenAIModels && !openAIModelError && (
                <div className="form-group" style={{ marginTop: 12 }}>
                  <label htmlFor="openaiModelManual">Model <span style={{ fontWeight: 400, color: '#888' }}>(enter manually or click Fetch Models)</span></label>
                  <input
                    id="openaiModelManual"
                    type="text"
                    value={selectedOpenAIModel}
                    onChange={(e) => setSelectedOpenAIModel(e.target.value)}
                    placeholder="gpt-4o"
                  />
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="form-group">
                <label htmlFor="endpoint">Local LLM Endpoint</label>
                <input
                  id="endpoint"
                  type="url"
                  value={localEndpoint}
                  onChange={(e) => {
                    setLocalEndpoint(e.target.value)
                    setAvailableModels([])
                    setModelFetchError('')
                  }}
                  placeholder="http://localhost:11434/api/chat"
                />
                <p className="help-text">
                  Point to your local LLM endpoint (e.g., Ollama, LM Studio,
                  oobabooga)
                </p>
              </div>

              {showOllamaModels && (
                <div className="form-group">
                  <label htmlFor="model">Ollama Model</label>
                  <div className="model-selector">
                    <select
                      id="model"
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      disabled={availableModels.length === 0}
                    >
                      {availableModels.length === 0 ? (
                        <option value="">
                          {isLoadingModels
                            ? 'Loading models...'
                            : 'Click "Fetch Models" to load'}
                        </option>
                      ) : (
                        availableModels.map((model) => (
                          <option key={model.name} value={model.name}>
                            {model.name}
                            {model.details?.parameter_size
                              ? ` (${model.details.parameter_size})`
                              : ''}
                            {model.size ? ` — ${formatModelSize(model.size)}` : ''}
                          </option>
                        ))
                      )}
                    </select>
                    <button
                      type="button"
                      className="fetch-models-button"
                      onClick={handleFetchModels}
                      disabled={isLoadingModels}>
                      {isLoadingModels ? '⏳ Loading...' : '🔄 Fetch Models'}
                    </button>
                  </div>

                  {modelFetchError && (
                    <p className="error-text">⚠️ {modelFetchError}</p>
                  )}

                  {availableModels.length > 0 && (
                    <p className="help-text">
                      ✅ Found {availableModels.length} model
                      {availableModels.length !== 1 ? 's' : ''} on your local
                      Ollama
                    </p>
                  )}

                  <p className="help-text">
                    Don't see your model? Run{' '}
                    <code>ollama pull mistral</code> in terminal, then click
                    "Fetch Models".
                  </p>
                </div>
              )}

              <div className="llm-tips">
                <h4>Popular Local LLM Options:</h4>
                <ul>
                  <li>
                    <strong>Ollama:</strong> Run <code>ollama serve</code>{' '}
                    on <code>http://localhost:11434/api/chat</code>
                  </li>
                  <li>
                    <strong>LM Studio:</strong> Start server on{' '}
                    <code>http://localhost:1234/v1/chat/completions</code>
                  </li>
                  <li>
                    <strong>oobabooga:</strong> Enable API on{' '}
                    <code>http://localhost:5000/api/chat</code>
                  </li>
                </ul>
                <h4>If "Fetch Models" fails:</h4>
                <ul>
                  <li>
                    Ollama may block browser requests. Start it with:{' '}
                    <code>OLLAMA_ORIGINS=* ollama serve</code>
                  </li>
                  <li>
                    On Windows PowerShell:{' '}
                    <code>$env:OLLAMA_ORIGINS="*"; ollama serve</code>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>

        <div className="settings-section">
          <h2>Supported AI Providers</h2>
          <div className="providers-grid">
            <div className="provider-card">
              <h3>OpenAI</h3>
              <p>GPT-4, GPT-3.5-turbo</p>
            </div>
            <div className="provider-card">
              <h3>Local LLM</h3>
              <p>Llama 2, Mistral, Dolphin, etc.</p>
            </div>
          </div>
        </div>

        {/* ── Tones Section ─────────────────────────────────────────────────── */}
        <div className="settings-section">
          <h2>🎭 Comment Tones</h2>

          {/* Default tone selector */}
          <p className="help-text" style={{ marginBottom: 10 }}>
            Select your default tone. You can also change it per-comment directly on LinkedIn.
          </p>
          <div className="preset-tones-grid">
            {[...PRESET_TONES, ...customTones].map((t) => {
              const isActive = (config?.selectedToneId ?? 'Professional') === t.id
              return (
                <button
                  key={t.id}
                  type="button"
                  title={t.description}
                  className={`preset-tone-chip selectable${isActive ? ' active' : ''}`}
                  onClick={async () => {
                    await storageUtils.setSelectedTone(t.id)
                    setConfig((prev) => prev ? { ...prev, selectedToneId: t.id } : prev)
                  }}
                >
                  <span className="tone-icon">{t.icon}</span>
                  <span className="tone-name">{t.name}</span>
                </button>
              )
            })}
          </div>

          {/* Custom tones list */}
          {customTones.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <h4 style={{ marginBottom: 8, color: '#555' }}>Your Custom Tones</h4>
              <div className="custom-tones-list">
                {customTones.map((tone) => (
                  <div key={tone.id} className="custom-tone-row">
                    <span className="tone-icon">{tone.icon}</span>
                    <div className="custom-tone-info">
                      <strong>{tone.name}</strong>
                      <p>{tone.description || tone.prompt.substring(0, 60) + '…'}</p>
                    </div>
                    <div className="custom-tone-actions">
                      <button className="tone-action-btn" onClick={() => handleEditTone(tone)}>✏️</button>
                      <button className="tone-action-btn tone-delete-btn" onClick={() => handleDeleteTone(tone.id)}>🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Create / Edit form */}
          <div className="tone-form">
            <h4>{editingTone ? '✏️ Edit Tone' : '➕ Create Custom Tone'}</h4>

            <div className="tone-form-row">
              {/* Icon picker */}
              <div className="form-group" style={{ flex: '0 0 auto' }}>
                <label>Icon</label>
                <div className="icon-picker">
                  {TONE_ICONS.map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      className={`icon-option${toneForm.icon === ic ? ' selected' : ''}`}
                      onClick={() => setToneForm((f) => ({ ...f, icon: ic }))}>
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    value={toneForm.name}
                    onChange={(e) => setToneForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Thought Leader"
                    maxLength={30}
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <input
                    type="text"
                    value={toneForm.description}
                    onChange={(e) => setToneForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="Short description shown as tooltip"
                    maxLength={80}
                  />
                </div>
                <div className="form-group">
                  <label>Tone Instruction Prompt *</label>
                  <textarea
                    value={toneForm.prompt}
                    onChange={(e) => setToneForm((f) => ({ ...f, prompt: e.target.value }))}
                    placeholder="e.g. Write in a bold, thought-leadership style that challenges conventional thinking."
                    rows={3}
                  />
                  <p className="help-text">This is appended to the AI's instructions when generating.</p>
                </div>
              </div>
            </div>

            {toneError && <p className="error-text">{toneError}</p>}

            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button className="tone-save-btn" onClick={handleSaveTone}>
                {editingTone ? '💾 Update Tone' : '➕ Add Tone'}
              </button>
              {editingTone && (
                <button className="tone-cancel-btn" onClick={handleCancelToneEdit}>Cancel</button>
              )}
            </div>
          </div>
        </div>

        <button className="save-button" onClick={handleSave}>
          💾 Save Settings
        </button>

        {saved && <div className="success-message">✅ Settings saved!</div>}

        <a
          href="https://buymeacoffee.com/chillbaba"
          target="_blank"
          rel="noreferrer"
          className="options-bmc-btn">
          📚 Buy us a dev book — help us learn & ship more features for you
        </a>

        <div className="options-powered-by">
          <a href="https://agent-corex.com" target="_blank" rel="noreferrer">
            ⚡ Powered by AgentCoreX
          </a>
          <span className="options-powered-sep">·</span>
          <a href="https://github.com/ankitpro/commently" target="_blank" rel="noreferrer">
            ⭐ Star on GitHub
          </a>
        </div>
      </div>
    </div>
  )
}
