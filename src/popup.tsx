import { useEffect, useState } from 'react'
import { storageUtils } from './utils/storage'
import type { StorageConfig } from './types'
import './styles/popup.css'

export default function Popup() {
  const [config, setConfig] = useState<StorageConfig | null>(null)
  const [status, setStatus] = useState<'enabled' | 'disabled' | 'unconfigured'>('disabled')

  useEffect(() => {
    loadConfig()
    storageUtils.onConfigChange((cfg) => {
      setConfig(cfg)
      updateStatus(cfg)
    })
  }, [])

  const loadConfig = async () => {
    const cfg = await storageUtils.getConfig()
    setConfig(cfg)
    updateStatus(cfg)
  }

  const updateStatus = (cfg: StorageConfig) => {
    if (!cfg.isEnabled) {
      setStatus('disabled')
    } else if (cfg.llmConfig.type === 'api' && !cfg.apiKeys.openai) {
      setStatus('unconfigured')
    } else if (cfg.llmConfig.type === 'local' && !cfg.llmConfig.endpoint) {
      setStatus('unconfigured')
    } else {
      setStatus('enabled')
    }
  }

  const toggleExtension = async () => {
    if (config) {
      await storageUtils.setEnabled(!config.isEnabled)
      setConfig({ ...config, isEnabled: !config.isEnabled })
    }
  }

  return (
    <div className="popup-container">
      <div className="popup-header">
        <h1>💬 Commently</h1>
        <p>AI Comment Generator for LinkedIn</p>
      </div>

      <div className={`status-badge status-${status}`}>
        {status === 'enabled' && '✅ Ready to generate comments'}
        {status === 'disabled' && '⏸️ Extension disabled'}
        {status === 'unconfigured' && '⚠️ Please configure settings'}
      </div>

      <div className="popup-content">
        {config?.llmConfig.type === 'api' ? (
          <div className="config-info">
            <p><strong>Mode:</strong> OpenAI API</p>
            <p><strong>Model:</strong> {config?.llmConfig.model || 'gpt-3.5-turbo'}</p>
            {config?.apiKeys.openai
              ? <p className="text-success">✓ API Key configured</p>
              : <p className="text-warning">✗ API Key missing</p>}
          </div>
        ) : (
          <div className="config-info">
            <p><strong>Mode:</strong> Local LLM</p>
            {config?.llmConfig.endpoint ? (
              <>
                <p><strong>Endpoint:</strong> {config.llmConfig.endpoint.substring(0, 30)}...</p>
                {config?.llmConfig.model && <p><strong>Model:</strong> {config.llmConfig.model}</p>}
                <p className="text-success">✓ Endpoint configured</p>
              </>
            ) : (
              <p className="text-warning">✗ Endpoint missing</p>
            )}
          </div>
        )}
      </div>

      <div className="popup-actions">
        <button className="btn btn-primary" onClick={toggleExtension}>
          {config?.isEnabled ? '⏸️ Disable' : '▶️ Enable'}
        </button>
        <button className="btn btn-secondary" onClick={() => chrome.runtime.openOptionsPage()}>
          ⚙️ Settings
        </button>
      </div>

      <div className="popup-footer">
        <p>Visit LinkedIn and click the button to generate AI comments!</p>
        <a href="https://buymeacoffee.com/chillbaba" target="_blank" rel="noreferrer" className="bmc-btn">
          📚 Help us build the next feature
        </a>
        <a href="https://agent-corex.com" target="_blank" rel="noreferrer" className="powered-by">
          ⚡ Powered by AgentCoreX
        </a>
      </div>
    </div>
  )
}
