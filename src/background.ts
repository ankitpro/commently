import { llmUtils } from './utils/llm'
import { storageUtils } from './utils/storage'
import type { GenerateCommentRequest, GenerateCommentResponse } from './types'

// Keep the service worker alive during the async LLM fetch.
// In MV3, the SW can be killed between the sendMessage and the response if
// we don't hold a wakelock via chrome.storage or a similar touch.
function keepAlive() {
  chrome.storage.local.get('_ping')
}

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === 'generateComment') {
    const interval = setInterval(keepAlive, 20000)

    handleGenerateComment(request.payload)
      .then(sendResponse)
      .catch((error) => {
        sendResponse({
          success: false,
          comment: '',
          error: error instanceof Error ? error.message : String(error)
        })
      })
      .finally(() => clearInterval(interval))

    return true // keep message port open for async response
  }
})

chrome.tabs.onActivated.addListener(() => updateIcon())
chrome.tabs.onUpdated.addListener(() => updateIcon())

async function updateIcon() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
  if (!tabs[0]) return
  const isLinkedIn = tabs[0].url?.includes('linkedin.com')
  const config = await storageUtils.getConfig()
  const path = isLinkedIn && config.isEnabled ? '/assets/icon.png' : '/assets/icon-inactive.png'
  chrome.action.setIcon({ path })
}

async function handleGenerateComment(
  request: GenerateCommentRequest
): Promise<GenerateCommentResponse> {
  try {
    const comment = await llmUtils.generateComment(request)
    return { success: true, comment }
  } catch (error) {
    return {
      success: false,
      comment: '',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.runtime.openOptionsPage()
})
