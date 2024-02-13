import graphqlFields from "graphql-fields"

/**
 * Parses card fields based on GQL info request object passed by the requesting resolver.
 *
 * @param {any} info The GQL info object passed by the resolver in the schema
 * @param {boolean} [DO_NOT_PARSE_INFO_OBJECT] If the info object is already parsed, pass true
 * @returns
 */
const parseCardFields = (info, DO_NOT_PARSE_INFO_OBJECT) => {
	const fields = DO_NOT_PARSE_INFO_OBJECT
		? Object.entries(info)
		: Object.entries(graphqlFields(info))
	const po = new Set(["Modification date", "Page name", "Page type"]) // po for PrintOuts

	for (let i = 0; i < fields.length; i++) {
		const [field, nested] = fields[i]

		if (field === "actions") {
			if (nested.all || nested.attack) po.add("Attack")
			if (nested.all || nested.banish) po.add("Banishing")
			if (nested.all || nested.counter) po.add("Counters")
			if (nested.all || nested.lifepoint) po.add("LP")
			if (nested.all || nested.card) po.add("MonsterSpellTrap")
			if (nested.all || nested.stat) po.add("Stats")
			if (nested.all || nested.summoning) po.add("Summoning")

			continue
		}

		if (field === "anti") {
			if (nested.all || nested.support) po.add("Anti-support")
			if (nested.all || nested.archetype) po.add("Archetype anti-support")

			continue
		}

		if (field === "pendulum") {
			if (nested.effect?.chinese?.simplified) po.add("Simplified Chinese Pendulum Effect")
			if (nested.effect?.chinese?.traditional) po.add("Traditional Chinese Pendulum Effect")
			if (nested.effect?.english) po.add("Pendulum Effect")
			if (nested.effect?.french) po.add("French Pendulum Effect")
			if (nested.effect?.german) po.add("German Pendulum Effect")
			if (nested.effect?.italian) po.add("Italian Pendulum Effect")
			if (nested.effect?.japanese) po.add("Japanese Pendulum Effect")
			if (nested.effect?.japanese?.translated) po.add("Translated Japanese Pendulum Effect")
			if (nested.effect?.korean) po.add("Korean Pendulum Effect")
			if (nested.effect?.portuguese) po.add("Portuguese Pendulum Effect")
			if (nested.effect?.spanish) po.add("Spanish Pendulum Effect")
			if (nested.scale) po.add("Pendulum Scale string")

			continue
		}

		if (field === "pro") {
			if (nested.all || nested.support) po.add("Support")
			if (nested.all || nested.archetype) po.add("Archetype support")

			continue
		}

		if (field === "related") {
			if (nested.all || nested.direct) po.add("Archseries")
			if (nested.all || nested.indirect) po.add("Archseries related")

			continue
		}

		if (field === "stats") {
			if (nested.attack) po.add("ATK string")
			if (nested.attribute) po.add("Attribute")
			if (nested.defense) po.add("DEF string")
			if (nested.level) po.add("Level string")
			if (nested.rank) po.add("Rank string")
			if (nested.stars) po.add("Stars string")
			if (nested.link?.arrows) po.add("Link Arrows")
			if (nested.link?.rating) po.add("Link Rating")

			continue
		}

		if (field === "name") {
			if (nested.arabic) po.add("Arabic name")
			if (nested.croatian) po.add("Croatian name")
			if (nested.greek) po.add("Greek name")
			if (nested.chinese?.primary?.hanzi) po.add("Chinese name")
			if (nested.chinese?.primary?.jyutping) po.add("Chinese Jyutping name")
			if (nested.chinese?.primary?.pinyin) po.add("Chinese Pinyin name")
			if (nested.chinese?.primary?.translated) po.add("Translated Chinese name")
			if (nested.chinese?.simplified?.hanzi) po.add("Simplified Chinese name")
			if (nested.chinese?.simplified?.pinyin) po.add("Simplified Chinese pinyin name")
			if (nested.chinese?.simplified?.translated) po.add("Translated Simplified Chinese name")
			if (nested.chinese?.traditional?.hanzi) po.add("Traditional Chinese name")
			if (nested.chinese?.traditional?.pinyin) po.add("Traditional Chinese pinyin name")
			if (nested.english) po.add("English name")
			if (nested.french) po.add("French name")
			if (nested.german) po.add("German name")
			if (nested.italian) po.add("Italian name")
			if (
				nested.japanese?.html ||
				nested.japanese?.base ||
				nested.japanese?.annotation ||
				nested.japanese?.transposed ||
				nested.japanese?.adjacent
			)
				po.add("Japanese name")
			if (nested.japanese?.romaji?.base) po.add("Base romaji name")
			if (nested.japanese?.romaji?.annotation) po.add("Romaji name")
			if (nested.japanese?.translated?.base) po.add("Translated Japanese base name")
			if (nested.japanese?.translated?.annotation) po.add("Translated Japanese name")
			if (
				nested.korean?.html ||
				nested.korean?.base ||
				nested.korean?.annotation ||
				nested.korean?.transposed ||
				nested.korean?.adjacent
			)
				po.add("Korean name")
			if (nested.korean?.romanized) po.add("Korean Revised Romanization name")
			if (nested.portuguese) po.add("Portuguese name")
			if (nested.spanish) po.add("Spanish name")
		}

		if (field === "description") {
			if (nested.chinese?.simplified?.hanzi) po.add("Simplified Chinese lore")
			if (nested.chinese?.traditional?.hanzi) po.add("Traditional Chinese lore")
			if (nested.english) po.add("Lore")
			if (nested.french) po.add("French lore")
			if (nested.german) po.add("German lore")
			if (nested.italian) po.add("Italian lore")
			if (
				nested.japanese?.html ||
				nested.japanese?.base ||
				nested.japanese?.annotation ||
				nested.japanese?.transposed ||
				nested.japanese?.adjacent
			)
				po.add("Japanese lore")
			if (nested.japanese?.translated) po.add("Translated Japanese lore")
			if (
				nested.korean?.html ||
				nested.korean?.base ||
				nested.korean?.annotation ||
				nested.korean?.transposed ||
				nested.korean?.adjacent
			)
				po.add("Korean lore")
			if (nested.portuguese) po.add("Portuguese lore")
			if (nested.spanish) po.add("Spanish lore")

			continue
		}

		if (field === "deckType") po.add("Belongs to")
		if (field === "cardType") po.add("Card type (short)")
		if (field === "konamiID") po.add("Database ID")
		if (field === "effectTypes") po.add("Effect type")
		if (field === "materials") {
			if (nested.required) {
				po.add("Fusion Material")
				po.add("Synchro Material")
				po.add("Ritual Spell Card required")
			}
			if (nested.usedFor) {
				po.add("Fusion Material for")
				po.add("Synchro Material for")
				po.add("Ritual Monster required")
			}
		}
		if (field === "types") {
			po.add("Types")
			po.add("Property (short)")
		}
		if (field === "limitation") po.add("Limitation text")
		if (field === "mediums") po.add("Medium")
		if (field === "miscTags") po.add("Misc")
		if (field === "status") {
			if (nested.ocg) po.add("OCG status")
			if (nested.rushDuel) po.add("Rush Duel status")
			if (nested.tcg) po.add("TCG status")
			if (nested.tcgSpeedDuel) po.add("TCG Speed Duel status")
			if (nested.tcgTraditionalFormat) po.add("TCG Traditional Format status")
		}
		if (field === "mentions") po.add("Mentions")
		if (field === "password") po.add("Password")
		if (field === "releases") po.add("Release")
		if (field === "summonedBy") po.add("Summoned by")
		if (field === "image") {
			if (nested.artwork) po.add("Card artwork")
			if (nested.back) po.add("Card backing image")
			if (nested.front) po.add("Card image")
			if (nested.name) po.add("Card image name")
		}
		if (field === "debutDate") {
			if (nested.main) po.add("Debut date")
			if (nested.ocg) po.add("OCG debut date")
			if (nested.tcg) po.add("TCG debut date")
			if (nested.tcgSpeedDuel) po.add("TCG Speed Duel debut date")
		}
		if (field === "usedBy") po.add("In Deck")
		if (field === "appearsIn") po.add("Appears in")
		if (field === "isReal") po.add("Non-physical card")
		if (field === "charactersDepicted") po.add("Character")
	}

	return [...po]
}

export default parseCardFields
