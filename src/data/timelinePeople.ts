// Data for the Christian history timeline tool.
// Negative years are BC, positive are AD (there is no year 0 here, so ±1 year of drift near the BC/AD boundary is ignored).
// `approx: true` means the dates are traditional or scholarly estimates, shown with "c." in the UI.
// Early-history dates follow a conventional chronology and are debated, so treat them as approximate.

export type EraId =
  | 'patriarchs'
  | 'exodus'
  | 'kings'
  | 'new-testament'
  | 'early-church'
  | 'reformation'
  | 'revival'
  | 'present-day'

export interface Era {
  id: EraId
  label: string
  // Full literal class strings so Tailwind's scanner picks them up.
  bar: string
  chipOn: string
}

export interface Person {
  id: string
  name: string
  start: number
  end: number
  approx?: boolean
  era: EraId
  role: string
  summary: string
}

export const eras: Era[] = [
  { id: 'patriarchs', label: 'Patriarchs', bar: 'bg-amber-500', chipOn: 'bg-amber-500 border-amber-500 text-white' },
  { id: 'exodus', label: 'Exodus & Judges', bar: 'bg-orange-500', chipOn: 'bg-orange-500 border-orange-500 text-white' },
  { id: 'kings', label: 'Kings & Prophets', bar: 'bg-purple-500', chipOn: 'bg-purple-500 border-purple-500 text-white' },
  { id: 'new-testament', label: 'New Testament', bar: 'bg-sky-500', chipOn: 'bg-sky-500 border-sky-500 text-white' },
  { id: 'early-church', label: 'Early Church', bar: 'bg-emerald-500', chipOn: 'bg-emerald-500 border-emerald-500 text-white' },
  { id: 'reformation', label: 'Reformation', bar: 'bg-rose-500', chipOn: 'bg-rose-500 border-rose-500 text-white' },
  { id: 'revival', label: 'Puritans & Revival', bar: 'bg-indigo-500', chipOn: 'bg-indigo-500 border-indigo-500 text-white' },
  { id: 'present-day', label: 'Present Day', bar: 'bg-indigo-100', chipOn: 'bg-indigo-500 border-indigo-500 text-white' },
]

export const people: Person[] = [
  // Patriarchs
  { id: 'abraham', name: 'Abraham', start: -2000, end: -1825, approx: true, era: 'patriarchs', role: 'Father of the faithful', summary: 'Called by God out of Ur to a land he did not know. God promised him a nation, a land and blessing for all peoples, and he was counted righteous because he believed.' },
  { id: 'isaac', name: 'Isaac', start: -1900, end: -1720, approx: true, era: 'patriarchs', role: 'Son of promise', summary: 'The child of promise born to Abraham and Sarah in their old age. He carried the covenant promises forward to his son Jacob.' },
  { id: 'jacob', name: 'Jacob', start: -1840, end: -1690, approx: true, era: 'patriarchs', role: 'Israel', summary: 'Renamed Israel after wrestling with God. His twelve sons became the twelve tribes of the nation.' },
  { id: 'joseph', name: 'Joseph', start: -1750, end: -1640, approx: true, era: 'patriarchs', role: 'Preserver of his family in Egypt', summary: 'Sold into slavery by his brothers, he rose to rule under Pharaoh and saved many lives in famine. He told his brothers that what they meant for evil, God meant for good.' },

  // Exodus & Judges
  { id: 'moses', name: 'Moses', start: -1526, end: -1406, approx: true, era: 'exodus', role: 'Deliverer and lawgiver', summary: 'Led Israel out of Egypt, received the Law at Sinai, and wrote the Pentateuch. He died within sight of the Promised Land.' },
  { id: 'joshua', name: 'Joshua', start: -1485, end: -1375, approx: true, era: 'exodus', role: 'Leader of the conquest', summary: 'Moses\u2019 successor, who led Israel across the Jordan into Canaan. He urged the people to choose whom they would serve.' },
  { id: 'deborah', name: 'Deborah', start: -1210, end: -1150, approx: true, era: 'exodus', role: 'Prophetess and judge', summary: 'Judged Israel from under a palm tree and led the nation to victory over Sisera\u2019s army alongside Barak.' },
  { id: 'samuel', name: 'Samuel', start: -1100, end: -1010, approx: true, era: 'exodus', role: 'Last judge and prophet', summary: 'Dedicated to the Lord as a child, he anointed both Saul and David as kings of Israel.' },

  // Kings & Prophets
  { id: 'david', name: 'David', start: -1040, end: -970, approx: true, era: 'kings', role: 'King and psalmist', summary: 'The shepherd who became Israel\u2019s greatest king, described as a man after God\u2019s own heart. The Messiah would come from his line, and he wrote many of the Psalms.' },
  { id: 'solomon', name: 'Solomon', start: -990, end: -931, approx: true, era: 'kings', role: 'King and wise man', summary: 'Built the first temple in Jerusalem and is associated with Proverbs, Ecclesiastes and the Song of Songs.' },
  { id: 'elijah', name: 'Elijah', start: -910, end: -850, approx: true, era: 'kings', role: 'Prophet', summary: 'Confronted the prophets of Baal on Mount Carmel and was taken up to heaven in a whirlwind.' },
  { id: 'isaiah', name: 'Isaiah', start: -765, end: -685, approx: true, era: 'kings', role: 'Prophet', summary: 'Prophesied judgement and comfort to Judah, and foretold the suffering servant and the coming Messiah.' },
  { id: 'jeremiah', name: 'Jeremiah', start: -650, end: -570, approx: true, era: 'kings', role: 'The weeping prophet', summary: 'Warned Judah of coming exile for decades and promised a new covenant written on the heart.' },
  { id: 'daniel', name: 'Daniel', start: -620, end: -535, approx: true, era: 'kings', role: 'Prophet in exile', summary: 'Served in the courts of Babylon and Persia and stayed faithful, including in the lions\u2019 den. His visions reveal God\u2019s rule over the kingdoms of the world.' },
  { id: 'nehemiah', name: 'Nehemiah', start: -500, end: -430, approx: true, era: 'kings', role: 'Governor and rebuilder', summary: 'Led the exiles in rebuilding Jerusalem\u2019s walls in fifty-two days, in the face of opposition.' },

  // New Testament
  { id: 'john-baptist', name: 'John the Baptist', start: -5, end: 29, approx: true, era: 'new-testament', role: 'Forerunner', summary: 'Called Israel to repentance and baptised Jesus, pointing to him as the Lamb of God.' },
  { id: 'jesus', name: 'Jesus Christ', start: -4, end: 30, approx: true, era: 'new-testament', role: 'Son of God and Saviour', summary: 'The incarnate Son, who lived without sin, died on the cross for sinners and rose again on the third day. The whole timeline turns on him.' },
  { id: 'peter', name: 'Peter', start: 1, end: 67, approx: true, era: 'new-testament', role: 'Apostle', summary: 'The fisherman who confessed Christ, denied him, was restored, and preached at Pentecost. Tradition says he was martyred in Rome.' },
  { id: 'paul', name: 'Paul', start: 5, end: 67, approx: true, era: 'new-testament', role: 'Apostle to the Gentiles', summary: 'A persecutor turned apostle. He planted churches across the Roman world and wrote around thirteen New Testament letters.' },
  { id: 'john', name: 'John', start: 6, end: 100, approx: true, era: 'new-testament', role: 'Apostle and evangelist', summary: 'The beloved disciple, traditionally the author of the fourth Gospel, three letters and Revelation.' },

  // Early Church
  { id: 'polycarp', name: 'Polycarp', start: 69, end: 155, era: 'early-church', role: 'Bishop of Smyrna and martyr', summary: 'A disciple of John, he was martyred at about eighty-six after refusing to deny Christ.' },
  { id: 'justin', name: 'Justin Martyr', start: 100, end: 165, approx: true, era: 'early-church', role: 'Apologist', summary: 'Defended the faith to the Roman world and described early Christian worship. He was executed for his faith.' },
  { id: 'athanasius', name: 'Athanasius', start: 296, end: 373, era: 'early-church', role: 'Bishop of Alexandria', summary: 'Stood against Arianism in defence of Christ\u2019s full deity, often at the cost of exile.' },
  { id: 'augustine', name: 'Augustine', start: 354, end: 430, era: 'early-church', role: 'Bishop of Hippo', summary: 'Author of Confessions and The City of God, and an influential teacher on sin and grace.' },
  { id: 'patrick', name: 'Patrick', start: 385, end: 461, approx: true, era: 'early-church', role: 'Missionary to Ireland', summary: 'Once enslaved in Ireland, he returned as a missionary and saw many come to faith.' },

  // Reformation
  { id: 'wycliffe', name: 'John Wycliffe', start: 1328, end: 1384, era: 'reformation', role: 'Morning star of the Reformation', summary: 'Oversaw the first complete English translation of the Bible and taught that Scripture is the supreme authority.' },
  { id: 'hus', name: 'Jan Hus', start: 1369, end: 1415, era: 'reformation', role: 'Preacher and martyr', summary: 'Bohemian reformer who preached from Scripture and was burned at the stake at the Council of Constance.' },
  { id: 'luther', name: 'Martin Luther', start: 1483, end: 1546, era: 'reformation', role: 'Reformer', summary: 'His Ninety-five Theses in 1517 sparked the Reformation. He recovered justification by faith alone and translated the Bible into German.' },
  { id: 'tyndale', name: 'William Tyndale', start: 1494, end: 1536, era: 'reformation', role: 'Bible translator and martyr', summary: 'Translated the New Testament into English from the original Greek and was strangled and burned for it.' },
  { id: 'calvin', name: 'John Calvin', start: 1509, end: 1564, era: 'reformation', role: 'Reformer and theologian', summary: 'Wrote the Institutes of the Christian Religion and taught expositorily in Geneva.' },
  { id: 'knox', name: 'John Knox', start: 1514, end: 1572, era: 'reformation', role: 'Scottish Reformer', summary: 'Led the Reformation in Scotland and was known for his fearless preaching.' },

  // Puritans & Revival
  { id: 'owen', name: 'John Owen', start: 1616, end: 1683, era: 'revival', role: 'Puritan theologian', summary: 'Wrote deeply on the Trinity, communion with God and the mortification of sin.' },
  { id: 'bunyan', name: 'John Bunyan', start: 1628, end: 1688, era: 'revival', role: 'Preacher and author', summary: 'Imprisoned for preaching without a licence, he wrote The Pilgrim\u2019s Progress during his confinement.' },
  { id: 'watts', name: 'Isaac Watts', start: 1674, end: 1748, era: 'revival', role: 'Hymn writer', summary: 'Called the father of English hymnody, with over 700 hymns to his name, including \u201cWhen I Survey the Wondrous Cross\u201d.' },
  { id: 'edwards', name: 'Jonathan Edwards', start: 1703, end: 1758, era: 'revival', role: 'Pastor and theologian', summary: 'A key figure in the Great Awakening in New England, and one of the most formidable theologians America has produced.' },
  { id: 'wesley', name: 'John Wesley', start: 1703, end: 1791, era: 'revival', role: 'Evangelist and founder of Methodism', summary: 'Rode thousands of miles preaching across Britain, and with his brother Charles led the Methodist revival.' },
  { id: 'whitefield', name: 'George Whitefield', start: 1714, end: 1770, era: 'revival', role: 'Evangelist', summary: 'A powerful open-air preacher who crossed the Atlantic repeatedly during the Great Awakening.' },
  { id: 'carey', name: 'William Carey', start: 1761, end: 1834, era: 'revival', role: 'Missionary to India', summary: 'The \u201cfather of modern missions\u201d. A Baptist cobbler who went to India, translated Scripture and urged the church to attempt great things for God.' },
  { id: 'spurgeon', name: 'Charles Spurgeon', start: 1834, end: 1892, era: 'revival', role: 'Baptist preacher', summary: 'The \u201cPrince of Preachers\u201d. He pastored the Metropolitan Tabernacle in London for decades and left a huge body of sermons and writing that is still read today.' },

//   { id: 'relf', name: 'Paul Relf', start: 2006, end: 2026, era: 'present-day', role: 'Baptist preacher', summary: 'My Pastor' },
]