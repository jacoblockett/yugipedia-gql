# Schema for Yugipedia API GraphQL Wrapper

```gql
type RootQuery {
  card(name: String!): Card
  set(name: String!): Set
}

type Card {
  actions: Actions
  anti: AntiOrPro
  appearsIn: [String!]
  cardType: String
  charactersDepicted: [String!]
  debutDate: DebutDate
  deckType: String
  description: LocaleText
  effectTypes: [String!]
  error: Error
  image: CardImage
  isReal: Boolean
  konamiID: String
  limitation: String
  materials: Materials
  mediums: [String!]
  mentions: [Card!]
  miscTags: [String!]
  name: LocaleText
  page: WikiPage
  password: String
  pendulum: Pendulum
  pro: AntiOrPro
  related: Related
  releases: [String!]
  stats: Stats
  status: Status
  summonedBy: [Card!]
  types: [String!]
  usedBy: [String!]
}

type Actions {
  all: [String!]
  attack: [String!]
  banish: [String!]
  card: [String!]
  counter: [String!]
  lifepoint: [String!]
  stat: [String!]
  summoning: [String!]
}

type AntiOrPro {
  all: [String!]
  support: [String!]
  archetype: [String!]
}

type DebutDate {
  main: String
  ocg: String
  tcg: String
  tcgSpeedDuel: String
}

type LocaleText {
  arabic: String
  chinese: ChineseTextObject
  croatian: String
  english: String
  french: String
  german: String
  greek: String
  italian: String
  japanese: JapaneseTextObject
  korean: KoreanTextObject
  portuguese: String
  spanish: String
}

type ChineseTextObject {
  primary: DetailedChineseTextObject
  simplified: DetailedChineseTextObject
  traditional: DetailedChineseTextObject
}

type DetailedChineseTextObject {
  hanzi: String
  jyutping: String
  pinyin: String
  translated: String
}

type JapaneseTextObject {
  html: String
  base: String
  annotation: String
  transposed: String
  adjacent: String
  romaji: JapaneseTextObjectInner
  translated: JapaneseTextObjectInner
}

type JapaneseTextObjectInner {
  base: String
  annotation: String
}

type KoreanTextObject {
  html: String
  base: String
  annotation: String
  transposed: String
  adjacent: String
  romanized: String
  translated: String
}

type Error {
  code: Int
  message: String
}

type CardImage {
  artwork: String
  back: String
  front: String
  name: String
}

type Materials {
  required: [Card!]
  usedFor: [Card!]
}

type WikiPage {
  lastModified: String
  name: String
  semanticProperties: [String!]
  type: String
  url: String
}

type Pendulum {
  effect: LocaleText
  scale: String
}

type Related {
  all: [String!]
  direct: [String!]
  indirect: [String!]
}

type Stats {
  attack: String
  attribute: String
  defense: String
  level: String
  rank: String
  stars: String
  link: Link
}

type Link {
  arrows: [String!]
  rating: String
}

type Status {
  ocg: String
  rushDuel: String
  tcg: String
  tcgSpeedDuel: String
  tcgTraditionalFormat: String
}

type Set {
  code: ProductCode
  coverCards: [Card!]
  error: Error
  format: String
  image: String
  konamiID: SetKonamiDatabaseID
  mediums: [String!]
  name: LocaleText
  page: WikiPage
  parent: Set
  prefix: Prefix
  promotionalSeries: String
  regionalPrefix: Prefix
  releaseDate: SetReleaseDate
  type: String
}

type ProductCode {
  ean: String
  isbn: String
  upc: String
}

type SetKonamiDatabaseID {
  chinese: ChineseStringObject
  english: SetKonamiDatabaseIDEnglish
  french: String
  german: String
  italian: String
  japanese: String
  korean: String
  spanish: String
  portuguese: String
}

type ChineseStringObject {
  simplified: String
  traditional: String
}

type SetKonamiDatabaseIDEnglish {
  asian: String
  earliest: String
}

type Prefix {
  chinese: ChineseStringObject
  english: PrefixEnglish
  french: FrenchLocalDetailObject
  german: String
  italian: String
  japanese: JapaneseLocalDetailObject
  korean: String
  spanish: String
  portuguese: String
}

type PrefixEnglish {
  asian: String
  earliest: String
  european: String
  oceanic: String
}

type FrenchLocalDetailObject {
  canadian: String
  primary: String
}

type JapaneseLocalDetailObject {
  asian: String
  primary: String
}

type SetReleaseDate {
  chinese: ChineseStringObject
  english: SetReleaseDateEnglish
  french: FrenchLocalDetailObject
  german: String
  italian: String
  japanese: JapaneseLocalDetailObject
  korean: String
  spanish: SetReleaseDateSpanish
  portuguese: String
}

type SetReleaseDateEnglish {
  asian: String
  earliest: String
  en: String
  european: String
  northAmerican: String
  oceanic: String
  worldwide: String
}

type SetReleaseDateSpanish {
  european: String
  latinAmerican: String
  primary: String
}
```