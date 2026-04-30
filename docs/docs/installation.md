# Installation

There are two ways to install Commently.

---

## Option A — Install from Chrome Web Store (Recommended)

> Coming soon — submission in progress.

---

## Option B — Install from Source (Developer Mode)

Use this method to run the latest code or contribute to the project.

### 1. Prerequisites

- [Node.js 16+](https://nodejs.org)
- npm (comes with Node.js)
- Chrome, Edge, or Chromium browser

### 2. Clone the Repository

```bash
git clone https://github.com/ankitpro/commently.git
cd commently
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Build the Extension

```bash
# Development build (auto-rebuilds on file changes)
npm run dev

# OR production build
npm run build
```

The built extension will be in `build/chrome-mv3-dev/` (dev) or `build/chrome-mv3-prod/` (prod).

### 5. Load in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Toggle **Developer mode** on (top-right corner)
3. Click **Load unpacked**
4. Select the `build/chrome-mv3-dev` folder
5. The Commently icon appears in your toolbar ✅

> **Tip:** Pin the extension by clicking the puzzle icon in Chrome's toolbar and pinning Commently.

---

## Updating

If you installed from source, pull the latest changes and rebuild:

```bash
git pull
npm install
npm run build
```

Then click the **reload** button on `chrome://extensions/` next to Commently.

---

## Uninstalling

Go to `chrome://extensions/`, find Commently, and click **Remove**.

---

## Next Step

→ [Configure your AI provider](./configuration.md)
