import type { Tone } from '../types'

export const PRESET_TONES: Tone[] = [
  {
    id: 'Informative',
    name: 'Informative',
    icon: '📚',
    description: 'This tone is used to provide information and educate the reader, and is characterized by a clear and concise style of writing',
    prompt: 'Comment should be informative and educational, offering valuable insights or knowledge to the reader. It should be characterized by a clear, concise writing style that effectively communicates the information.'
  },
  {
    id: 'Professional',
    name: 'Professional',
    icon: '👔',
    description: 'This tone is typically used in professional settings and is characterized by a serious, formal style of writing.',
    prompt: 'Comment should be written in a formal manner appropriate for a professional environment. The tone should be serious, respectful, and use professional language to convey credibility.'
  },
  {
    id: 'Casual',
    name: 'Casual',
    icon: '😊',
    description: 'This tone is more relaxed and conversational, and is often used in social media and other informal settings.',
    prompt: 'Comment should be written in a relaxed, conversational style, similar to how you\'d speak with friends in an informal setting. The tone should be friendly and approachable, avoiding formal language and seriousness.'
  },
  {
    id: 'Humorous',
    name: 'Humorous',
    icon: '😂',
    description: 'This tone is characterized by a light-hearted and humorous style of writing, often incorporating jokes or puns.',
    prompt: 'Comment should be written in a light-hearted, humorous style, often incorporating jokes, puns, or witty remarks with the intention of making readers laugh.'
  },
  {
    id: 'Inspirational',
    name: 'Inspirational',
    icon: '✨',
    description: 'An uplifting and motivating tone that aims to inspire the reader.',
    prompt: 'Comment should be uplifting and motivating, aiming to inspire the reader. Use encouraging language and share positive insights that empower others.'
  },
  {
    id: 'Empathetic',
    name: 'Empathetic',
    icon: '🤗',
    description: 'A compassionate tone that expresses understanding and support.',
    prompt: 'Comment should express understanding and compassion. Acknowledge others\' feelings or challenges and respond with warmth and support.'
  },
  {
    id: 'Critical',
    name: 'Critical',
    icon: '🧐',
    description: 'A thoughtful tone offering constructive feedback and respectful critique.',
    prompt: 'Comment should offer thoughtful critique, providing constructive feedback. Be respectful yet honest, highlighting areas of concern with reasoned arguments.'
  },
  {
    id: 'Analytical',
    name: 'Analytical',
    icon: '📊',
    description: 'A logical and data-driven tone that analyzes the topic with clear reasoning.',
    prompt: 'Comment should be logical and data-driven, analyzing the topic with clear reasoning. Present facts and evidence to support your insights.'
  },
  {
    id: 'Enthusiastic',
    name: 'Enthusiastic',
    icon: '🎉',
    description: 'An energetic tone conveying excitement and strong interest in the topic.',
    prompt: 'Comment should convey excitement and passion about the topic. Use energetic language to express strong interest and positivity.'
  },
  {
    id: 'Persuasive',
    name: 'Persuasive',
    icon: '🗣️',
    description: 'A compelling tone aiming to convince the reader of a particular viewpoint.',
    prompt: 'Comment should aim to convince the reader of a particular viewpoint. Use compelling arguments and persuasive language to influence their perspective.'
  },
  {
    id: 'Reflective',
    name: 'Reflective',
    icon: '💭',
    description: 'An introspective tone sharing personal reflections or insights.',
    prompt: 'Comment should be introspective and thoughtful, sharing personal reflections or insights. Encourage contemplation by expressing considered thoughts.'
  },
  {
    id: 'Friendly',
    name: 'Friendly',
    icon: '🙂',
    description: 'A warm and approachable tone that builds rapport with the reader.',
    prompt: 'Comment should be warm and approachable, using a personable tone to build rapport. Be engaging and make the reader feel comfortable.'
  },
  {
    id: 'Optimistic',
    name: 'Optimistic',
    icon: '🌞',
    description: 'A positive tone focusing on potential benefits and good outcomes.',
    prompt: 'Comment should express a positive outlook, focusing on potential benefits and good outcomes. Use hopeful and encouraging language.'
  },
  {
    id: 'Pessimistic',
    name: 'Pessimistic',
    icon: '🌧️',
    description: 'A cautious tone highlighting potential negative outcomes or drawbacks.',
    prompt: 'Comment should express caution or concern about potential negative outcomes. Use a skeptical tone to highlight possible drawbacks.'
  },
  {
    id: 'Neutral',
    name: 'Neutral',
    icon: '⚖️',
    description: 'An impartial tone presenting information objectively without bias.',
    prompt: 'Comment should maintain an impartial perspective, presenting information objectively without personal bias or strong emotions.'
  },
  {
    id: 'Authoritative',
    name: 'Authoritative',
    icon: '🛡️',
    description: 'A confident tone conveying expertise and commanding respect.',
    prompt: 'Comment should convey confidence and expertise. Use assertive language to establish credibility and command respect.'
  },
  {
    id: 'Conciliatory',
    name: 'Conciliatory',
    icon: '🤝',
    description: 'A peace-making tone aiming to ease tensions and find common ground.',
    prompt: 'Comment should aim to ease tensions and find common ground. Use understanding language to promote harmony and resolution.'
  },
  {
    id: 'Questioning',
    name: 'Questioning',
    icon: '❓',
    description: 'An inquisitive tone posing thoughtful questions to provoke discussion.',
    prompt: 'Comment should pose thoughtful questions to provoke discussion or deeper thinking. Use an inquisitive tone to explore the topic further.'
  },
  {
    id: 'Narrative',
    name: 'Narrative',
    icon: '📖',
    description: 'A storytelling tone that engages the reader through brief anecdotes.',
    prompt: 'Comment should tell a brief story or anecdote related to the topic. Use descriptive language to engage the reader through storytelling.'
  },
  {
    id: 'Supportive',
    name: 'Supportive',
    icon: '👍',
    description: 'An affirming tone offering encouragement and backing others\' points.',
    prompt: 'Comment should offer encouragement and back up the original poster\'s points. Use affirming language to show agreement and solidarity.'
  },
  {
    id: 'Cautious',
    name: 'Cautious',
    icon: '🚧',
    description: 'A measured tone expressing careful consideration and avoiding definitive statements.',
    prompt: 'Comment should express careful consideration, avoiding definitive statements. Use measured language to indicate thoughtful deliberation.'
  },
  {
    id: 'Visionary',
    name: 'Visionary',
    icon: '🌟',
    description: 'An imaginative tone focusing on future possibilities and long-term implications.',
    prompt: 'Comment should focus on future possibilities and long-term implications. Use imaginative language to discuss potential developments.'
  },
  {
    id: 'Disagreement',
    name: 'Disagreement',
    icon: '🤔',
    description: 'A respectful tone expressing a differing opinion or opposing viewpoint.',
    prompt: 'Comment should express a differing opinion in a respectful manner. Use considerate language to present your viewpoint while acknowledging others\'.'
  },
  {
    id: 'Agreement',
    name: 'Agreement',
    icon: '✅',
    description: 'A tone expressing concurrence with the original point or opinion.',
    prompt: 'Comment should express agreement with the original post. Use affirmative language to show support and alignment with the viewpoint presented.'
  }
]

export const DEFAULT_TONE_ID = 'Professional'

export function getAllTones(customTones: Tone[]): Tone[] {
  return [...PRESET_TONES, ...customTones]
}

export function findTone(id: string, customTones: Tone[]): Tone {
  return (
    getAllTones(customTones).find((t) => t.id === id) ??
    PRESET_TONES.find((t) => t.id === DEFAULT_TONE_ID)!
  )
}
