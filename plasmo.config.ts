import { defineConfig } from "plasmo"

export default defineConfig({
  manifest: {
    host_permissions: ["https://www.linkedin.com/*"],
    permissions: ["storage", "tabs", "scripting"]
  }
})
