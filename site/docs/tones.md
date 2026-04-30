# Tones Reference

Commently ships with **24 preset tones** and supports unlimited **custom tones**.

Select a tone in the Settings page to set your default, or change it per-comment
directly on the LinkedIn page.

---

## Preset Tones

| Icon | Name | Description |
|------|------|-------------|
| 👔 | **Professional** | Formal and serious — ideal for professional environments |
| 😊 | **Casual** | Relaxed and conversational — friendly and approachable |
| ✨ | **Inspirational** | Uplifting and motivating — encourages and empowers |
| 😂 | **Humorous** | Light-hearted and witty — makes the reader smile |
| 🤗 | **Empathetic** | Compassionate and supportive — shows understanding |
| 📚 | **Informative** | Clear and educational — adds factual value |
| 🧐 | **Critical** | Thoughtful critique — constructive and respectful feedback |
| 📊 | **Analytical** | Logical and data-driven — clear reasoning and evidence |
| 🎉 | **Enthusiastic** | Energetic — conveys excitement and strong interest |
| 🗣️ | **Persuasive** | Compelling — aims to convince with strong arguments |
| 💭 | **Reflective** | Introspective — shares personal reflections or insights |
| 🙂 | **Friendly** | Warm and approachable — builds rapport with the reader |
| 🌞 | **Optimistic** | Positive — focuses on benefits and good outcomes |
| 🌧️ | **Pessimistic** | Cautious — highlights potential drawbacks or concerns |
| ⚖️ | **Neutral** | Impartial — presents information objectively without bias |
| 🛡️ | **Authoritative** | Confident — conveys expertise and commands respect |
| 🤝 | **Conciliatory** | Peace-making — eases tensions and finds common ground |
| ❓ | **Questioning** | Inquisitive — poses thoughtful questions to spark discussion |
| 📖 | **Narrative** | Storytelling — engages through brief anecdotes |
| 👍 | **Supportive** | Affirming — encourages and backs the original poster |
| 🚧 | **Cautious** | Measured — careful consideration, avoids definitive statements |
| 🌟 | **Visionary** | Imaginative — focuses on future possibilities |
| 🤔 | **Disagreement** | Respectful — presents a differing opinion constructively |
| ✅ | **Agreement** | Affirming — expresses concurrence with the original post |

---

## Custom Tones

You can create your own tones in **Settings → 🎭 Comment Tones → Create Custom Tone**.

### Fields

| Field | Required | Description |
|-------|----------|-------------|
| Icon | Yes | Emoji shown in the tone pill |
| Name | Yes | Displayed in the tone bar (max 30 chars) |
| Description | No | Tooltip shown on hover |
| Tone Instruction Prompt | Yes | Sent to the AI to shape the comment style |

### Example Custom Tone

```
Name: Thought Leader
Icon: 💡
Description: Bold, forward-thinking style that challenges assumptions
Prompt: Write in a bold, thought-leadership style that challenges
        conventional thinking, offers a unique perspective, and invites
        the reader to reflect or engage further.
```

### Tips for Writing Prompts

- Be specific about the **style** ("use short punchy sentences")
- Mention what to **include** ("always ask a question at the end")
- Mention what to **avoid** ("don't use corporate jargon")
- Keep prompts under 100 words

---

## How Tones Are Applied

The selected tone's prompt is appended to the AI's system instruction:

```
You are a LinkedIn comment writer. Output ONLY the comment text itself...
Tone instruction: [your tone prompt here]
```

This means tones affect every comment generated — not just wording, but
structure, vocabulary, and emotional register.

---

## Managing Custom Tones

- **Edit** a custom tone with the ✏️ button
- **Delete** a custom tone with the 🗑️ button
- If you delete your active tone, it falls back to Professional
- Custom tones sync across devices via Chrome's sync storage
