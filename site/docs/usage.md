# Usage

How to generate a LinkedIn comment with Commently.

---

## Basic Flow

1. **Go to LinkedIn** — [linkedin.com](https://www.linkedin.com)
2. **Find a post** you want to comment on
3. **Click the comment box** under the post
4. The Commently UI appears below the comment box:
   - A **tone selector bar** with pill buttons
   - A **💬 Generate with Commently** button

5. **Select a tone** (optional — defaults to Professional)
6. **Click the generate button** and wait 3–10 seconds
7. The generated comment is **automatically inserted** into the comment box
8. **Edit if needed**, then click **Post**

---

## Selecting a Tone

The tone bar shows all your available tones as clickable pills:

```
Tone: 👔 Professional  😊 Casual  ✨ Inspirational  😂 Humorous  📊 Analytical  …
```

- Click any pill to select it — it highlights in blue
- Your selection is saved automatically
- Custom tones you create in Settings also appear here

→ See the full [Tones reference](./tones.md)

---

## Screenshot Placeholder

> 📸 **Screenshot coming soon** — will show the tone bar and generate button on a LinkedIn post

---

## Video Walkthrough Placeholder

> 🎬 **Video coming soon** — will show a full walkthrough from clicking the comment box to posting the generated comment

---

## Tips

### Get better comments
- Use a **specific tone** that matches the post's mood
- The AI reads up to 1,500 characters of the post — longer posts give richer context
- If the comment isn't quite right, click generate again for a new one

### If the button doesn't appear
- Make sure Commently is **enabled** (check the popup)
- **Refresh** the LinkedIn page (Ctrl+R / Cmd+R)
- Make sure you clicked **inside** the comment text box
- Check the browser console (F12) for errors

### If generation fails
- Check the popup status — it will show what's misconfigured
- For OpenAI: verify your API key has credits
- For local LLM: ensure your service is running and CORS is allowed

---

## Keyboard Shortcut

There is no keyboard shortcut by default. After clicking Generate, you can press **Tab** to move focus to the Post button.

---

## Privacy

- **OpenAI mode:** the post text and your tone selection are sent to OpenAI's API. No personal profile data is sent.
- **Local LLM mode:** everything stays on your machine. Zero external data transmission.

---

## Next Step

→ [Browse all 24 tones](./tones.md)
