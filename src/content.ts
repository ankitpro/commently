import type { PlasmoCSConfig } from 'plasmo'
import type { Tone } from './types'
import { PRESET_TONES, getAllTones, findTone, DEFAULT_TONE_ID } from './utils/tones'


export const config: PlasmoCSConfig = {
  matches: ['https://www.linkedin.com/*'],
  run_at: 'document_end'
}

// ─── State ────────────────────────────────────────────────────────────────────
let cachedTones: Tone[] = [...PRESET_TONES]
let selectedToneId: string = DEFAULT_TONE_ID
let isObserverPaused = false

async function loadTones() {
  try {
    const cfg = await chrome.storage.sync.get(['commently_config'])
    const data = cfg['commently_config'] || {}
    cachedTones = getAllTones(data.customTones || [])
    selectedToneId = data.selectedToneId || DEFAULT_TONE_ID
  } catch { /* keep defaults */ }
}

chrome.storage.onChanged.addListener((changes) => {
  if (changes['commently_config']) {
    const data = changes['commently_config'].newValue || {}
    cachedTones = getAllTones(data.customTones || [])
    selectedToneId = data.selectedToneId || DEFAULT_TONE_ID
    refreshAllToneBars()
  }
})

loadTones()

// ─── Tone bar helpers ─────────────────────────────────────────────────────────

function refreshAllToneBars() {
  // Pause observer so DOM mutations during refresh don't retrigger injectCommentUI
  isObserverPaused = true
  document.querySelectorAll<HTMLElement>('.commently-tone-bar').forEach((bar) => {
    renderTonePills(bar)
  })
  isObserverPaused = false
}

function renderTonePills(toneBar: HTMLElement) {
  // Remove old pills (everything after the "Tone:" label span)
  const children = Array.from(toneBar.children)
  children.forEach((child, i) => { if (i > 0) child.remove() })

  cachedTones.forEach((tone) => {
    const pill = document.createElement('button')
    pill.type = 'button'
    const isActive = tone.id === selectedToneId
    pill.title = tone.description
    pill.textContent = `${tone.icon} ${tone.name}`
    applyPillStyle(pill, isActive)

    // Use mousedown instead of click — fires before LinkedIn's event delegation
    pill.addEventListener('mousedown', (e) => {
      e.preventDefault()      // prevent focus loss from input
      e.stopPropagation()     // prevent LinkedIn swallowing the event
      e.stopImmediatePropagation()

      selectedToneId = tone.id

      // Update all pill visuals immediately (sync, no flicker)
      isObserverPaused = true
      document.querySelectorAll<HTMLElement>('.commently-tone-bar').forEach((bar) => {
        bar.querySelectorAll<HTMLElement>('[data-tone-id]').forEach((p) => {
          applyPillStyle(p, p.getAttribute('data-tone-id') === tone.id)
        })
      })
      isObserverPaused = false

      // Persist to storage (fire-and-forget)
      chrome.storage.sync.get(['commently_config']).then((cfg) => {
        const data = cfg['commently_config'] || {}
        data.selectedToneId = tone.id
        chrome.storage.sync.set({ commently_config: data })
      }).catch(() => {/* non-critical */})
    })

    pill.setAttribute('data-tone-id', tone.id)
    toneBar.appendChild(pill)
  })
}

function applyPillStyle(pill: HTMLElement, isActive: boolean) {
  pill.style.cssText = `
    padding: 3px 10px;
    border-radius: 20px;
    border: 1.5px solid ${isActive ? '#0a66c2' : '#ccc'};
    background: ${isActive ? '#e8f0fe' : 'white'};
    color: ${isActive ? '#0a66c2' : '#555'};
    font-size: 12px;
    font-weight: ${isActive ? '600' : '400'};
    cursor: pointer;
    transition: all 0.15s;
    user-select: none;
  `
}

// ─── UI injection ──────────────────────────────────────────────────────────────
let inputCounter = 0

const injectCommentUI = () => {
  document.querySelectorAll('[contenteditable="true"]').forEach((input) => {
    if (input.parentElement?.querySelector('.commently-wrap')) return

    if (!input.id || !input.id.startsWith('cmt-')) {
      input.id = `cmt-${++inputCounter}`
    }

    const wrap = document.createElement('div')
    wrap.className = 'commently-wrap'
    wrap.style.cssText = 'margin-top: 8px;'

    // ── Tone bar ──────────────────────────────────────────────────────────────
    const toneBar = document.createElement('div')
    toneBar.className = 'commently-tone-bar'
    toneBar.setAttribute('data-input-id', input.id)
    toneBar.style.cssText =
      'display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 6px; align-items: center;'

    const toneLabel = document.createElement('span')
    toneLabel.textContent = 'Tone:'
    toneLabel.style.cssText =
      'font-size: 12px; color: #666; font-weight: 600; margin-right: 2px; user-select: none;'
    toneBar.appendChild(toneLabel)

    renderTonePills(toneBar)
    wrap.appendChild(toneBar)

    // ── Generate button ───────────────────────────────────────────────────────
    const button = document.createElement('button')
    button.className = 'commently-button'
    button.type = 'button'
    button.textContent = '💬 Generate with Commently'
    button.style.cssText = `
      padding: 8px 16px;
      background-color: #0a66c2;
      color: white;
      border: none;
      border-radius: 20px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 600;
      transition: background-color 0.2s;
    `
    button.addEventListener('mouseover', () => { button.style.backgroundColor = '#084b94' })
    button.addEventListener('mouseout', () => { button.style.backgroundColor = '#0a66c2' })

    button.addEventListener('click', async (e) => {
      e.preventDefault()
      e.stopPropagation()

      const postText = getPostTextFromContext(input)
      if (!postText) {
        alert('Could not find the post text. Please ensure you are replying to a specific post.')
        return
      }

      const tone = findTone(selectedToneId, cachedTones.filter((t) => !!t.isCustom))

      button.disabled = true
      button.textContent = '⏳ Generating...'

      try {
        const response = await chrome.runtime.sendMessage({
          action: 'generateComment',
          payload: { postText, tonePrompt: tone.prompt }
        })

        if (response.success) {
          ;(input as HTMLDivElement).textContent = response.comment
          input.dispatchEvent(new Event('input', { bubbles: true }))
          ;(input as HTMLDivElement).focus()
        } else {
          alert(`Error: ${response.error}`)
        }
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error)
        alert(`Failed to generate comment: ${msg}`)
      } finally {
        button.disabled = false
        button.textContent = '💬 Generate with Commently'
      }
    })

    // ── Footer row: attribution + coffee ─────────────────────────────────────
    const footerRow = document.createElement('div')
    footerRow.style.cssText =
      'display:flex; align-items:center; justify-content:space-between; margin-top:5px;'

    const attr = document.createElement('a')
    attr.href = 'https://agent-corex.com'
    attr.target = '_blank'
    attr.rel = 'noreferrer'
    attr.textContent = '⚡ Powered by AgentCoreX'
    attr.style.cssText = 'font-size:11px; color:#888; text-decoration:none;'
    attr.addEventListener('mouseover', () => { attr.style.color = '#0a66c2' })
    attr.addEventListener('mouseout',  () => { attr.style.color = '#888' })

    const coffee = document.createElement('a')
    coffee.href = 'https://buymeacoffee.com/chillbaba'
    coffee.target = '_blank'
    coffee.rel = 'noreferrer'
    coffee.textContent = '🚀 Fund our next feature'
    coffee.style.cssText =
      'font-size:11px; color:#555; text-decoration:none; background:#FFDD00; padding:2px 8px; border-radius:10px; font-weight:600;'
    coffee.addEventListener('mouseover', () => { coffee.style.opacity = '0.85' })
    coffee.addEventListener('mouseout',  () => { coffee.style.opacity = '1' })

    footerRow.appendChild(attr)
    footerRow.appendChild(coffee)
    wrap.appendChild(footerRow)

    wrap.appendChild(button)
    input.parentElement?.insertBefore(wrap, input.nextSibling)
  })
}

// ─── Post text extraction ──────────────────────────────────────────────────────
function findPostContainer(el: Element): Element | null {
  let node: Element | null = el.parentElement
  while (node) {
    for (const attr of Array.from(node.attributes)) {
      if (attr.value.startsWith('urn:li:activity:')) return node
      if (attr.value.startsWith('expanded')) return node
    }
    if (node.getAttribute('role') === 'article') return node
    if (node.getAttribute('role') === 'dialog') return node
    node = node.parentElement
  }
  const main = document.querySelector('main')
  return main ? main.parentElement : null
}

function getPostTextFromContext(inputElement: Element): string {
  try {
    const container = findPostContainer(inputElement)
    if (!container) return ''

    const selectors = [
      'p > span[tabindex]',
      'span.break-words > span',
      'article div.reader-article-content'
    ]
    for (const sel of selectors) {
      const el = container.querySelector(sel)
      const text = (el as HTMLElement | null)?.innerText?.trim()
      if (text) return text.substring(0, 1500)
    }
    return ''
  } catch { return '' }
}

// ─── Init ──────────────────────────────────────────────────────────────────────
injectCommentUI()

const observer = new MutationObserver(() => {
  if (!isObserverPaused) injectCommentUI()
})
observer.observe(document.body, { childList: true, subtree: true })

export {}
