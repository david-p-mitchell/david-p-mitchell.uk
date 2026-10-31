// Relationships between people in timeline-people.ts.
// `from` and `to` are person ids. The type decides how each side is labelled in the UI.
//
//   family    from = father of to
//   descent   from = ancestor of to (not necessarily direct)
//   successor to took over from `from`
//   mentor    from taught or discipled to
//   influence from's life or writings shaped to
//   colleague worked alongside each other (symmetric)

export type RelationType = 'family' | 'descent' | 'successor' | 'mentor' | 'influence' | 'colleague'

export interface Relation {
  from: string
  to: string
  type: RelationType
  note?: string
}

// [label when viewing `from`, label when viewing `to`]
export const relationLabels: Record<RelationType, [string, string]> = {
  family: ['Father of', 'Son of'],
  descent: ['Ancestor of', 'Descendant of'],
  successor: ['Succeeded by', 'Successor of'],
  mentor: ['Taught', 'Taught by'],
  influence: ['Influenced', 'Influenced by'],
  colleague: ['Worked with', 'Worked with'],
}

// Solid lines for these, dashed for the rest.
export const solidTypes: RelationType[] = ['family', 'descent', 'successor']

export const relations: Relation[] = [
  // Family lines
  { from: 'abraham', to: 'isaac', type: 'family' },
  { from: 'isaac', to: 'jacob', type: 'family' },
  { from: 'jacob', to: 'joseph', type: 'family' },
  { from: 'david', to: 'solomon', type: 'family' },
  { from: 'abraham', to: 'david', type: 'descent', note: 'The promise to Abraham runs through David\u2019s line.' },
  { from: 'david', to: 'jesus', type: 'descent', note: 'Jesus is the promised Son of David.' },

  // Succession
  { from: 'moses', to: 'joshua', type: 'successor', note: 'Joshua led Israel into the land.' },

  // Teaching and discipleship
  { from: 'samuel', to: 'david', type: 'mentor', note: 'Anointed David as king.' },
  { from: 'jesus', to: 'peter', type: 'mentor', note: 'Called as one of the Twelve.' },
  { from: 'jesus', to: 'john', type: 'mentor', note: 'Called as one of the Twelve.' },
  { from: 'john', to: 'polycarp', type: 'mentor', note: 'Early tradition says Polycarp was John\u2019s disciple.' },
  { from: 'calvin', to: 'knox', type: 'mentor', note: 'Knox spent time in Geneva and admired Calvin\u2019s church.' },

  // Colleagues
  { from: 'peter', to: 'paul', type: 'colleague', note: 'They met in Jerusalem and Antioch.' },
  { from: 'peter', to: 'john', type: 'colleague', note: 'Often named together in Acts.' },
  { from: 'wesley', to: 'whitefield', type: 'colleague', note: 'Fellow leaders of the evangelical revival, though they disagreed on predestination.' },
  { from: 'edwards', to: 'whitefield', type: 'colleague', note: 'Whitefield preached at Edwards\u2019 church in 1740.' },

  // Influence
  { from: 'augustine', to: 'luther', type: 'influence', note: 'Luther was an Augustinian monk and read him closely.' },
  { from: 'augustine', to: 'calvin', type: 'influence', note: 'Calvin cites Augustine more than any other church father.' },
  { from: 'wycliffe', to: 'hus', type: 'influence', note: 'Hus drew on Wycliffe\u2019s writings.' },
  { from: 'hus', to: 'luther', type: 'influence', note: 'Luther came to see Hus as a forerunner.' },
  { from: 'luther', to: 'tyndale', type: 'influence', note: 'Tyndale made use of Luther\u2019s writings in his own work.' },
  { from: 'luther', to: 'calvin', type: 'influence' },
  { from: 'edwards', to: 'carey', type: 'influence', note: 'Edwards\u2019 edition of Brainerd\u2019s life stirred a missionary vision in many.' },
  { from: 'whitefield', to: 'spurgeon', type: 'influence', note: 'Spurgeon admired Whitefield as a model of evangelistic preaching.' },
  { from: 'bunyan', to: 'spurgeon', type: 'influence', note: 'Spurgeon loved The Pilgrim\u2019s Progress and quoted it often.' },
  { from: 'owen', to: 'spurgeon', type: 'influence', note: 'Spurgeon read the Puritans widely.' },
]